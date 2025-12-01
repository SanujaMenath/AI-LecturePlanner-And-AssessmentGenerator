from typing import Optional, List
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel


class LessonPlanBase(BaseModel):
    title: str
    content: str
    resources: Optional[List[str]] = None


class LessonPlanCreate(LessonPlanBase):
    module_id: PyObjectId
    topic_id: PyObjectId
    created_by: PyObjectId
    generated: Optional[bool] = False


class LessonPlanUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    resources: Optional[List[str]] = None
    generated: Optional[bool] = None


class LessonPlanResponse(MongoBaseModel):
    module_id: PyObjectId
    topic_id: PyObjectId
    title: str
    content: str
    resources: Optional[List[str]]
    created_by: PyObjectId
    generated: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
