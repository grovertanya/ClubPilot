from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/api/members", tags=["members"])

# Mock database
MEMBERS = [
    {"id": "m1", "name": "Alice", "emoji": "👩"},
    {"id": "m2", "name": "Bob", "emoji": "👨"},
    {"id": "m3", "name": "Charlie", "emoji": "👨"},
    {"id": "m4", "name": "Diana", "emoji": "👩"},
    {"id": "m5", "name": "Evan", "emoji": "👨"},
]

@router.get("/")
async def list_members():
    """Return all members (mock for development)"""
    return MEMBERS

@router.get("/{member_id}")
async def get_member(member_id: str):
    for m in MEMBERS:
        if m["id"] == member_id:
            return m
    raise HTTPException(status_code=404, detail="Member not found")
