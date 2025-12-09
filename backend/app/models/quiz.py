# backend/app/models/quiz.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from app.models.object_id import PyObjectId, MongoBaseModel

class QuizCreate(BaseModel):
    course_id: PyObjectId
    module_id: Optional[PyObjectId] = None
    title: str
    instructions: Optional[str] = None
    questions: List[PyObjectId]             # question ids from question_bank
    duration_minutes: Optional[int] = None  # for timed quizzes
    due_date: Optional[datetime] = None     # last submission time
    is_published: bool = False

class QuizUpdate(BaseModel):
    title: Optional[str] = None
    instructions: Optional[str] = None
    questions: Optional[List[PyObjectId]] = None
    duration_minutes: Optional[int] = None
    due_date: Optional[datetime] = None
    is_published: Optional[bool] = None

class QuizResponse(MongoBaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_id: PyObjectId
    module_id: Optional[PyObjectId]
    title: str
    instructions: Optional[str]
    questions: List[PyObjectId]
    duration_minutes: Optional[int]
    due_date: Optional[datetime]
    is_published: bool
    created_at: datetime
    updated_at: datetime
