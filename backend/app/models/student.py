from pydantic import BaseModel, EmailStr, Field
from datetime import datetime, timezone
from typing import Optional
from app.models.object_id import PyObjectId, MongoBaseModel

class StudentCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    department: str
    year: int
    semester: int

class StudentUpdate(BaseModel):
    department: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None

class StudentResponse(MongoBaseModel):
    user_id: PyObjectId
    full_name: str
    email: EmailStr
    department: str
    year: int
    semester: int
    created_at: datetime
    updated_at: datetime
