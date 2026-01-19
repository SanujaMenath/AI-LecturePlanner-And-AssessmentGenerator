from datetime import datetime, timezone
from pydantic import BaseModel
from app.models.object_id import PyObjectId


class AttendanceCreate(BaseModel):
    student_id: PyObjectId
    status: str  # present, absent, late, excused


class AttendanceResponse(BaseModel):
    id: PyObjectId = None
    session_id: PyObjectId
    student_id: PyObjectId
    status: str
    marked_at: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
