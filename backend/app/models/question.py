from pydantic import BaseModel
from typing import Optional, List

class Question(BaseModel):
    question_id: Optional[str]
    module_id: str
    outcome_id: str
    question_text: str
    question_type: str  # mcq, short, structured
    options: Optional[List[str]]
    answer: Optional[str]
    difficulty: str  # easy, medium, hard
    generated: bool = False
