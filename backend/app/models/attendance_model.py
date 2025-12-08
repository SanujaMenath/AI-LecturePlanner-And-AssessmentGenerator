from datetime import datetime, timezone
from pydantic import BaseModel
from app.models.object_id import PyObjectId, MongoBaseModel

class AttendanceCreate(BaseModel):
    student_id: PyObjectId
    status: str  # present, absent, late, excused

class AttendanceResponse(MongoBaseModel):
    id: PyObjectId = None
    session_id: PyObjectId
    student_id: PyObjectId
    status: str
    marked_at: datetime
