from datetime import datetime, timezone
from typing import Optional
from pydantic import BaseModel, Field
from app.models.object_id import PyObjectId, MongoBaseModel

class ModuleBase(BaseModel):
    module_name: str
    module_code: str
    description: Optional[str] = None

class ModuleCreate(ModuleBase):
    course_id: PyObjectId
    assigned_lecturer: Optional[PyObjectId] = None

class ModuleUpdate(BaseModel):
    module_name: Optional[str] = None
    module_code: Optional[str] = None
    description: Optional[str] = None
    assigned_lecturer: Optional[PyObjectId] = None

class ModuleResponse(MongoBaseModel):
    module_name: str
    module_code: str
    description: Optional[str]
    course_id: PyObjectId
    assigned_lecturer: Optional[PyObjectId]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))