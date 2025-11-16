# backend/routes/event.py - Event Creation & Smart Scheduling
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
    event_type: str  # "meeting", "social", "activity", "study_session"
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

# Mock database
EVENTS_DB = {}
event_counter = 0

# ==================== Smart Event Scheduling Orchestration ====================

@router.post("/create-with-scheduling", response_model=EventSchedulingResponse)
async def create_event_with_smart_scheduling(event: Event):
    """
    Captain creates event → System automatically:
    1. Predicts attendance for each member
    2. Detects potential conflicts
    3. Generates alternative time slots
    4. Sends captain smart recommendations
    """
    
    global event_counter
    event_counter += 1
    event_id = f"evt_{event_counter}"
    
    # ===== STEP 1: Behavioral Forecasting =====
    attendance_predictions = []
    total_predicted = 0
    
    for member_id in event.invited_members:
        # In production: call /api/ai/predict-attendance
        # For now, using mock logic
        base_score = 0.65
        day_bonus = 0.1 if event.proposed_time.weekday() == 4 else 0  # Friday bonus
        time_penalty = -0.2 if event.proposed_time.hour > 20 else 0
        
        prediction = base_score + day_bonus + time_penalty
        prediction = max(0, min(1, prediction))
        
        attendance_predictions.append({
            "member_id": member_id,
            "predicted_attendance": prediction > 0.6,
            "confidence": prediction,
            "will_attend": prediction > 0.7
        })
        
        if prediction > 0.6:
            total_predicted += 1
    
    current_attendance_rate = total_predicted / len(event.invited_members) if event.invited_members else 0
    
    # ===== STEP 2: Detect Conflicts =====
    conflicts_detected = []
    
    # Mock class schedule conflicts
    class_schedules = {
        "m1": ["MWF 10-11am", "TR 2-3:30pm"],
        "m2": ["MWF 9-10am", "W 3-5pm"],
    }
    
    day_of_week = event.proposed_time.strftime("%A")[0]
    hour = event.proposed_time.hour
    
    for member_id in event.invited_members:
        if member_id in class_schedules:
            for class_slot in class_schedules[member_id]:
                if day_of_week in class_slot and f"{hour}:" in class_slot:
                    conflicts_detected.append({
                        "member_id": member_id,
                        "type": "class_conflict",
                        "severity": "high",
                        "conflict": class_slot
                    })
    
    # ===== STEP 3: Generate Alternative Time Slots =====
    recommendations = []
    
    candidate_times = [
        event.proposed_time + timedelta(hours=2),
        event.proposed_time + timedelta(days=1),
        event.proposed_time + timedelta(days=1, hours=4),
        event.proposed_time + timedelta(days=2),
    ]
    
    for candidate_time in candidate_times:
        # Predict attendance for each candidate
        candidate_predicted = 0
        for member_id in event.invited_members:
            # Better attendance on Fridays/weekends
            day_bonus = 0.15 if candidate_time.weekday() == 4 else 0.05
            base = 0.65 + day_bonus
            if candidate_time.hour > 20:
                base -= 0.2
            
            if base > 0.6:
                candidate_predicted += 1
        
        attendance_improvement = candidate_predicted - total_predicted
        
        if attendance_improvement > 0:
            recommendations.append(SchedulingRecommendation(
                original_time=event.proposed_time,
                recommended_time=candidate_time,
                current_predicted_attendance=total_predicted,
                recommended_predicted_attendance=candidate_predicted,
                attendance_improvement=attendance_improvement,
                confidence=0.82,
                reason=f"{candidate_predicted} members available (vs {total_predicted}). Better on {candidate_time.strftime('%A')}s at {candidate_time.strftime('%I:%M %p')}"
            ))
    
    # Sort by improvement
    recommendations.sort(key=lambda x: x.attendance_improvement, reverse=True)
    recommendations = recommendations[:3]
    
    # ===== STEP 4: Determine Status & Generate Captain Message =====
    status = EventStatus.SCHEDULED
    requires_action = False
    captain_message = ""
    
    if conflicts_detected:
        status = EventStatus.CONFLICTS_DETECTED
        requires_action = True
        captain_message = f"⚠️ **{len(conflicts_detected)} scheduling conflicts detected!**\n\n"
        for conflict in conflicts_detected:
            captain_message += f"- Member has {conflict['conflict']}\n"
        captain_message += f"\n💡 Our system recommends rescheduling. See alternatives below."
    
    if recommendations and recommendations[0].attendance_improvement > 0:
        status = EventStatus.OPTIMIZED
        requires_action = True
        best = recommendations[0]
        captain_message += f"\n\n✨ **Better time available!**\n"
        captain_message += f"Recommended: {best.recommended_time.strftime('%A, %I:%M %p')}\n"
        captain_message += f"Expected attendance: ↑ {best.attendance_improvement} more members"
    
    if not requires_action:
        status = EventStatus.SCHEDULED
        captain_message = f"✅ Event scheduled! Expected attendance: ~{total_predicted}/{len(event.invited_members)} members at {event.proposed_time.strftime('%A, %I:%M %p')}"
    
    # ===== Store Event =====
    EVENTS_DB[event_id] = {
        "id": event_id,
        "event": event,
        "status": status,
        "created_at": datetime.now(),
        "predictions": attendance_predictions,
        "conflicts": conflicts_detected,
    }
    
    return EventSchedulingResponse(
        event_id=event_id,
        event=event,
        status=status,
        scheduling_analysis={
            "total_invited": len(event.invited_members),
            "predicted_attendance": total_predicted,
            "attendance_percentage": round(current_attendance_rate * 100, 1),
            "conflicts_count": len(conflicts_detected),
        },
        conflicts=conflicts_detected,
        recommendations=recommendations,
        captain_message=captain_message,
        requires_captain_action=requires_action
    )

@router.post("/optimize-event/{event_id}")
async def optimize_event(event_id: str, new_time: Optional[datetime] = None):
    """Captain accepts optimization recommendation"""
    if event_id not in EVENTS_DB:
        raise HTTPException(status_code=404, detail="Event not found")
    
    event_data = EVENTS_DB[event_id]
    
    if new_time:
        event_data["event"].proposed_time = new_time
        event_data["status"] = EventStatus.OPTIMIZED
    
    event_data["status"] = EventStatus.CONFIRMED
    
    return {
        "event_id": event_id,
        "status": event_data["status"],
        "event_time": event_data["event"].proposed_time,
        "message": "Event optimized and confirmed. Notifications queued."
    }

@router.get("/event/{event_id}")
async def get_event_details(event_id: str):
    """Get full event details with scheduling analysis"""
    if event_id not in EVENTS_DB:
        raise HTTPException(status_code=404, detail="Event not found")
    
    return EVENTS_DB[event_id]

@router.get("/events/captain/{captain_id}")
async def get_captain_events(captain_id: str):
    """Get all events created by a captain"""
    captain_events = [
        event for event in EVENTS_DB.values()
        if event["event"].captain_id == captain_id
    ]
    
    return {
        "captain_id": captain_id,
        "total_events": len(captain_events),
        "events": captain_events
    }