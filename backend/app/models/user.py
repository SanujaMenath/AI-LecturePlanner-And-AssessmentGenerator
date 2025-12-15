from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.object_id import PyObjectId, MongoBaseModel


class BaseUser(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str  # admin student lecturer

class LecturerCreate(BaseUser):
    department: str
    specialization: str

class StudentCreate(BaseUser):
    department: str
    year: int
    semester: int

class AdminCreate(BaseUser):
    pass

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None


class UserResponse(MongoBaseModel):
    id: PyObjectId
    full_name: str
    email: EmailStr
    role: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
