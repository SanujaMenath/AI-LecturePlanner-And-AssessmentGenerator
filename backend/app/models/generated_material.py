from typing import Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel


class GeneratedMaterialBase(BaseModel):
    generated_type: str  # notes | summary | ppt | quiz etc
    content: str


class GeneratedMaterialCreate(GeneratedMaterialBase):
    lesson_id: PyObjectId
    module_id: PyObjectId
    created_by: PyObjectId


class GeneratedMaterialUpdate(BaseModel):
    content: Optional[str] = None


class GeneratedMaterialResponse(MongoBaseModel):
    lesson_id: PyObjectId
    module_id: PyObjectId
    generated_type: str
    content: str
    created_by: PyObjectId
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
