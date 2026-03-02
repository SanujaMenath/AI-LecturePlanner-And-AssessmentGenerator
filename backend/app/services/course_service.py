# backend/app/services/course_service.py
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status

db = get_database()
courses_col = db["courses"]
course_students_col = db["course_students"]


class CourseService:

    @staticmethod
    def create_course(data):
        if courses_col.find_one({"course_code": data.course_code}):
            raise HTTPException(status_code=400, detail="course_code already exists")

        now = datetime.now(timezone.utc)
        doc = {
            "course_code": data.course_code,
            "course_name": data.course_name,
            "description": data.description,
            "department": data.department,
            "credits": data.credits or 0,
            "year": data.year,
            "semester": data.semester,
            "created_at": now,
            "updated_at": now,
            "lecturer_id": data.lecturer_id 
        }
        res = courses_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        doc["id"] = str(res.inserted_id)
        return doc

    @staticmethod
    def list_courses(skip: int = 0, limit: int = 100):
        docs = courses_col.find().skip(skip).limit(limit)
        out = []
        for d in docs:
            d["id"] = str(d["_id"])
            d.pop("_id", None)
            out.append(d)
        return out

    @staticmethod
    def list_courses_for_user(user):
        courses = CourseService.list_courses()

        if user["role"] != "student":
            return courses

        enrolled = course_students_col.find(
            {"student_id": ObjectId(user["id"])},
            {"course_id": 1}
        )

        enrolled_ids = {str(e["course_id"]) for e in enrolled}

        for c in courses:
            c["is_enrolled"] = c["id"] in enrolled_ids

        return courses


    @staticmethod
    def get_course(course_id: str):
        if not ObjectId.is_valid(course_id):
            raise HTTPException(status_code=400, detail="Invalid course id")
        doc = courses_col.find_one({"_id": ObjectId(course_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Course not found")
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        return doc

    @staticmethod
    def update_course(course_id: str, data):
        if not ObjectId.is_valid(course_id):
            raise HTTPException(status_code=400, detail="Invalid course id")
            
        # CHANGE .dict() to .model_dump()
        update_doc = {k: v for k, v in data.model_dump(exclude_unset=True).items()}
        
        if not update_doc:
            raise HTTPException(status_code=400, detail="No fields to update")
            
        update_doc["updated_at"] = datetime.now(timezone.utc)
        res = courses_col.update_one({"_id": ObjectId(course_id)}, {"$set": update_doc})
        
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")
            
        return CourseService.get_course(course_id)

    @staticmethod
    def delete_course(course_id: str):
        if not ObjectId.is_valid(course_id):
            raise HTTPException(status_code=400, detail="Invalid course id")
        # remove enrollments first (cascade)
        course_students_col.delete_many({"course_id": ObjectId(course_id)})
        res = courses_col.delete_one({"_id": ObjectId(course_id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")
        return {"message": "Course deleted"}

    # Enrollment helpers
    @staticmethod
    def enroll_student(course_id: str, student_id: str):
        if not ObjectId.is_valid(course_id) or not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid IDs")

        course_oid = ObjectId(course_id)
        student_oid = ObjectId(student_id)

        # Check course exists
        course = courses_col.find_one({"_id": course_oid})
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Check student exists
        student = db["users"].find_one({"_id": student_oid})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Check role
        if student.get("role") != "student":
            raise HTTPException(status_code=400, detail="User is not a student")

        # Check already enrolled
        exists = course_students_col.find_one(
            {"course_id": course_oid, "student_id": student_oid}
        )
        if exists:
            raise HTTPException(status_code=400, detail="Student already enrolled")

        now = datetime.now(timezone.utc)
        rec = {
            "course_id": ObjectId(course_id),
            "student_id": ObjectId(student_id),
            "enrolled_at": now,
            "status": "active",
        }

        res = course_students_col.insert_one(rec)

        return {
            "id": str(res.inserted_id),
            "course_id": course_id,
            "student_id": student_id,
            "enrolled_at": now,
            "status": "active",
        }

    @staticmethod
    def unenroll_student(course_id: str, student_id: str):
        # Validate ObjectId format
        if not ObjectId.is_valid(course_id) or not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid IDs")

        course_oid = ObjectId(course_id)
        student_oid = ObjectId(student_id)

        # Check course exists
        course = courses_col.find_one({"_id": course_oid})
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")

        # Check student exists
        student = db["users"].find_one({"_id": student_oid})
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        # Check user role
        if student.get("role") != "student":
            raise HTTPException(status_code=400, detail="User is not a student")

        # Check enrollment record exists
        enrollment = course_students_col.find_one(
            {"course_id": course_oid, "student_id": student_oid}
        )

        if not enrollment:
            raise HTTPException(
                status_code=404, detail="Student not enrolled in this course"
            )

        # Perform deletion
        course_students_col.delete_one(
            {"course_id": course_oid, "student_id": student_oid}
        )

        return {
            "message": "Student unenrolled successfully",
            "course_id": course_id,
            "student_id": student_id,
        }

    @staticmethod
    def get_students_in_course(course_id: str):
        if not ObjectId.is_valid(course_id):
            raise HTTPException(status_code=400, detail="Invalid course id")

        pipeline = [
            {"$match": {"course_id": ObjectId(course_id)}},
            {
                "$lookup": {
                    "from": "students",
                    "localField": "student_id",
                    "foreignField": "user_id",
                    "as": "student_info",
                }
            },
            {"$unwind": "$student_info"},
            {
                "$lookup": {
                    "from": "users",
                    "localField": "student_info.user_id",
                    "foreignField": "_id",
                    "as": "user_info",
                }
            },
            {"$unwind": "$user_info"},
            {
                "$project": {
                    "_id": 0,
                    "user_id": {"$toString": "$user_info._id"},
                    "full_name": "$user_info.full_name",
                    "email": "$user_info.email",
                    "department": "$student_info.department",
                    "year": "$student_info.year",
                    "semester": "$student_info.semester",
                    "enrolled_at": "$enrolled_at",
                    "status": "$status",
                }
            },
        ]

        return list(course_students_col.aggregate(pipeline))

    @staticmethod
    def get_courses_of_student(student_id: str):
        if not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid student id")

        pipeline = [
            # 1. Find the student's enrollments
            {"$match": {"student_id": ObjectId(student_id)}},
            
            # 2. Join the course details
            {
                "$lookup": {
                    "from": "courses",
                    "localField": "course_id",
                    "foreignField": "_id",
                    "as": "course_info",
                }
            },
            {"$unwind": "$course_info"},
            
            # 3. Join the lecturer details
            {
                "$lookup": {
                    "from": "users",
                    "localField": "course_info.lecturer_id",
                    "foreignField": "_id",
                    "as": "lecturer_info",
                }
            },
            # used preserveNullAndEmptyArrays, so the course still shows up 
            # even if an admin hasn't assigned a lecturer yet!
            {
                "$unwind": {
                    "path": "$lecturer_info",
                    "preserveNullAndEmptyArrays": True 
                }
            },
            
            # 4. final output
            {
                "$project": {
                    "_id": 0,
                    "course_id": {"$toString": "$course_info._id"},
                    "course_code": "$course_info.course_code",
                    "course_name": "$course_info.course_name",
                    "description": "$course_info.description",
                    "credits": "$course_info.credits",
                    "semester": "$course_info.semester",
                    
                    # Fallback to "TBA" if lecturer_info is null
                    "lecturer_name": {"$ifNull": ["$lecturer_info.full_name", "TBA"]},
                    
                    # If they don't exist yet, it defaults to 0 and "Never".
                    "progress": {"$ifNull": ["$progress", 0]},
                    "last_accessed": {"$ifNull": ["$last_accessed", "Never"]},
                }
            },
        ]

        results = list(course_students_col.aggregate(pipeline))

        return results
    
    @staticmethod
    def assign_lecturer(course_id: str, lecturer_id: str):
        if not ObjectId.is_valid(course_id) or not ObjectId.is_valid(lecturer_id):
            raise HTTPException(status_code=400, detail="Invalid IDs")

        lecturer = db["users"].find_one({"_id": ObjectId(lecturer_id)})
        if not lecturer or lecturer.get("role") != "lecturer":
            raise HTTPException(status_code=400, detail="Invalid lecturer")

        res = courses_col.update_one(
            {"_id": ObjectId(course_id)},
            {"$set": {"lecturer_id": ObjectId(lecturer_id)}}
        )

        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="Course not found")

        return {"message": "Lecturer assigned"}

    
