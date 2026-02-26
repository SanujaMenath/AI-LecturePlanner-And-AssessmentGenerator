from pydantic import BaseModel, Field
from datetime import datetime, timezone
from typing import Optional, List
from app.models.object_id import PyObjectId

class DepartmentBase(BaseModel):
    name: str
    code: str  # e.g., "CS", "ENG"
    description: Optional[str] = None

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentUpdate(BaseModel):
    name: Optional[str] = None
    code: Optional[str] = None
    description: Optional[str] = None
    course_ids: Optional[List[PyObjectId]] = None
    student_ids: Optional[List[PyObjectId]] = None

class DepartmentResponse(DepartmentBase):
    id: PyObjectId = Field(alias="_id")
    course_ids: List[PyObjectId] = []
    student_ids: List[PyObjectId] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {PyObjectId: str}