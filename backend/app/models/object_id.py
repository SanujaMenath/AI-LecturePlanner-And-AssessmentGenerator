from bson import ObjectId
from pydantic import BaseModel, Field
from typing import Any

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        schema = handler(core_schema)
        schema.update(type="string")
        return schema


class MongoBaseModel(BaseModel):
    id: PyObjectId | None = Field(default=None, alias="_id")

    class Config:
        populate_by_name = True
        json_encoders = {ObjectId: str}
