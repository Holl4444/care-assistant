import re
import unicodedata
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field, HttpUrl

CareCategory = Literal["Music", "Interests", "Physical", "Environment", "Routines"]
CATEGORIES = set(CareCategory.__args__)


class LogInput(BaseModel):
    text: str = Field(min_length=1, max_length=500)
    category: CareCategory
    url: HttpUrl | None = None


class CareLogDocument(BaseModel):
    id: str
    text: str
    category: CareCategory
    url: str | None = None
    mentionCount: int = Field(ge=1)
    pinned: bool
    addedAt: datetime
    updatedAt: datetime


class LogPage(BaseModel):
    items: list[CareLogDocument]
    hasMore: bool


class ProjectInput(BaseModel):
    title: str = Field(min_length=1, max_length=150)
    description: str = Field(default="", max_length=2000)


class ProjectDocument(BaseModel):
    id: str
    title: str
    description: str
    createdAt: datetime
    updatedAt: datetime


def normalize_text(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).lower().strip()
    value = re.sub(r"[^\w\s]", "", value, flags=re.UNICODE)
    return re.sub(r"\s+", " ", value).strip()


def as_id(value: dict) -> dict:
    value["id"] = str(value.pop("_id"))
    return value
