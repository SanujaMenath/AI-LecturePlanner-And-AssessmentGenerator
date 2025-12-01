from pydantic import BaseModel
from typing import Optional

class LearningOutcome(BaseModel):
    outcome_id: Optional[str]
    topic_id: str
    outcome_description: str
