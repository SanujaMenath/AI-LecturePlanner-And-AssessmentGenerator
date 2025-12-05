from pydantic import BaseModel
from datetime import datetime, timezone
from app.models.object_id import PyObjectId, MongoBaseModel
from typing import Optional

class EnrollmentCreate(BaseModel):
    student_id: PyObjectId

class EnrollmentResponse(MongoBaseModel):
    id: PyObjectId = None
    course_id: PyObjectId
    student_id: PyObjectId
    enrolled_at: datetime
    status: Optional[str] = "active"  # active | dropped | completed
