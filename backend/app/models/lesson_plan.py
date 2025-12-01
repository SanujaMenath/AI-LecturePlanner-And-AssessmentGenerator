from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class LessonPlan(BaseModel):
    lesson_id: Optional[str]
    module_id: str
    topic_id: str
    title: str
    content: str
    resources: Optional[List[str]]
    created_by: str
    generated: bool = False
    created_at: datetime = datetime.utcnow()
    