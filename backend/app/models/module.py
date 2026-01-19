# backend/app/models/module.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.models.object_id import PyObjectId


class ModuleCreate(BaseModel):
    course_id: PyObjectId
    code: str  # e.g. CS101-1
    title: str
    description: Optional[str] = None
    credits: Optional[int] = None


class ModuleUpdate(BaseModel):
    code: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    credits: Optional[int] = None


class ModuleResponse(BaseModel):
    id: PyObjectId = Field(..., alias="id")
    course_id: PyObjectId
    code: str
    title: str
    description: Optional[str]
    credits: Optional[int]
    created_at: datetime
    updated_at: datetime

    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {PyObjectId: str},
    }
