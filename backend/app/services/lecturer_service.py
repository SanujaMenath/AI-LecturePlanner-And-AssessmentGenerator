from datetime import datetime, timezone 
from app.database.connection import get_database
from app.services.auth_service import AuthService
from bson import ObjectId


class LecturerService:

    @staticmethod
    def create_lecturer(data):
        db = get_database()

        if db["users"].find_one({"email": data.email}):
            raise ValueError("Email already exists")

        hashed_pw = AuthService.hash_password(data.password)

        # Create user
        user_doc = {
            "full_name": data.full_name,
            "email": data.email,
            "password": hashed_pw,
            "role": "lecturer",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }

        user_id = db["users"].insert_one(user_doc).inserted_id

        # Create lecturer profile
        lecturer_doc = {
            "user_id": user_id,
            "department": data.department,
            "specialization": data.specialization,
        }

        db["lecturers"].insert_one(lecturer_doc)

        return {
            "user_id": str(user_id),
            "full_name": data.full_name,
            "email": data.email,
            "department": data.department,
            "specialization": data.specialization,
            "created_at": user_doc["created_at"],
            "updated_at": user_doc["updated_at"],
        }

    @staticmethod
    def get_all():
        db = get_database()
        users = list(
            db["users"].aggregate(
                [
                    {
                        "$lookup": {
                            "from": "lecturers",
                            "localField": "_id",
                            "foreignField": "user_id",
                            "as": "profile",
                        }
                    },
                    {"$unwind": "$profile"},
                ]
            )
        )

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
        profile = db["lecturers"].find_one({"user_id": ObjectId(user_id)})

        if not user or not profile:
            return None

        user["user_id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password", None)
        user.update(profile)

        return user

    @staticmethod
    def update_lecturer(user_id, data):
        db = get_database()

        update_doc = {
            **{k: v for k, v in data.dict(exclude_unset=True).items()},
            "updated_at": datetime.now(timezone.utc),
        }
        db["lecturers"].update_one({"user_id": ObjectId(user_id)}, {"$set": update_doc})

        return LecturerService.get_by_id(user_id)

    @staticmethod
    def delete_lecturer(user_id):
        db = get_database()

        db["lecturers"].delete_one({"user_id": ObjectId(user_id)})
        db["users"].delete_one({"_id": ObjectId(user_id)})

        return True
