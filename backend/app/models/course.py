from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Course(BaseModel):
    course_id: Optional[str]
    course_name: str
    description: Optional[str]
    created_by: str
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()