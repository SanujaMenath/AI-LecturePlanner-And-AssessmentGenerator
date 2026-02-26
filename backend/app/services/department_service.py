from app.models.department import DepartmentCreate
from bson import ObjectId
from app.database.connection import get_database
from datetime import datetime, timezone
from fastapi import HTTPException

# Define the collection at the module level
db = get_database()
dept_col = db["departments"]

class DepartmentService:
    
    @staticmethod
    def create_dept(dept: DepartmentCreate):
        new_dept = dept.model_dump()
        new_dept["course_ids"] = []
        new_dept["student_ids"] = []
        new_dept["created_at"] = datetime.now(timezone.utc)
        new_dept["updated_at"] = datetime.now(timezone.utc)
        
        result = dept_col.insert_one(new_dept)
        
        return DepartmentService.get_dept(str(result.inserted_id))

    @staticmethod
    def get_dept(dept_id: str):
        if not ObjectId.is_valid(dept_id):
            raise HTTPException(status_code=400, detail="Invalid department ID")
            
        doc = dept_col.find_one({"_id": ObjectId(dept_id)})
        if not doc:
            raise HTTPException(status_code=404, detail="Department not found")
            
        doc["id"] = str(doc["_id"])
        return doc

    @staticmethod
    def get_all():
        docs = list(dept_col.find())
        for doc in docs:
            doc["id"] = str(doc["_id"])
        return docs

    @staticmethod
    def enroll_student(dept_id: str, student_id: str):
        if not ObjectId.is_valid(dept_id) or not ObjectId.is_valid(student_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")

        result = dept_col.update_one(
            {"_id": ObjectId(dept_id)},
            {"$addToSet": {"student_ids": ObjectId(student_id)}}
        )
        # Returns True if a document was actually modified
        return result.modified_count > 0

    @staticmethod
    def delete_dept(dept_id: str):
        if not ObjectId.is_valid(dept_id):
            raise HTTPException(status_code=400, detail="Invalid department ID")
            
        result = dept_col.delete_one({"_id": ObjectId(dept_id)})
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Department not found")
        return True