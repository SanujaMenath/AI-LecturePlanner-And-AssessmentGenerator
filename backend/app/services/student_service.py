from app.database.connection import get_database
from datetime import datetime, timezone 
from app.services.auth_service import AuthService
from bson import ObjectId

class StudentService:

    @staticmethod
    def create_student(data):
        db = get_database()

        if db["users"].find_one({"email": data.email}):
            raise ValueError("Email already exists")

        hashed_pw = AuthService.hash_password(data.password)
        now = datetime.now(timezone.utc)
        # Create user record
        user_doc = {
            "full_name": data.full_name,
            "email": data.email,
            "password": hashed_pw,
            "role": "student",
            "created_at": now,
            "updated_at": now
        }

        user_id = db["users"].insert_one(user_doc).inserted_id

        # Create student profile
        student_doc = {
            "user_id": user_id,
            "department": data.department,
            "year": data.year,
            "semester": data.semester,
        }

        db["students"].insert_one(student_doc)

        # Combine response
        return {
            "user_id": str(user_id),
            "full_name": data.full_name,
            "email": data.email,
            "department": data.department,
            "year": data.year,
            "semester": data.semester,
            "created_at": user_doc["created_at"],
            "updated_at": user_doc["updated_at"]

        }

    @staticmethod
    def get_all():
        db = get_database()
        users = list(
            db["users"].aggregate([
                {
                    "$lookup": {
                        "from": "students",
                        "localField": "_id",
                        "foreignField": "user_id",
                        "as": "profile"
                    }
                },
                {"$unwind": "$profile"}
            ])
        )

        # cleanup
        for u in users:
            u["user_id"] = str(u["_id"])
            u.pop("_id", None)
            u.pop("password", None)
            u.update(u.pop("profile"))

        return users

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
