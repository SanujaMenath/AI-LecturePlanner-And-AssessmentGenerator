from typing import Optional, List
from pymongo.collection import Collection
from bson import ObjectId

class BaseRepository:
    def __init__(self, collection: Collection):
        self.collection = collection

    def find_all(self) -> List[dict]:
        return list(self.collection.find())

    def find_by_id(self, id: str) -> Optional[dict]:
        return self.collection.find_one({"_id": ObjectId(id)})

    def create(self, data: dict) -> str:
        result = self.collection.insert_one(data)
        return str(result.inserted_id)

    def update(self, id: str, data: dict) -> bool:
        result = self.collection.update_one({"_id": ObjectId(id)}, {"$set": data})
        return result.modified_count > 0

    def delete(self, id: str) -> bool:
        result = self.collection.delete_one({"_id": ObjectId(id)})
        return result.deleted_count > 0
