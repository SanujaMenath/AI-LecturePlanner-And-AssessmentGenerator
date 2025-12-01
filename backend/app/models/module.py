from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Module(BaseModel):
    module_id: Optional[str]
    course_id: str
    module_name: str
    module_code: str
    description: Optional[str]
    assigned_lecturer: Optional[str]
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()