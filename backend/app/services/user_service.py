from fastapi import HTTPException
from app.database.connection import get_database
from app.utils.security import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from app.models.user import UserCreate, UserUpdate
from bson import ObjectId
from datetime import datetime, timezone

db = get_database()
users = db["users"]

class UserService:

    @staticmethod
    def create_user(data: UserCreate):
        # Email exists check
        if users.find_one({"email": data.email}):
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_pw = hash_password(data.password)

        new_user = {
            "full_name": data.full_name,
            "email": data.email,
            "password": hashed_pw,
            "role": data.role,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }

        result = users.insert_one(new_user)
        new_user["id"] = str(result.inserted_id)
        del new_user["password"]

        return new_user

    @staticmethod
    def login(email: str, password: str):
        user = users.find_one({"email": email})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        if not verify_password(password, user["password"]):
            raise HTTPException(status_code=401, detail="Invalid password")

        token = create_access_token({"user_id": str(user["_id"]), "role": user["role"]})

        return {"token": token}

    @staticmethod
    def get_user_by_id(user_id: str):
        user = users.find_one({"_id": ObjectId(user_id)}, {"password": 0})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    @staticmethod
    def update_user(user_id: str, data: UserUpdate):
        update_data = {}

        if data.full_name:
            update_data["full_name"] = data.full_name

        if data.password:
            update_data["password"] = hash_password(data.password)

        update_data["updated_at"] = datetime.now(timezone.utc)

        result = users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})

        if result.modified_count == 0:
            raise HTTPException(status_code=400, detail="Update failed")

        return {"success": True}
