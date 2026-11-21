from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pymongo import DESCENDING

from api.database import projects
from api.models import ProjectDocument, ProjectInput, as_id

router = APIRouter(prefix="/api/projects", tags=["projects"])

PROJECT_SEEDS = [
    {
        "title": "Create a comforting routine",
        "description": "Choose one or two gentle activities for morning, afternoon and evening. Five to ten minutes is plenty, and the plan can change with Allan’s cues.",
    },
    {
        "title": "Build a familiar playlist",
        "description": "Gather favourite songs and radio shows from his younger years, roughly 1965–1980.",
    },
    {
        "title": "Make a reminder board",
        "description": "With Chris and/or Allan, collect names, family, carers, hobbies, favourite music, food and nicknames.",
    },
    {
        "title": "Keep a response log",
        "description": "Note what brought a smile or a relaxed face, so the best things can be repeated.",
    },
]


def require_database():
    if projects is None:
        raise HTTPException(status_code=503, detail="Database is not configured")


def seed_projects():
    if projects is None or projects.count_documents({}):
        return
    now = datetime.now(timezone.utc)
    projects.insert_many([{**seed, "createdAt": now, "updatedAt": now} for seed in PROJECT_SEEDS])


seed_projects()


@router.get("", response_model=list[ProjectDocument])
def list_projects():
    require_database()
    cursor = projects.find({}).sort("createdAt", DESCENDING)
    return [ProjectDocument.model_validate(as_id(dict(item))) for item in cursor]


@router.post("")
def create_project(payload: ProjectInput):
    require_database()
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Project title is required")
    now = datetime.now(timezone.utc)
    projects.insert_one(
        {
            "title": title,
            "description": payload.description.strip(),
            "createdAt": now,
            "updatedAt": now,
        }
    )
    return {"ok": True}


@router.put("/{project_id}")
def update_project(project_id: str, payload: ProjectInput):
    require_database()
    try:
        object_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Project not found")
    title = payload.title.strip()
    if not title:
        raise HTTPException(status_code=400, detail="Project title is required")
    result = projects.update_one(
        {"_id": object_id},
        {
            "$set": {
                "title": title,
                "description": payload.description.strip(),
                "updatedAt": datetime.now(timezone.utc),
            }
        },
    )
    if not result.matched_count:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}


@router.delete("/{project_id}")
def delete_project(project_id: str):
    require_database()
    try:
        object_id = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=404, detail="Project not found")
    result = projects.delete_one({"_id": object_id})
    if not result.deleted_count:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"ok": True}
