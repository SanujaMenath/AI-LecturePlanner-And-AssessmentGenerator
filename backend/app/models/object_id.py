from bson import ObjectId
from pydantic import BaseModel
from pydantic.json_schema import JsonSchemaValue

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, info=None):
        if isinstance(v, ObjectId):
            return v
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        json_schema = handler(core_schema)
        json_schema.update(type="string")
        return json_schema


class MongoBaseModel(BaseModel):
    model_config = {
        "arbitrary_types_allowed": True,
        "json_encoders": {
            ObjectId: lambda v: str(v)
        }
    }
