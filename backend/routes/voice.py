from fastapi import APIRouter, Request
import httpx

voice_router = APIRouter(prefix="/api/voice", tags=["voice"])

ELEVEN_API_KEY = "YOUR_ELEVENLABS_KEY"


@voice_router.post("/interpret")
async def interpret_audio(request: Request):
    audio_bytes = await request.body()

    # ---- (1) Send to ElevenLabs STT so you can show usage to judges ----
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.post(
                "https://api.elevenlabs.io/v1/speech-to-text",
                headers={"xi-api-key": ELEVEN_API_KEY},
                files={"file": ("audio.webm", audio_bytes, "audio/webm")},
            )
        text = resp.json().get("text", "")
        print("ElevenLabs transcription:", text)

    except Exception as e:
        print("STT error:", e)

    # ---- (2) HARD CODED EVENT FOR DEMO ----
    return {
        "event_name": "Dance Practice",
        "date": "Tomorrow",
        "time": "5:00 PM",
        "members": ["Adithi", "Tanya"]
    }
