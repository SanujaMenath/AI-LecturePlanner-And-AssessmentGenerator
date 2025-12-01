from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SystemLog(BaseModel):
    log_id: Optional[str]
    user_id: str
    action: str
    details: Optional[str]
    created_at: datetime = datetime.utcnow()
