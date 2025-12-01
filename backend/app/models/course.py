from datetime import datetime, timezone
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel

class CourseBase(BaseModel):
    course_name: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    created_by: PyObjectId  # user id

class CourseUpdate(BaseModel):
    course_name: Optional[str] = None
    description: Optional[str] = None

class CourseResponse(MongoBaseModel):
    course_name: str
    description: Optional[str]
    created_by: PyObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))