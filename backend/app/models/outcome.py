from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from app.models.object_id import PyObjectId, MongoBaseModel

class OutcomeBase(BaseModel):
    outcome_description: str

class OutcomeCreate(OutcomeBase):
    topic_id: PyObjectId

class OutcomeUpdate(BaseModel):
    outcome_description: Optional[str] = None

class OutcomeResponse(MongoBaseModel):
    topic_id: PyObjectId
    outcome_description: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))