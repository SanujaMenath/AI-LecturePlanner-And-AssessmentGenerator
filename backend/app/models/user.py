from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    user_id: Optional[str]
    full_name: str
    email: EmailStr
    password: str
    role: str  # admin, lecturer, student
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
