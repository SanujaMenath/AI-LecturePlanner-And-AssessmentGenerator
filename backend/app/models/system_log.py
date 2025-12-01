from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel

class SystemLogBase(BaseModel):
    action: str
    details: Optional[str] = None

class SystemLogCreate(SystemLogBase):
    user_id: PyObjectId

class SystemLogResponse(MongoBaseModel):
    user_id: PyObjectId
    action: str
    details: Optional[str]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))