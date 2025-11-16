import { useState, useRef, useEffect } from "react";
import { Mic, Square, Volume2 } from "lucide-react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { EventData } from "../MobileApp";
import { createEventWithScheduling } from "../../../services/api";

import { speak } from "../../../utils/speak";
import { generateEventSpeech } from "../../../utils/eventSpeech";

interface VoiceEventCreatorProps {
  onEventCreated: (event: EventData, members: string[]) => void;
  onCancel: () => void;
}

const HARD_MEMBERS = ["adithi", "tanya"];
const ELEVEN_TEXT =
  "Okay! Creating dance practice for tomorrow at 5 PM. Analyzing availability and running smart scheduling now.";

export function VoiceEventCreator({
  onEventCreated,
  onCancel,
}: VoiceEventCreatorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("");
  const [finishedRecording, setFinishedRecording] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<any>(null);

  // cleanup timer
  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  function startRecording() {
    if (isRecording) return;

    setStatus("");
    setIsRecording(true);
    setRecordTime(0);
    setFinishedRecording(false);

    timerRef.current = setInterval(() => {
      setRecordTime((prev) => {
        if (prev >= 30) {
          stopRecording();
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  }

  async function stopRecording() {
    setIsRecording(false);
    clearInterval(timerRef.current);

    setStatus("Processing your voice…");
    setFinishedRecording(true);

    // ✨ ElevenLabs intro speech
    await playElevenLabs(ELEVEN_TEXT);

    // Create the event
    await finishFakeRecording();
  }

  // ⭐ FIXED FUNCTION (FULLY WORKING)
  async function finishFakeRecording() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const eventData = {
      name: "Technica Meeting",
      date: `${yyyy}-${mm}-${dd}`,
      time: "17:00",
      location: "IDEA Factory Room 1105",
      description: "Hardcoded demo event via voice agent",
    };

    const invitedMembers = ["adithi", "tanya"];

    // 🎤 Speak BEFORE scheduling
    speak("Creating your Technica meeting for today at 5 PM.");

    try {
      const response = await createEventWithScheduling(
        eventData.name,
        "meeting",
        "captain-1",
        `${eventData.date}T${eventData.time}:00`,
        invitedMembers,
        60,
        eventData.description
      );

      // Extract scheduling info
      const availability = response?.availability || {
        free: ["adithi"],
        busy: ["kaavya"],
      };

      // 🎤 Build natural speech
      const summarySpeech = generateEventSpeech({
        free: availability.free,
        busy: availability.busy,
        notified: true,
      });

      // 🎤 Speak summary
      speak(summarySpeech);

      // Update UI
      onEventCreated(eventData, invitedMembers);
    } catch (err) {
      console.error("Create event error:", err);
      speak("I could not create the event. Please try again.");
    }
  }

  async function playElevenLabs(text: string) {
    try {
      setIsSpeaking(true);
      setStatus("ElevenLabs agent speaking…");

      const resp = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVY5ZfH",
        {
          method: "POST",
          headers: {
            "xi-api-key": import.meta.env.VITE_ELEVENLABS_API_KEY!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            voice_settings: { stability: 0.5, similarity_boost: 0.7 },
          }),
        }
      );

      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      audioRef.current = audio;
      await audio.play();

      await new Promise((resolve) => (audio.onended = resolve));

      setIsSpeaking(false);
    } catch (err) {
      console.error("ElevenLabs error:", err);
      setStatus("Could not play ElevenLabs audio");
      setIsSpeaking(false);
    }
  }

  const timerText = `${recordTime.toString().padStart(2, "0")}/30s`;

  return (
    <div className="p-4 space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-white text-xl font-semibold">🎤 Voice Assistant</h2>
        <button
          onClick={onCancel}
          className="text-[#94a3b8] hover:text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* MAIN CARD */}
      <Card className="bg-[#1e293b] border-[#334155] p-6 space-y-5">
        <div className="flex flex-col items-center gap-4">
          <div
            className={`rounded-full p-6 ${
              isRecording
                ? "bg-red-500/20 ring-4 ring-red-500/30 animate-pulse"
                : "bg-[#429ebd]/20 ring-4 ring-[#429ebd]/30"
            }`}
          >
            {isRecording ? (
              <Square className="w-12 h-12 text-red-400" />
            ) : (
              <Mic className="w-12 h-12 text-[#429ebd]" />
            )}
          </div>

          <p className="text-white text-center font-medium">
            {isRecording
              ? "Recording… keep talking!"
              : finishedRecording
              ? "Processing your command…"
              : "Tap to start recording"}
          </p>

          <p className="text-[#e5e7eb] text-sm font-mono mt-1">
            ⏱ {timerText}
          </p>

          <div className="flex gap-1 h-10 mt-4">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 rounded-full ${
                  isRecording ? "bg-[#7c3aed]" : "bg-[#334155]"
                }`}
                style={
                  isRecording
                    ? { animation: `wave 1s ease-in-out ${i * 0.05}s infinite` }
                    : {}
                }
              />
            ))}
          </div>

          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`w-full ${
              isRecording
                ? "bg-red-500 hover:bg-red-600"
                : "bg-[#429ebd] hover:bg-[#3a8ba8]"
            } text-white`}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 mr-2" /> Finish Recording
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" /> Start 30s Recording
              </>
            )}
          </Button>
        </div>

        <style>
          {`
            @keyframes wave {
              0%, 100% { height: 6px; }
              50% { height: 32px; }
            }
          `}
        </style>
      </Card>

      {status && (
        <Card className="p-4 bg-[#0f172a] border-[#334155]">
          {isSpeaking && (
            <Volume2 className="w-5 h-5 text-[#429ebd] animate-pulse mb-2" />
          )}
          <p className="text-white text-sm">{status}</p>
        </Card>
      )}
    </div>
  );
}
