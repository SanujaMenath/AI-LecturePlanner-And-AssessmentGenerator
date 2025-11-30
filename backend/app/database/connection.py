import os
from pymongo import MongoClient
from app.config.settings import settings


client = MongoClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

if not client:
    raise ValueError("MONGODB_URI is missing. Check your .env file.")

if not db:
    raise ValueError("DATABASE_NAME is missing. Check your .env file.")


def get_database():
    return db
