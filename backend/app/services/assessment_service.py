# backend/app/services/assessment_service.py
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status

db = get_database()
assessments_col = db["assessments"]
question_bank_col = db["question_bank"]
course_students_col = db["course_students"]
courses_col = db["courses"]

class AssessmentService:
    @staticmethod
    def _now():
        return datetime.now(timezone.utc)

    @staticmethod
    def _to_str_id(doc, id_field="_id"):
        doc["id"] = str(doc[id_field])
        doc.pop(id_field, None)
        return doc

    @staticmethod
    def _ensure_course(course_id):
        if not courses_col.find_one({"_id": course_id}):
            raise HTTPException(status_code=404, detail="Course not found")

    @staticmethod
    def create_assessment(payload):
        course_oid = ObjectId(str(payload.course_id))
        AssessmentService._ensure_course(course_oid)

        now = AssessmentService._now()
        doc = {
            "course_id": course_oid,
            "module_id": ObjectId(str(payload.module_id)) if payload.module_id else None,
            "title": payload.title,
            "assessment_type": payload.assessment_type,
            "description": payload.description,
            "total_marks": payload.total_marks,
            "settings": payload.settings or {},
            "question_ids": [ObjectId(str(q)) for q in (payload.question_ids or [])],
            "created_at": now,
            "updated_at": now
        }
        res = assessments_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return AssessmentService._to_str_id(doc)

    @staticmethod
    def list_assessments(course_id: str = None, skip=0, limit=100):
        q = {}
        if course_id:
            if not ObjectId.is_valid(course_id):
                raise HTTPException(status_code=400, detail="Invalid course id")
            q["course_id"] = ObjectId(course_id)
        cursor = assessments_col.find(q).skip(int(skip)).limit(int(limit)).sort("created_at", -1)
        out = []
        for a in cursor:
            out.append(AssessmentService._to_str_id(a))
        return out

    @staticmethod
    def get_assessment(assessment_id: str):
        if not ObjectId.is_valid(assessment_id):
            raise HTTPException(status_code=400, detail="Invalid assessment id")
        doc = assessments_col.find_one({"_id": ObjectId(assessment_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Assessment not found")
        return AssessmentService._to_str_id(doc)

    @staticmethod
    def update_assessment(assessment_id: str, payload):
        if not ObjectId.is_valid(assessment_id):
            raise HTTPException(status_code=400, detail="Invalid id")
        oid = ObjectId(assessment_id)
        current = assessments_col.find_one({"_id": oid})
        if not current:
            raise HTTPException(status_code=404, detail="Assessment not found")
        update_doc = {k: v for k, v in payload.dict(exclude_unset=True).items()}
        if "question_ids" in update_doc:
            update_doc["question_ids"] = [ObjectId(str(q)) for q in update_doc["question_ids"]]
        update_doc["updated_at"] = AssessmentService._now()
        assessments_col.update_one({"_id": oid}, {"$set": update_doc})
        return AssessmentService.get_assessment(assessment_id)

    @staticmethod
    def delete_assessment(assessment_id: str):
        if not ObjectId.is_valid(assessment_id):
            raise HTTPException(status_code=400, detail="Invalid id")
        res = assessments_col.delete_one({"_id": ObjectId(assessment_id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Assessment not found")
        # optionally cascade delete attempts
        db["attempts"].delete_many({"assessment_id": ObjectId(assessment_id)})
        return {"message": "Assessment deleted"}
