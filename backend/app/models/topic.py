from pydantic import BaseModel
from typing import Optional

class Topic(BaseModel):
    topic_id: Optional[str]
    module_id: str
    title: str
    description: Optional[str]
    