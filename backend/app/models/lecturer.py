from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone
from typing import Optional
from app.models.object_id import PyObjectId, MongoBaseModel

class LecturerCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    department: str
    specialization: str

class LecturerUpdate(BaseModel):
    department: Optional[str] = None
    specialization: Optional[str] = None

class LecturerResponse(MongoBaseModel):
    user_id: PyObjectId
    full_name: str
    email: EmailStr
    department: str
    specialization: str
    created_at: datetime
    updated_at: datetime