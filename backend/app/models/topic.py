# backend/app/models/topic.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.object_id import PyObjectId, MongoBaseModel

class TopicCreate(BaseModel):
    module_id: PyObjectId
    title: str
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None  # optional metadata

class TopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None

class TopicResponse(MongoBaseModel):
    id: PyObjectId = Field(..., alias="id")
    module_id: PyObjectId
    title: str
    description: Optional[str]
    estimated_duration_minutes: Optional[int]
    created_at: datetime
    updated_at: datetime
