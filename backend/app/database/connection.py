import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing. Check your .env file.")

if not DATABASE_NAME:
    raise ValueError("DATABASE_NAME is missing. Check your .env file.")

client = MongoClient(MONGODB_URI)
db = client[DATABASE_NAME]

def get_database():
    return db
