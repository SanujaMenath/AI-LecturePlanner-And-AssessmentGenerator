from fastapi import FastAPI
from app.routes.test_db import router as test_db_router
from app.config.settings import settings

app = FastAPI(title=settings.PROJECT_NAME)

@app.get("/")
def root():
    return {"message": "Backend API running"}

app.include_router(test_db_router, prefix="/system", tags=["System"])
