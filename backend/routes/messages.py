from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx

router = APIRouter(prefix="/api/messages", tags=["messages"])

# For now: always send to ONE phone number
DEFAULT_PHONE = "+13013469059"


# ============================
# REQUEST MODEL
# ============================
class SendMessageRequest(BaseModel):
    message: str   # <-- send only the message text


# ============================
# HELPER — SEND VIA iMESSAGE KIT
# ============================
async def deliver_message(text: str):
    try:
        # Create client with 60 second timeout
        async with httpx.AsyncClient(timeout=60.0) as client:
            r = await client.post(
                "http://localhost:5051/send",
                json={"to": DEFAULT_PHONE, "text": text}
            )
            r.raise_for_status()  # Raise exception for 4xx/5xx status codes
            return r.json()
    
    except httpx.ReadTimeout:
        raise HTTPException(status_code=504, detail="iMessage service took too long to respond")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Could not connect to iMessage service. Is it running on port 5051?")
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to deliver message: {str(e)}")


# ============================
# SEND ENDPOINT
# ============================
@router.post("/send")
async def send_message(req: SendMessageRequest):
    # Call the iMessage server
    delivery_result = await deliver_message(req.message)

    return {
        "success": True,
        "sent_to": DEFAULT_PHONE,
        "delivery": delivery_result
    }