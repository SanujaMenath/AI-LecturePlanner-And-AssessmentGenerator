# backend/app/services/module_service.py
from app.database.connection import get_database
from bson import ObjectId
from datetime import datetime, timezone
from fastapi import HTTPException, status

db = get_database()
modules_col = db["modules"]
courses_col = db["courses"]

class ModuleService:
    @staticmethod
    def _now():
        return datetime.now(timezone.utc)

    @staticmethod
    def _to_str_id(doc, id_field="_id"):
        doc["id"] = str(doc[id_field])
        doc.pop(id_field, None)
        return doc

    @staticmethod
    def _ensure_course_exists(course_id: ObjectId):
        if not courses_col.find_one({"_id": course_id}):
            raise HTTPException(status_code=404, detail="Course not found")

    @staticmethod
    def create_module(payload):
        course_oid = ObjectId(str(payload.course_id))

        ModuleService._ensure_course_exists(course_oid)

        # optional: ensure unique code per course
        if modules_col.find_one({"course_id": course_oid, "code": payload.code}):
            raise HTTPException(status_code=400, detail="Module code already exists for this course")

        now = ModuleService._now()
        doc = {
            "course_id": course_oid,
            "code": payload.code,
            "title": payload.title,
            "description": payload.description,
            "credits": payload.credits,
            "created_at": now,
            "updated_at": now
        }

        res = modules_col.insert_one(doc)
        doc["_id"] = res.inserted_id
        return ModuleService._to_str_id(doc)

    @staticmethod
    def list_modules(course_id: str = None, skip: int = 0, limit: int = 100):
        q = {}
        if course_id:
            if not ObjectId.is_valid(course_id):
                raise HTTPException(status_code=400, detail="Invalid course id")
            q["course_id"] = ObjectId(course_id)

        cursor = modules_col.find(q).skip(int(skip)).limit(int(limit)).sort("code", 1)
        out = []
        for m in cursor:
            out.append(ModuleService._to_str_id(m))
        return out

    @staticmethod
    def get_module(module_id: str):
        if not ObjectId.is_valid(module_id):
            raise HTTPException(status_code=400, detail="Invalid module id")
        doc = modules_col.find_one({"_id": ObjectId(module_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Module not found")
        return ModuleService._to_str_id(doc)

    @staticmethod
    def update_module(module_id: str, payload):
        if not ObjectId.is_valid(module_id):
            raise HTTPException(status_code=400, detail="Invalid module id")
        oid = ObjectId(module_id)
        current = modules_col.find_one({"_id": oid})
        if not current:
            raise HTTPException(status_code=404, detail="Module not found")

        update_doc = {k: v for k, v in payload.dict(exclude_unset=True).items()}

        update_doc["updated_at"] = ModuleService._now()
        modules_col.update_one({"_id": oid}, {"$set": update_doc})
        return ModuleService.get_module(module_id)

    @staticmethod
    def delete_module(module_id: str):
        if not ObjectId.is_valid(module_id):
            raise HTTPException(status_code=400, detail="Invalid module id")
        oid = ObjectId(module_id)
        res = modules_col.delete_one({"_id": oid})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Module not found")
        # Note: cascade delete of topics, lesson plans left for later (document this)
        return {"message": "Module deleted"}
