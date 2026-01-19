from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from app.models.object_id import PyObjectId


class QuestionBase(BaseModel):
    question_text: str
    question_type: str  # mcq | short | structured
    options: Optional[List[str]] = None
    answer: Optional[str] = None
    difficulty: Optional[str] = "medium"  # easy | medium | hard


class QuestionCreate(QuestionBase):
    module_id: PyObjectId
    outcome_id: PyObjectId
    generated: Optional[bool] = False


class QuestionUpdate(BaseModel):
    question_text: Optional[str] = None
    options: Optional[List[str]] = None
    answer: Optional[str] = None
    difficulty: Optional[str] = None


class QuestionResponse(BaseModel):
    module_id: PyObjectId
    outcome_id: PyObjectId
    question_text: str
    question_type: str
    options: Optional[List[str]]
    answer: Optional[str]
    difficulty: str
    generated: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
