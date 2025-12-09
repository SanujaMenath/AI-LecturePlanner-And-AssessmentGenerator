# backend/app/models/attempt.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.models.object_id import PyObjectId, MongoBaseModel

class AnswerItem(BaseModel):
    question_id: PyObjectId
    selected_options: Optional[List[int]] = None  # indices for MCQ
    text_answer: Optional[str] = None

class AttemptCreate(BaseModel):
    student_id: PyObjectId
    answers: List[AnswerItem]

class AttemptResponse(MongoBaseModel):
    id: PyObjectId = Field(..., alias="id")
    assessment_id: PyObjectId     # quiz or exam id
    student_id: PyObjectId
    answers: List[AnswerItem]
    score: Optional[float] = None
    max_score: Optional[float] = None
    submitted_at: datetime
    graded: bool = False
