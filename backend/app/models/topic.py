from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.object_id import PyObjectId


class TopicCreate(BaseModel):
    module_id: PyObjectId
    title: str
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None


class TopicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None


class TopicResponse(BaseModel):
    id: PyObjectId = Field(alias="_id")
    module_id: PyObjectId
    title: str
    description: Optional[str] = None
    estimated_duration_minutes: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {
            PyObjectId: str
        }
    }
