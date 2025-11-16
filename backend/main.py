from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.event import router as event_router
from routes.messages import router as message_router
from routes.member import router as member_router
from routes.voice import voice_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(event_router)
app.include_router(message_router)
app.include_router(voice_router)
app.include_router(member_router)

@app.get("/")
def root():
    return {"status": "ok"}
