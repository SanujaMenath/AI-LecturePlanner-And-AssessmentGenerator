from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel

class AssessmentBase(BaseModel):
    title: str
    instructions: Optional[str] = None
    assessment_type: str  # mcq | structured | essay

class AssessmentCreate(AssessmentBase):
    module_id: PyObjectId
    created_by: PyObjectId
    due_date: Optional[datetime] = None

class AssessmentUpdate(BaseModel):
    title: Optional[str] = None
    instructions: Optional[str] = None
    due_date: Optional[datetime] = None

class AssessmentResponse(MongoBaseModel):
    module_id: PyObjectId
    title: str
    instructions: Optional[str]
    assessment_type: str
    due_date: Optional[datetime]
    created_by: PyObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))