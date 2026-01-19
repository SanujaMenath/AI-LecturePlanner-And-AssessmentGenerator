# backend/app/models/session.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.object_id import PyObjectId


class SessionCreate(BaseModel):
    course_id: PyObjectId
    lecturer_id: PyObjectId
    topic: str
    start_time: datetime
    end_time: datetime
    location: Optional[str] = None
    description: Optional[str] = None


class SessionUpdate(BaseModel):
    topic: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None


class SessionResponse(BaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_id: PyObjectId
    lecturer_id: PyObjectId
    topic: str
    start_time: datetime
    end_time: datetime
    location: Optional[str]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
