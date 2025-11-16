# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List

app = FastAPI(
    title="ClubPilot API",
    version="2.0.0",
    description="Intelligent Club Management with AI Behavioral Forecasting & Digital Twins"
)
from routes.ai import router as ai_router
from routes.event import router as event_router
from routes.member import router as member_router

app.include_router(ai_router)
app.include_router(event_router)
app.include_router(member_router)


# ==================== CORS ====================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==================== MOCK MEMBERS ENDPOINT ====================
@app.get("/api/members")
async def get_mock_members():
    return [
        {"id": "m1", "name": "Alice", "emoji": "👩"},
        {"id": "m2", "name": "Bob", "emoji": "👨"},
        {"id": "m3", "name": "Charlie", "emoji": "👨"},
        {"id": "m4", "name": "Diana", "emoji": "👩"},
        {"id": "m5", "name": "Evan", "emoji": "👨"},
    ]

# ==================== MOCK EVENT CREATION ====================

class MockEventRequest(BaseModel):
    event_name: str
    event_type: str
    captain_id: str
    proposed_time: datetime
    invited_members: List[str]

@app.post("/api/events/create-with-scheduling")
async def create_event_mock(event: MockEventRequest):
    return {
        "event_id": "evt_1",
        "event": event,
        "status": "optimized",
        "captain_message": "✨ Better time available! Friday 7pm has higher attendance prediction.",
        "requires_captain_action": True,
        "recommendations": [
            {
                "original_time": event.proposed_time,
                "recommended_time": "2025-11-21T19:00:00",
                "current_predicted_attendance": 6,
                "recommended_predicted_attendance": 9,
                "attendance_improvement": 3
            }
        ]
    }

# ==================== MOCK AI ENDPOINTS ====================

@app.post("/api/ai/predict-attendance")
async def predict_attendance_mock(member_id: str, proposed_time: datetime):
    return {
        "member_id": member_id,
        "predicted_attendance": True,
        "confidence": 0.85,
        "reasoning": "High Friday evening attendance pattern"
    }

class MessageGenerationRequest(BaseModel):
    member_id: str
    conflict_type: str
    original_commitment: str
    conflicting_event: str

@app.post("/api/ai/generate-message/conflict")
async def generate_conflict_message_mock(request: MessageGenerationRequest):
    return {
        "message": "hey! thanks for letting me know about the conflict. appreciate you catching that! 🙏",
        "confidence": 0.88
    }

class ConflictDetectionRequest(BaseModel):
    event_id: str
    event_name: str
    proposed_time: datetime
    invited_members: List[str]

@app.post("/api/ai/detect-conflicts")
async def detect_conflicts_mock(request: ConflictDetectionRequest):
    return {
        "event_id": request.event_id,
        "event_name": request.event_name,
        "proposed_time": request.proposed_time,
        "conflicts_detected": 1,
        "conflicts": [
            {
                "member_id": "m1",
                "member_name": "Alice",
                "conflict_type": "class_conflict"
            }
        ]
    }

# ==================== HEALTH ====================

@app.get("/")
async def root():
    return {"message": "ClubPilot API v2.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
