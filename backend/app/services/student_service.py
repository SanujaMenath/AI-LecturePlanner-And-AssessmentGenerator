from app.database.connection import get_database
from datetime import datetime, timezone 
from app.services.auth_service import AuthService
from app.models.user import StudentCreate
from bson import ObjectId


db = get_database()

class StudentService:

    @staticmethod
    def _create_student_profile(user_id, data: StudentCreate):
        student_doc = {
            "user_id": user_id,
            "department": data.department,
            "year": data.year,
            "semester": data.semester
        }
        db["students"].insert_one(student_doc)

    

    @staticmethod
    def get_by_id(user_id):
        db = get_database()

        user = db["users"].find_one({"_id": ObjectId(user_id)})
        profile = db["students"].find_one({"user_id": ObjectId(user_id)})

        if not user or not profile:
            return None

        user["user_id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password", None)
        user.update(profile)

        return user

    @staticmethod
    def update_student(user_id, data):
        db = get_database()

        update_doc = {
            **{k: v for k, v in data.dict(exclude_unset=True).items()},
            "updated_at": datetime.now(timezone.utc)
        }

        db["students"].update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": update_doc}
        )

        return StudentService.get_by_id(user_id)

    @staticmethod
    def delete_student(user_id):
        db = get_database()

        db["students"].delete_one({"user_id": ObjectId(user_id)})
        db["users"].delete_one({"_id": ObjectId(user_id)})

        return True
