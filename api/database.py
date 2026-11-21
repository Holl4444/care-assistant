import os

from dotenv import load_dotenv
from pymongo import ASCENDING, DESCENDING, MongoClient

load_dotenv()

mongo_uri = os.getenv("MONGODB_URI")
mongo_db_name = os.getenv("MONGODB_DB", "CarekinDb")

client = MongoClient(mongo_uri) if mongo_uri else None
database = client[mongo_db_name] if client is not None else None
logs = database["carer_logs"] if database is not None else None
projects = database["project_ideas"] if database is not None else None

if logs is not None:
    logs.create_index([("normalizedText", ASCENDING)], unique=True)
    logs.create_index(
        [("pinned", DESCENDING), ("mentionCount", DESCENDING), ("updatedAt", DESCENDING)]
    )
if projects is not None:
    projects.create_index([("createdAt", DESCENDING)])
