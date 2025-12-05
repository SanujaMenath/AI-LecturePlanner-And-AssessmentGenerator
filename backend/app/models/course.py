# backend/app/models/course.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timezone
from app.models.object_id import PyObjectId, MongoBaseModel

class CourseCreate(BaseModel):
    course_code: str
    course_name: str
    description: Optional[str] = None
    department: Optional[str] = None
    credits: Optional[int] = 0
    year: Optional[int] = None
    semester: Optional[int] = None

class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
    description: Optional[str] = None
    department: Optional[str] = None
    credits: Optional[int] = None
    year: Optional[int] = None
    semester: Optional[int] = None

class CourseResponse(MongoBaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_code: str
    course_name: str
    description: Optional[str]
    department: Optional[str]
    credits: int
    year: Optional[int]
    semester: Optional[int]
    created_at: datetime
    updated_at: datetime
