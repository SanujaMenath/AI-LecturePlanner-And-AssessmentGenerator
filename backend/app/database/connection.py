import os
from pymongo import MongoClient
from app.config.settings import settings


client = MongoClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

if client is None:
    raise ValueError("MONGODB_URI is missing. Check your .env file.")

if db is None:
    raise ValueError("DATABASE_NAME is missing. Check your .env file.")


def get_database():
    return db
