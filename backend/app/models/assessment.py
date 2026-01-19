# backend/app/models/assessment.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.object_id import PyObjectId


class AssessmentCreate(BaseModel):
    course_id: PyObjectId
    module_id: Optional[PyObjectId] = None
    title: str
    assessment_type: str  # quiz | exam | assignment (assignments handled separately but keep for generality)
    description: Optional[str] = None
    total_marks: int
    settings: Optional[dict] = (
        None  # e.g. {"time_limit_minutes": 30, "shuffle_questions": True}
    )
    question_ids: Optional[List[PyObjectId]] = []


class AssessmentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    total_marks: Optional[int] = None
    settings: Optional[dict] = None
    question_ids: Optional[List[PyObjectId]] = None


class AssessmentResponse(BaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_id: PyObjectId
    module_id: Optional[PyObjectId]
    title: str
    assessment_type: str
    description: Optional[str]
    total_marks: int
    settings: Optional[dict]
    question_ids: Optional[List[PyObjectId]]
    created_at: datetime
    updated_at: datetime
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
