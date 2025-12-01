from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Assessment(BaseModel):
    assessment_id: Optional[str]
    module_id: str
    title: str
    instructions: Optional[str]
    assessment_type: str  # mcq, structured, essay
    due_date: Optional[datetime]
    created_by: str
    created_at: datetime = datetime.utcnow()
