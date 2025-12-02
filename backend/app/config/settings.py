import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME = "AI Lecture Planner"
    MONGODB_URI = os.getenv("MONGODB_URI")
    if not MONGODB_URI:
        raise ValueError("MONGODB_URI is missing in .env")
    
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    if not DATABASE_NAME:
        raise ValueError("DATABASE_NAME is missing in .env")
    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise ValueError("JWT_SECRET_KEY is missing in .env")

    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
    if not JWT_ALGORITHM:
        raise ValueError("JWT_ALGORITHM is missing in .env")
    
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60"))

settings = Settings()
