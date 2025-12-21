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
    lecturer_id: Optional[PyObjectId] = None

class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
    description: Optional[str] = None
    department: Optional[str] = None
    credits: Optional[int] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    lecturer_id: Optional[PyObjectId] = None

class CourseListItem(BaseModel):
    id: str
    course_code: str
    course_name: str
    is_enrolled: Optional[bool] = None
    lecturer_id: Optional[str] = None


class CourseResponse(MongoBaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_code: str
    course_name: str
    description: Optional[str]
    department: Optional[str]
    credits: int
    year: Optional[int]
    semester: Optional[int]
    lecturer_id: Optional[PyObjectId] = None
    created_at: datetime
    updated_at: datetime
