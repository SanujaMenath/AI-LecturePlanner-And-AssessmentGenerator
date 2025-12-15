from typing import List, Optional
from datetime import datetime, timezone
from bson import ObjectId
from fastapi import HTTPException, status
from app.database.connection import get_database
from app.services.lecturer_service import LecturerService
from app.services.student_service import StudentService
from app.services.auth_service import AuthService
from app.models.user import BaseUser, UserUpdate

db = get_database()
users_col = db["users"]

class UserService:

    @staticmethod
    def list_users(skip: int = 0, limit: int = 50) -> List[dict]:
        docs = users_col.find({}, {"password": 0}).skip(skip).limit(limit)
        return [UserService._clean_user(doc) for doc in docs]

    @staticmethod
    def create_user(data: BaseUser):
        # Email check
        if db["users"].find_one({"email": data.email}):
            raise HTTPException(status_code=400, detail="Email already exists")

        hashed_pw = AuthService.hash_password(data.password)
        now = datetime.now(timezone.utc)

        user_doc = {
            "full_name": data.full_name,
            "email": data.email,
            "password": hashed_pw,
            "role": data.role,
            "created_at": now,
            "updated_at": now
        }

        user_id = db["users"].insert_one(user_doc).inserted_id

        # Role branching
        if data.role == "lecturer":
            LecturerService._create_lecturer_profile(user_id, data)

        elif data.role == "student":
            StudentService._create_student_profile(user_id, data)

        # admin has no separate profile
        return {
            "user_id": str(user_id),
            "full_name": data.full_name,
            "email": data.email,
            "role": data.role,
            "created_at": now,
            "updated_at": now
        }

    @staticmethod
    def get_user_by_id(user_id: str) -> dict:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user id")
        doc = users_col.find_one({"_id": ObjectId(user_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="User not found")
        return doc

    @staticmethod
    def get_user_public(user_id: str) -> dict:
        doc = UserService.get_user_by_id(user_id)
        return UserService._clean_user(doc)

    @staticmethod
    def update_user(user_id: str, payload: UserUpdate) -> dict:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user id")

        update_data = {}
        if payload.full_name:
            update_data["full_name"] = payload.full_name
        if payload.password:
            update_data["password"] = AuthService.hash_password(payload.password)
        update_data["updated_at"] = datetime.now(timezone.utc)

        res = users_col.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        doc = users_col.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        return UserService._clean_user(doc)

    @staticmethod
    def delete_user(user_id: str) -> dict:
        if not ObjectId.is_valid(user_id):
            raise HTTPException(status_code=400, detail="Invalid user id")
        res = users_col.delete_one({"_id": ObjectId(user_id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"success": True, "deleted_id": user_id}

    @staticmethod
    def _clean_user(doc: dict) -> dict:
        # convert _id and remove sensitive fields
        user = dict(doc)
        user["id"] = str(user["_id"])
        user.pop("_id", None)
        user.pop("password", None)
        return user
