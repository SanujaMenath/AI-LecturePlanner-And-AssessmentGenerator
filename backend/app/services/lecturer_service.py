from datetime import datetime, timezone
from bson import ObjectId

from app.database.connection import get_database
from app.services.user_service import UserService
from app.models.lecturer import (
    LecturerCreate,
    LecturerUpdate,
    LecturerResponse,
)

class LecturerService:
    @staticmethod
    def create_lecturer(data: LecturerCreate):
        db = get_database()

        # Ensure user exists
        user = UserService.get_user_by_id(str(data.user_id))
        if not user:
            raise ValueError("User not found")

        # Ensure user is lecturer role
        if user["role"] != "lecturer":
            raise ValueError("User is not assigned as lecturer")

        lecturer_doc = {
            "user_id": ObjectId(data.user_id),
            "department": data.department,
            "specialization": data.specialization,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc),
        }

        db["lecturers"].insert_one(lecturer_doc)

        # Build response
        return LecturerResponse(
            user_id=str(data.user_id),
            full_name=user["full_name"],
            email=user["email"],
            department=data.department,
            specialization=data.specialization
        )

    @staticmethod
    def get_all_lecturers():
        db = get_database()
        lecturer_docs = list(db["lecturers"].find())

        response_list = []
        for doc in lecturer_docs:
            user = UserService.get_user_by_id(str(doc["user_id"]))
            if not user:
                continue

            response_list.append(
                LecturerResponse(
                    user_id=str(doc["user_id"]),
                    full_name=user["full_name"],
                    email=user["email"],
                    department=doc["department"],
                    specialization=doc["specialization"],
                )
            )

        return response_list

    @staticmethod
    def get_lecturer_by_id(user_id: str):
        db = get_database()

        doc = db["lecturers"].find_one({"user_id": ObjectId(user_id)})
        if not doc:
            return None

        user = UserService.get_user_by_id(user_id)
        if not user:
            return None

        return LecturerResponse(
            user_id=user_id,
            full_name=user["full_name"],
            email=user["email"],
            department=doc["department"],
            specialization=doc["specialization"],
        )

    @staticmethod
    def update_lecturer(user_id: str, data: LecturerUpdate):
        db = get_database()

        update_data = {k: v for k, v in data.dict().items() if v is not None}
        if not update_data:
            return None

        update_data["updated_at"] = datetime.now(timezone.utc)

        result = db["lecturers"].update_one(
            {"user_id": ObjectId(user_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return None

        return LecturerService.get_lecturer_by_id(user_id)

    @staticmethod
    def delete_lecturer(user_id: str):
        db = get_database()

        result = db["lecturers"].delete_one({"user_id": ObjectId(user_id)})
        return result.deleted_count > 0
