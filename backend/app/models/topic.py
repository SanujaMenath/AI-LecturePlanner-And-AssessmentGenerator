from typing import Optional
from pydantic import BaseModel, Field
from datetime import datetime, timezone
from app.models.object_id import PyObjectId, MongoBaseModel

class TopicBase(BaseModel):
    title: str
    description: Optional[str] = None

class TopicCreate(TopicBase):
    module_id: PyObjectId

class TopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

class TopicResponse(MongoBaseModel):
    module_id: PyObjectId
    title: str
    description: Optional[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))