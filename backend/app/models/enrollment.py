from pydantic import BaseModel
from datetime import datetime, timezone
from app.models.object_id import PyObjectId
from typing import Optional


class EnrollmentCreate(BaseModel):
    student_id: PyObjectId


class EnrollmentResponse(BaseModel):
    id: PyObjectId = None
    course_id: PyObjectId
    student_id: PyObjectId
    enrolled_at: datetime
    status: Optional[str] = "active"  # active | dropped | completed


model_config = {
    "populate_by_name": True,
    "arbitrary_types_allowed": True,
    "json_encoders": {PyObjectId: str},
}
