import os
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status, UploadFile
from typing import List

# collections
db = get_database()
assignments_col = db["assignments"]
submissions_col = db["assignment_submissions"]
courses_col = db["courses"]
users_col = db["users"]
course_students_col = db["course_students"]

# uploads dir
BASE_UPLOAD_DIR = os.path.join(os.getcwd(), "uploads", "assignments")
os.makedirs(BASE_UPLOAD_DIR, exist_ok=True)

class AssignmentService:
    @staticmethod
    def _now():
        return datetime.now(timezone.utc)

    @staticmethod
    def _to_str_id(doc, id_field="_id"):
        doc["id"] = str(doc[id_field])
        doc.pop(id_field, None)
        return doc

    @staticmethod
    def _ensure_course_exists(course_id: ObjectId):
        if not courses_col.find_one({"_id": course_id}):
            raise HTTPException(status_code=404, detail="Course not found")

    @staticmethod
    def create_assignment(payload):
        course_oid = ObjectId(str(payload.course_id))
        AssignmentService._ensure_course_exists(course_oid)

        now = AssignmentService._now()
        doc = {
            "course_id": course_oid,
            "title": payload.title,
            "description": payload.description,
            "due_date": payload.due_date,
            "max_marks": payload.max_marks or 100,
            "is_auto_generated": payload.is_auto_generated or False,
            "metadata": payload.metadata or {},
            "created_at": now,
            "updated_at": now
        }
        res = assignments_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return AssignmentService._to_str_id(doc)

    @staticmethod
    def list_assignments(course_id: str = None, skip=0, limit=100):
        q = {}
        if course_id:
            if not ObjectId.is_valid(course_id):
                raise HTTPException(status_code=400, detail="Invalid course id")
            q["course_id"] = ObjectId(course_id)
        cursor = assignments_col.find(q).skip(int(skip)).limit(int(limit)).sort("due_date", 1)
        out = []
        for a in cursor:
            out.append(AssignmentService._to_str_id(a))
        return out

    @staticmethod
    def get_assignment(assignment_id: str):
        if not ObjectId.is_valid(assignment_id):
            raise HTTPException(status_code=400, detail="Invalid assignment id")
        a = assignments_col.find_one({"_id": ObjectId(assignment_id)})
        if not a:
            raise HTTPException(status_code=404, detail="Assignment not found")
        return AssignmentService._to_str_id(a)

    @staticmethod
    def update_assignment(assignment_id: str, payload):
        if not ObjectId.is_valid(assignment_id):
            raise HTTPException(status_code=400, detail="Invalid assignment id")
        oid = ObjectId(assignment_id)
        current = assignments_col.find_one({"_id": oid})
        if not current:
            raise HTTPException(status_code=404, detail="Assignment not found")
        update_doc = {k: v for k, v in payload.dict(exclude_unset=True).items()}
        update_doc["updated_at"] = AssignmentService._now()
        assignments_col.update_one({"_id": oid}, {"$set": update_doc})
        return AssignmentService.get_assignment(assignment_id)

    @staticmethod
    def delete_assignment(assignment_id: str):
        if not ObjectId.is_valid(assignment_id):
            raise HTTPException(status_code=400, detail="Invalid assignment id")
        res = assignments_col.delete_one({"_id": ObjectId(assignment_id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Assignment not found")
        # Note: consider deleting submissions files if any
        return {"message": "Assignment deleted"}

    # Submission handling
    @staticmethod
    def _save_file(file: UploadFile, student_id: str, assignment_id: str) -> str:
        # sanitize and create path: uploads/assignments/{assignment_id}/{student_id}/filename
        ass_dir = os.path.join(BASE_UPLOAD_DIR, assignment_id)
        student_dir = os.path.join(ass_dir, student_id)
        os.makedirs(student_dir, exist_ok=True)
        safe_name = file.filename.replace("/", "_").replace("\\", "_")
        path = os.path.join(student_dir, safe_name)
        with open(path, "wb") as f:
            f.write(file.file.read())
        # return relative path
        return path

    @staticmethod
    def submit_assignment(assignment_id: str, student_id: str, notes: str = None, file: UploadFile = None):
        # validations
        if not ObjectId.is_valid(assignment_id):
            raise HTTPException(status_code=400, detail="Invalid assignment id")
        if not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid student id")

        assignment = assignments_col.find_one({"_id": ObjectId(assignment_id)})
        if not assignment:
            raise HTTPException(status_code=404, detail="Assignment not found")

        # check enrollment: student must be enrolled in assignment.course_id
        enrollment = course_students_col.find_one({
            "course_id": assignment["course_id"],
            "student_id": ObjectId(student_id)
        })
        if not enrollment:
            raise HTTPException(status_code=403, detail="Student not enrolled in the course")

        # do not allow submissions after due date
        if datetime.now(timezone.utc) > assignment["due_date"]:
            raise HTTPException(status_code=400, detail="Assignment due date passed")

        file_path = None
        if file:
            file_path = AssignmentService._save_file(file, student_id, assignment_id)

        now = AssignmentService._now()
        sub_doc = {
            "assignment_id": ObjectId(assignment_id),
            "student_id": ObjectId(student_id),
            "file_path": file_path,
            "notes": notes,
            "submitted_at": now,
            "marks_obtained": None,
            "grading_feedback": None
        }

        # upsert: if student already submitted, overwrite previous submission
        existing = submissions_col.find_one({
            "assignment_id": ObjectId(assignment_id),
            "student_id": ObjectId(student_id)
        })
        if existing:
            submissions_col.update_one({"_id": existing["_id"]}, {"$set": sub_doc})
            sub_doc["_id"] = existing["_id"]
        else:
            res = submissions_col.insert_one(sub_doc)
            sub_doc["_id"] = res.inserted_id

        return AssignmentService._to_str_id(sub_doc, id_field="_id")

    @staticmethod
    def list_submissions(assignment_id: str = None, student_id: str = None):
        q = {}
        if assignment_id:
            if not ObjectId.is_valid(assignment_id):
                raise HTTPException(status_code=400, detail="Invalid assignment id")
            q["assignment_id"] = ObjectId(assignment_id)
        if student_id:
            if not ObjectId.is_valid(student_id):
                raise HTTPException(status_code=400, detail="Invalid student id")
            q["student_id"] = ObjectId(student_id)
        cursor = submissions_col.find(q).sort("submitted_at", -1)
        out = []
        for s in cursor:
            out.append(AssignmentService._to_str_id(s))
        return out

    @staticmethod
    def grade_submission(submission_id: str, marks_obtained: float, feedback: str = None):
        if not ObjectId.is_valid(submission_id):
            raise HTTPException(status_code=400, detail="Invalid submission id")
        oid = ObjectId(submission_id)
        existing = submissions_col.find_one({"_id": oid})
        if not existing:
            raise HTTPException(status_code=404, detail="Submission not found")
        submissions_col.update_one({"_id": oid}, {"$set": {
            "marks_obtained": marks_obtained,
            "grading_feedback": feedback,
            "graded_at": AssignmentService._now()
        }})
        return AssignmentService._to_str_id(submissions_col.find_one({"_id": oid}), id_field="_id")

    # AI generation placeholder - returns generated assignment object (not persisted)
    @staticmethod
    def generate_assignment_skeleton(course_id: str, prompt_params: dict):
        """
        Placeholder for AI generation logic.
        Integration plan:
         - Use an LLM (local or API) to generate title, description, questions/metadata
         - Store the generated result by calling create_assignment with is_auto_generated=True
        For now, return a suggested payload.
        """
        suggested = {
            "course_id": course_id,
            "title": f"Auto: {prompt_params.get('topic','Revision Exercise')}",
            "description": f"Generated based on prompt: {prompt_params}",
            "due_date": (AssignmentService._now()).isoformat(),
            "max_marks": prompt_params.get("max_marks", 100),
            "is_auto_generated": True,
            "metadata": prompt_params
        }
        return suggested
