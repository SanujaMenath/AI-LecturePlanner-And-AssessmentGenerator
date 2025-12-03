from pydantic import BaseModel, EmailStr
from app.models.object_id import PyObjectId, MongoBaseModel

class LecturerBase(BaseModel):
    department: str
    specialization: str

class LecturerCreate(LecturerBase):
    user_id: PyObjectId  

class LecturerUpdate(BaseModel):
    department: str | None = None
    specialization: str | None = None

class LecturerResponse(MongoBaseModel):
    user_id: str
    full_name: str
    email: EmailStr
    department: str
    specialization: str
