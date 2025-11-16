// src/hooks/useImessageSocket.ts
import { useEffect, useRef, useState } from "react";

export interface ImessageEvent {
  type: "imessage_incoming";
  rowid: number;
  sender: string;
  text: string;
  timestamp: number;
}

export function useImessageSocket() {
  const [events, setEvents] = useState<ImessageEvent[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/imessage");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("[iMessage WS] connected");
      // send a ping occasionally if you want
      ws.send("hello from client");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "imessage_incoming") {
          setEvents((prev) => [...prev, data]);
        }
      } catch (e) {
        console.error("Invalid WS message", e);
      }
    };

    ws.onclose = () => {
      console.log("[iMessage WS] disconnected");
    };

    return () => {
      ws.close();
    };
  }, []);

  return { events };
}
