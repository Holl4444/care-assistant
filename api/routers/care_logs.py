from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query
from pymongo import DESCENDING, ReturnDocument
from pymongo.errors import DuplicateKeyError

from api.database import logs
from api.models import CATEGORIES, CareLogDocument, LogInput, LogPage, as_id, normalize_text

router = APIRouter(prefix="/api/logs", tags=["care-logs"])


def require_database():
    if logs is None:
        raise HTTPException(status_code=503, detail="Database is not configured")


@router.get("", response_model=LogPage)
def list_logs(
    page: int = Query(default=1, ge=1),
    pageSize: int = Query(default=20, ge=1, le=100),
):
    require_database()
    skip = (page - 1) * pageSize
    cursor = (
        logs.find({})
        .sort([("pinned", DESCENDING), ("mentionCount", DESCENDING), ("updatedAt", DESCENDING)])
        .skip(skip)
        .limit(pageSize)
    )
    items = [CareLogDocument.model_validate(as_id(dict(item))) for item in cursor]
    total = logs.count_documents({})
    return LogPage(items=items, hasMore=skip + len(items) < total)


@router.post("")
def create_log(payload: LogInput):
    require_database()
    if payload.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid category")

    text = payload.text.strip()
    normalized = normalize_text(text)
    url = str(payload.url) if payload.url else None
    if not normalized:
        raise HTTPException(status_code=400, detail="Entry text is required")

    now = datetime.now(timezone.utc)
    try:
        result = logs.find_one_and_update(
            {"normalizedText": normalized},
            {
                "$set": {"text": text, "category": payload.category, "url": url, "updatedAt": now},
                "$setOnInsert": {
                    "normalizedText": normalized,
                    "pinned": False,
                    "addedAt": now,
                },
                "$inc": {"mentionCount": 1},
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        if result["mentionCount"] >= 3:
            logs.update_one({"_id": result["_id"]}, {"$set": {"pinned": True}})
        return {"ok": True}
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail="An entry already exists")


@router.put("/{entry_id}")
def update_log(entry_id: str, payload: LogInput):
    require_database()
    if payload.category not in CATEGORIES:
        raise HTTPException(status_code=400, detail="Invalid category")
    try:
        object_id = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Entry not found")

    text = payload.text.strip()
    normalized = normalize_text(text)
    url = str(payload.url) if payload.url else None
    if not normalized:
        raise HTTPException(status_code=400, detail="Entry text is required")

    existing = logs.find_one({"normalizedText": normalized, "_id": {"$ne": object_id}})
    if existing:
        raise HTTPException(status_code=409, detail="An entry already exists")

    result = logs.update_one(
        {"_id": object_id},
        {
            "$set": {
                "text": text,
                "category": payload.category,
                "url": url,
                "normalizedText": normalized,
                "updatedAt": datetime.now(timezone.utc),
            }
        },
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"ok": True}


@router.delete("/{entry_id}")
def delete_log(entry_id: str):
    require_database()
    try:
        object_id = ObjectId(entry_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Entry not found")
    result = logs.delete_one({"_id": object_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"ok": True}
