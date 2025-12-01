from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel

class EnrollmentBase(BaseModel):
    pass

class EnrollmentCreate(EnrollmentBase):
    student_id: PyObjectId
    course_id: PyObjectId

class EnrollmentUpdate(BaseModel):
    pass

class EnrollmentResponse(MongoBaseModel):
    student_id: PyObjectId
    course_id: PyObjectId
    enrolled_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "active"  # active | completed | dropped