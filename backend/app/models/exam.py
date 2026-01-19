# backend/app/models/exam.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.object_id import PyObjectId

class ExamCreate(BaseModel):
    course_id: PyObjectId
    module_id: Optional[PyObjectId] = None
    title: str
    instructions: Optional[str] = None
    question_ids: List[PyObjectId]
    start_time: Optional[datetime] = None   # scheduled start
    end_time: Optional[datetime] = None     # scheduled end
    duration_minutes: Optional[int] = None
    is_published: bool = False

class ExamUpdate(BaseModel):
    title: Optional[str] = None
    instructions: Optional[str] = None
    question_ids: Optional[List[PyObjectId]] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    duration_minutes: Optional[int] = None
    is_published: Optional[bool] = None

class ExamResponse(BaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_id: PyObjectId
    module_id: Optional[PyObjectId]
    title: str
    instructions: Optional[str]
    question_ids: List[PyObjectId]
    start_time: Optional[datetime]
    end_time: Optional[datetime]
    duration_minutes: Optional[int]
    is_published: bool
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }