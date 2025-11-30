from fastapi import APIRouter
from app.database.connection import get_database

router = APIRouter()

@router.get("/test-db")
def test_db():
    db = get_database()
    collections = db.list_collection_names()
    return {"status": "connected", "collections": collections}
