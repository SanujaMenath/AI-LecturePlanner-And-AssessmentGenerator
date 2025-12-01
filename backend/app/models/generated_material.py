from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GeneratedMaterial(BaseModel):
    material_id: Optional[str]
    lesson_id: str
    module_id: str
    generated_type: str  # notes, summary, ppt etc
    content: str
    created_at: datetime = datetime.utcnow()
