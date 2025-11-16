from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from enum import Enum

router = APIRouter(prefix="/api/events", tags=["events"])

# ==================== Models ====================
class EventStatus(str, Enum):
    DRAFT = "draft"
    SCHEDULED = "scheduled"
    CONFLICTS_DETECTED = "conflicts_detected"
    OPTIMIZED = "optimized"
    CONFIRMED = "confirmed"

class Event(BaseModel):
    event_name: str
    event_type: str
    captain_id: str
    proposed_time: datetime
    duration_minutes: int = 60
    invited_members: List[str]
    description: Optional[str] = None

class SchedulingRecommendation(BaseModel):
    original_time: datetime
    recommended_time: datetime
    current_predicted_attendance: int
    recommended_predicted_attendance: int
    attendance_improvement: int
    confidence: float
    reason: str

class EventSchedulingResponse(BaseModel):
    event_id: str
    event: Event
    status: EventStatus
    scheduling_analysis: dict
    conflicts: List[dict]
    recommendations: List[SchedulingRecommendation]
    captain_message: str
    requires_captain_action: bool

# ==================== In-memory DBs ====================
EVENTS_DB = {}
MESSAGES_DB = {}
event_counter = 0


# ==================== CREATE + SMART SCHEDULING ====================
@router.post("/create-with-scheduling", response_model=EventSchedulingResponse)
async def create_event_with_scheduling(event: Event):

    global event_counter
    event_counter += 1
    event_id = f"evt_{event_counter}"

    # ============ HARDCODED MOCK FOR TECHNICA MEETING ============
    # You requested:
    # - Event = Technica meeting today at 5pm
    # - Adithi (m1) available
    # - Tanya (m2) NOT available

    now = datetime.now()
    today_5pm = now.replace(hour=17, minute=0, second=0, microsecond=0)

    # Replace event data using your hardcoded scenario
    event.event_name = "Technica Meeting"
    event.proposed_time = today_5pm
    event.invited_members = ["m1", "m2"]  # Adithi & Tanya

    # Prediction
    predictions = [
        {"member_id": "m1", "prediction_confidence": 0.91},  # Adithi = YES
        {"member_id": "m2", "prediction_confidence": 0.32},  # Tanya = NO
    ]

    # Conflict: Tanya is busy
    conflicts = [
        {
            "member_id": "m2",
            "member_name": "Tanya",
            "conflict_type": "busy",
            "reason": "Has class at the same time",
            "severity": "high"
        }
    ]

    # Recommendation: Move 1 hour later
    recommendations = [
        SchedulingRecommendation(
            original_time=today_5pm,
            recommended_time=today_5pm + timedelta(hours=1),
            current_predicted_attendance=1,
            recommended_predicted_attendance=2,
            attendance_improvement=1,
            confidence=0.87,
            reason="Tanya becomes available at 6 PM."
        )
    ]

    # Store event
    EVENTS_DB[event_id] = {
        "id": event_id,
        "event": event,
        "status": EventStatus.CONFLICTS_DETECTED,
        "predictions": predictions,
        "conflicts": conflicts,
        "created_at": datetime.now()
    }

    # Messages for MemberMessagesMobile
    MESSAGES_DB[event_id] = [
        {
            "member_id": m,
            "name": "Adithi" if m == "m1" else "Tanya",
            "status": "pending",
            "suggested_message": f"Hey! Can you make it to {event.event_name} today?"
        }
        for m in event.invited_members
    ]

    # Final API Response
    return {
        "event_id": event_id,
        "event": event,
        "status": EventStatus.CONFLICTS_DETECTED,
        "scheduling_analysis": {
            "total_invited": 2,
            "predicted_attendance": 1,
            "attendance_percentage": 50,
            "conflicts_count": 1
        },
        "conflicts": conflicts,
        "recommendations": recommendations,
        "captain_message": "Tanya cannot attend the 5 PM meeting. Consider rescheduling.",
        "requires_captain_action": True
    }


# ====================== GETTERS ======================
@router.get("/event/{event_id}")
async def get_event(event_id: str):
    if event_id not in EVENTS_DB:
        raise HTTPException(status_code=404, detail="Event not found")
    return EVENTS_DB[event_id]


@router.get("/")
async def list_events():
    return {"events": list(EVENTS_DB.values())}


@router.get("/captain/{captain_id}")
async def get_events_by_captain(captain_id: str):
    results = [e for e in EVENTS_DB.values() if e["event"].captain_id == captain_id]
    return {"events": results}


@router.get("/member/{member_id}")
async def get_member_events(member_id: str):
    return {
        "member_id": member_id,
        "events": list(EVENTS_DB.values())
    }
