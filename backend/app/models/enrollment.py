from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Enrollment(BaseModel):
    enrollment_id: Optional[str]
    student_id: str
    course_id: str
    enrolled_date: datetime = datetime.utcnow()
