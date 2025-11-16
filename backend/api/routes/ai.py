# backend/routes/ai.py - AI & Behavioral Forecasting Models
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from enum import Enum
import json


router = APIRouter(prefix="/api/ai", tags=["ai"])

# ==================== Models ====================
class TimeContext(str, Enum):
    EXAM_WEEK = "exam_week"
    REGULAR_WEEK = "regular_week"
    BREAK = "break"
    WEEKEND = "weekend"

class BehaviorPattern(BaseModel):
    member_id: str
    day_of_week: str
    time_of_day: str
    base_attendance_rate: float
    context: TimeContext
    class_conflicts: List[str]
    historical_factors: Dict[str, float]

class AttendancePrediction(BaseModel):
    member_id: str
    predicted_attendance: bool
    confidence: float
    reasoning: str
    behavioral_factors: Dict[str, float]

# Mock behavioral database
MEMBER_BEHAVIORS = {
    "m1": {
        "name": "Alice",
        "phone": "+1-234-567-0001",
        "class_schedule": ["MWF 10-11am", "TR 2-3:30pm"],
        "exam_weeks": [16, 17],  # week numbers
        "past_patterns": {
            "friday_night": 0.95,
            "tuesday_afternoon": 0.6,
            "exam_week": 0.3,
            "break_period": 0.85,
        },
        "communication_style": "casual",
        "personality_traits": ["funny", "reliable", "introverted"],
    },
    "m2": {
        "name": "Bob",
        "phone": "+1-234-567-0002",
        "class_schedule": ["MWF 9-10am", "W 3-5pm"],
        "exam_weeks": [16, 17],
        "past_patterns": {
            "friday_night": 0.7,
            "tuesday_afternoon": 0.9,
            "exam_week": 0.2,
            "break_period": 0.9,
        },
        "communication_style": "formal",
        "personality_traits": ["dependable", "organized", "outgoing"],
    },
}

# Mock message history for digital twin training
MESSAGE_HISTORY = {
    "m1": [
        "omg yes! im so down 😂",
        "cant make it, got an exam",
        "haha maybe, depends on homework",
        "yesss let's go!",
        "ah shoot i forgot, my bad",
    ],
    "m2": [
        "I appreciate the invite. I'll try to make it.",
        "Unfortunately I have a conflict that day.",
        "Count me in.",
        "I need to check my calendar.",
        "Thank you for including me.",
    ],
}

# ==================== Behavioral Forecasting ====================

@router.post("/predict-attendance")
async def predict_attendance(
    member_id: str,
    proposed_time: datetime,
    event_type: str,
    context: Optional[TimeContext] = TimeContext.REGULAR_WEEK
):
    """
    Behavioral Forecasting Model
    Predicts if member will attend based on:
    - Historical patterns (day/time preferences)
    - Academic calendar (exams, breaks)
    - Class conflicts
    - Life patterns (not just RSVPs)
    """
    
    if member_id not in MEMBER_BEHAVIORS:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member = MEMBER_BEHAVIORS[member_id]
    
    # Extract temporal info
    day_of_week = proposed_time.strftime("%A")
    hour = proposed_time.hour
    time_of_day = "morning" if hour < 12 else "afternoon" if hour < 17 else "evening"
    
    # Start with base score
    attendance_score = 0.6
    factors = {}
    
    # 1. Historical pattern matching
    pattern_key = f"{day_of_week.lower()}_{time_of_day}"
    if pattern_key in member["past_patterns"]:
        pattern_score = member["past_patterns"][pattern_key]
        attendance_score *= pattern_score
        factors["historical_pattern"] = pattern_score
    
    # 2. Context-based adjustment
    context_modifiers = {
        TimeContext.EXAM_WEEK: 0.3,
        TimeContext.REGULAR_WEEK: 1.0,
        TimeContext.BREAK: 0.95,
        TimeContext.WEEKEND: 0.9,
    }
    context_modifier = context_modifiers.get(context, 1.0)
    attendance_score *= context_modifier
    factors["academic_context"] = context_modifier
    
    # 3. Class conflict detection
    class_conflict = False
    conflict_time = None
    for class_slot in member["class_schedule"]:
        # Simple parsing: "MWF 10-11am" format
        if day_of_week[0] in class_slot.upper():
            if f"{hour}:" in class_slot or f"{hour-1}:" in class_slot:
                class_conflict = True
                conflict_time = class_slot
                attendance_score *= 0.1
                factors["class_conflict"] = 0.1
    
    # 4. Event type preference
    event_modifiers = {
        "meeting": 0.8,
        "social": 0.95,
        "activity": 0.9,
        "study_session": 0.7,
    }
    event_modifier = event_modifiers.get(event_type, 0.85)
    attendance_score *= event_modifier
    factors["event_type_preference"] = event_modifier
    
    # Clamp between 0 and 1
    confidence = max(0, min(1, attendance_score))
    
    # Generate reasoning
    reasoning_parts = []
    if pattern_key in member["past_patterns"]:
        reasoning_parts.append(f"Historically {member['past_patterns'][pattern_key]:.0%} attend on {day_of_week} {time_of_day}s")
    if class_conflict:
        reasoning_parts.append(f"Class conflict: {conflict_time}")
    if context != TimeContext.REGULAR_WEEK:
        reasoning_parts.append(f"During {context.value.replace('_', ' ')}")
    
    return AttendancePrediction(
        member_id=member_id,
        predicted_attendance=confidence > 0.6,
        confidence=round(confidence, 2),
        reasoning=". ".join(reasoning_parts) if reasoning_parts else "Standard availability",
        behavioral_factors=factors
    )

# ==================== Tone-Engineered Digital Twin ====================

class MessageTone(BaseModel):
    formality_level: str  # casual, neutral, formal
    humor_frequency: float  # 0-1
    emoji_usage: float  # 0-1
    response_length: str  # short, medium, long

class GeneratedMessage(BaseModel):
    message: str
    tone_analysis: Dict
    confidence: float
    member_personality: List[str]
    approval_required: bool

def analyze_communication_style(member_id: str) -> MessageTone:
    """Analyze member's communication patterns from history"""
    if member_id not in MESSAGE_HISTORY:
        return MessageTone(formality_level="neutral", humor_frequency=0.5, emoji_usage=0.5, response_length="medium")
    
    messages = MESSAGE_HISTORY[member_id]
    
    # Simple heuristics for style analysis
    formal_keywords = ["appreciate", "unfortunately", "count", "include", "thank"]
    casual_keywords = ["omg", "haha", "yeah", "cool", "down"]
    
    formal_count = sum(1 for msg in messages for kw in formal_keywords if kw in msg.lower())
    casual_count = sum(1 for msg in messages for kw in casual_keywords if kw in msg.lower())
    emoji_count = sum(1 for msg in messages for char in msg if ord(char) > 127)
    
    if formal_count > casual_count:
        formality = "formal"
    elif casual_count > formal_count:
        formality = "casual"
    else:
        formality = "neutral"
    
    return MessageTone(
        formality_level=formality,
        humor_frequency=casual_count / len(messages) if messages else 0.5,
        emoji_usage=emoji_count / sum(len(msg) for msg in messages) if messages else 0.5,
        response_length="short" if formal_count > 0 else "medium"
    )

@router.post("/generate-message/conflict")
async def generate_conflict_message(
    member_id: str,
    conflict_type: str,  # "calendar_clash", "event_conflict", "reschedule_request"
    original_commitment: str,
    conflicting_event: str,
):
    """
    Tone-Engineered Digital Twin
    Generates personalized conflict resolution message
    Mimics member's actual communication style
    """
    
    if member_id not in MEMBER_BEHAVIORS:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member = MEMBER_BEHAVIORS[member_id]
    tone = analyze_communication_style(member_id)
    
    # Message templates personalized by tone
    messages = {
        "casual": {
            "decline": f"hey! thanks for the invite to {original_commitment}, but i got {conflicting_event} that day :/ maybe next time?",
            "propose_reschedule": f"yo! would you be down to move {original_commitment} to another time? i got {conflicting_event} that day",
            "acknowledge_help": "omg thanks so much for catching that! 🙏",
        },
        "formal": {
            "decline": f"Thank you for the invitation to {original_commitment}. Unfortunately, I have a prior commitment ({conflicting_event}) that conflicts. I appreciate your understanding.",
            "propose_reschedule": f"I would like to attend {original_commitment}, however I have {conflicting_event} scheduled for that time. Would it be possible to reschedule?",
            "acknowledge_help": "I appreciate you bringing this to my attention.",
        },
        "neutral": {
            "decline": f"Thanks for inviting me to {original_commitment}. I have a conflict with {conflicting_event} that day, so I won't be able to make it.",
            "propose_reschedule": f"I'm interested in {original_commitment}, but I have {conflicting_event} at that time. Could we find another time?",
            "acknowledge_help": "Thanks for flagging this. I appreciate the heads up.",
        },
    }
    
    # Select appropriate message
    formality = tone.formality_level
    if conflict_type == "calendar_clash":
        selected_message = messages[formality]["decline"]
    elif conflict_type == "reschedule_request":
        selected_message = messages[formality]["propose_reschedule"]
    else:
        selected_message = messages[formality]["acknowledge_help"]
    
    return GeneratedMessage(
        message=selected_message,
        tone_analysis={
            "formality": tone.formality_level,
            "humor_level": tone.humor_frequency,
            "emoji_usage": tone.emoji_usage,
        },
        confidence=round(0.85, 2),
        member_personality=member["personality_traits"],
        approval_required=True
    )

@router.get("/member/{member_id}/communication-profile")
async def get_communication_profile(member_id: str):
    """Get member's digital twin profile"""
    if member_id not in MEMBER_BEHAVIORS:
        raise HTTPException(status_code=404, detail="Member not found")
    
    member = MEMBER_BEHAVIORS[member_id]
    tone = analyze_communication_style(member_id)
    
    return {
        "member_id": member_id,
        "name": member["name"],
        "personality_traits": member["personality_traits"],
        "communication_style": tone.dict(),
        "class_schedule": member["class_schedule"],
        "message_samples": MESSAGE_HISTORY.get(member_id, []),
    }

# ==================== Anticipatory Conflict Interception ====================

class ConflictAlert(BaseModel):
    member_id: str
    member_name: str
    conflict_type: str
    severity: str  # low, medium, high
    detection_time: datetime
    proposed_resolution: str
    draft_message: str
    action_required: bool

@router.post("/detect-conflicts")
async def detect_all_conflicts(
    event_id: str,
    event_name: str,
    proposed_time: datetime,
    invited_members: List[str],
):
    """
    Anticipatory Conflict Interception
    Detects potential issues BEFORE they become problems
    Generates smart resolutions for captain approval
    """
    
    conflicts = []
    
    for member_id in invited_members:
        if member_id not in MEMBER_BEHAVIORS:
            continue
        
        member = MEMBER_BEHAVIORS[member_id]
        
        # Check for class conflicts
        day_of_week = proposed_time.strftime("%A")
        hour = proposed_time.hour
        
        for class_slot in member["class_schedule"]:
            if day_of_week[0] in class_slot.upper():
                if f"{hour}:" in class_slot:
                    # Generate resolution options
                    resolution = f"Reschedule {event_name} to avoid {class_slot} conflict"
                    
                    # Draft message with digital twin
                    tone = analyze_communication_style(member_id)
                    if tone.formality_level == "casual":
                        draft = f"hey {member['name']}, we caught that you got {class_slot}. we're moving {event_name} to a better time!"
                    else:
                        draft = f"We identified a scheduling conflict with your {class_slot}. We propose rescheduling {event_name} to accommodate this."
                    
                    conflicts.append(ConflictAlert(
                        member_id=member_id,
                        member_name=member["name"],
                        conflict_type="class_conflict",
                        severity="high",
                        detection_time=datetime.now(),
                        proposed_resolution=resolution,
                        draft_message=draft,
                        action_required=True
                    ))
    
    return {
        "event_id": event_id,
        "event_name": event_name,
        "proposed_time": proposed_time,
        "conflicts_detected": len(conflicts),
        "conflicts": conflicts,
        "captain_action_needed": len(conflicts) > 0
    }

@router.post("/approve-resolution")
async def approve_resolution(
    event_id: str,
    member_id: str,
    action: str,  # "send_message", "reschedule_event", "manual_review"
    message_override: Optional[str] = None,
):
    """Captain approves AI-generated resolution"""
    return {
        "status": "approved",
        "event_id": event_id,
        "member_id": member_id,
        "action": action,
        "message": message_override or "AI-generated message sent",
        "timestamp": datetime.now()
    }