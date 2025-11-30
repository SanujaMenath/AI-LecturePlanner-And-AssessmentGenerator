from fastapi import FastAPI
from app.routes.test_db import router as test_db_router

app = FastAPI()
app.include_router(test_db_router)

@app.get("/")
def root():
    return {"message": "Backend API is running successfully!"}
