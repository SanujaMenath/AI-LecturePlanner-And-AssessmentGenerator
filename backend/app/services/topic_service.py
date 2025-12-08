# backend/app/services/topic_service.py
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status

db = get_database()
topics_col = db["topics"]
modules_col = db["modules"]

class TopicService:
    @staticmethod
    def _now():
        return datetime.now(timezone.utc)

    @staticmethod
    def _to_str_id(doc, id_field="_id"):
        doc["id"] = str(doc[id_field])
        doc.pop(id_field, None)
        return doc

    @staticmethod
    def _ensure_module_exists(module_id: ObjectId):
        if not modules_col.find_one({"_id": module_id}):
            raise HTTPException(status_code=404, detail="Module not found")

    @staticmethod
    def create_topic(payload):
        module_oid = ObjectId(str(payload.module_id))
        TopicService._ensure_module_exists(module_oid)

        now = TopicService._now()
        doc = {
            "module_id": module_oid,
            "title": payload.title,
            "description": payload.description,
            "estimated_duration_minutes": payload.estimated_duration_minutes,
            "created_at": now,
            "updated_at": now
        }

        res = topics_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return TopicService._to_str_id(doc)

    @staticmethod
    def list_topics(module_id: str = None, skip: int = 0, limit: int = 100):
        q = {}
        if module_id:
            if not ObjectId.is_valid(module_id):
                raise HTTPException(status_code=400, detail="Invalid module id")
            q["module_id"] = ObjectId(module_id)
        cursor = topics_col.find(q).skip(int(skip)).limit(int(limit)).sort("created_at", 1)
        out = []
        for t in cursor:
            out.append(TopicService._to_str_id(t))
        return out

    @staticmethod
    def get_topic(topic_id: str):
        if not ObjectId.is_valid(topic_id):
            raise HTTPException(status_code=400, detail="Invalid topic id")
        doc = topics_col.find_one({"_id": ObjectId(topic_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Topic not found")
        return TopicService._to_str_id(doc)

    @staticmethod
    def update_topic(topic_id: str, payload):
        if not ObjectId.is_valid(topic_id):
            raise HTTPException(status_code=400, detail="Invalid topic id")
        oid = ObjectId(topic_id)
        current = topics_col.find_one({"_id": oid})
        if not current:
            raise HTTPException(status_code=404, detail="Topic not found")

        update_doc = {k: v for k, v in payload.dict(exclude_unset=True).items()}

        # if module_id provided, validate existence
        if "module_id" in update_doc:
            if not ObjectId.is_valid(str(update_doc["module_id"])):
                raise HTTPException(status_code=400, detail="Invalid module id")
            TopicService._ensure_module_exists(ObjectId(str(update_doc["module_id"])))
            update_doc["module_id"] = ObjectId(str(update_doc["module_id"]))

        update_doc["updated_at"] = TopicService._now()
        topics_col.update_one({"_id": oid}, {"$set": update_doc})
        return TopicService.get_topic(topic_id)

    @staticmethod
    def delete_topic(topic_id: str):
        if not ObjectId.is_valid(topic_id):
            raise HTTPException(status_code=400, detail="Invalid topic id")
        oid = ObjectId(topic_id)
        res = topics_col.delete_one({"_id": oid})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Topic not found")
        # Note: lesson plans and other dependent docs should be considered for cascade deletion later
        return {"message": "Topic deleted"}
