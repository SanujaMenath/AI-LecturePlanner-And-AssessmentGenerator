# backend/app/models/attempt.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.object_id import PyObjectId, MongoBaseModel

class AttemptCreate(BaseModel):
    assessment_id: PyObjectId
    student_id: PyObjectId
    answers: Optional[List[dict]] = None  # list of { "question_id": id, "answer": ... }

class AttemptResponse(MongoBaseModel):
    id: PyObjectId = Field(..., alias="id")
    assessment_id: PyObjectId
    student_id: PyObjectId
    started_at: datetime
    submitted_at: Optional[datetime]
    answers: Optional[List[dict]]
    marks_obtained: Optional[float]
    graded: bool = False
