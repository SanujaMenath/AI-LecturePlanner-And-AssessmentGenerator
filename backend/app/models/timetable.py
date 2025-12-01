from typing import Optional
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel


class TimetableBase(BaseModel):
    day_of_week: str
    start_time: str  # consider ISO time strings
    end_time: str
    room: Optional[str] = None


class TimetableCreate(TimetableBase):
    module_id: PyObjectId
    lecturer_id: PyObjectId


class TimetableUpdate(BaseModel):
    day_of_week: Optional[str] = None
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    room: Optional[str] = None


class TimetableResponse(MongoBaseModel):
    module_id: PyObjectId
    lecturer_id: PyObjectId
    day_of_week: str
    start_time: str
    end_time: str
    room: Optional[str]
