export async function speak(text: string) {
    console.log("STEP 1 — FUNCTION CALLED. Text:", text);
  
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    const voiceId = "<YOUR_VOICE_ID>";
  
    if (!apiKey) {
      console.error("STEP 2 — ❌ API KEY NOT FOUND in VITE_ELEVENLABS_API_KEY");
      return;
    }
  
    try {
      console.log("STEP 3 — Sending request to ElevenLabs...");
  
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
          }),
        }
      );
  
      console.log("STEP 4 — Raw response:", res);
  
      if (!res.ok) {
        console.error("STEP 5 — ❌ ElevenLabs responded with an error:");
        console.error(await res.text());
        return;
      }
  
      console.log("STEP 6 — Converting to Blob...");
      const audioBlob = await res.blob();
  
      console.log("STEP 7 — Creating audio URL...");
      const audioUrl = URL.createObjectURL(audioBlob);
  
      console.log("STEP 8 — Creating <audio> element...");
      const audio = new Audio(audioUrl);
  
      audio.oncanplaythrough = () => {
        console.log("STEP 9 — 🎧 Audio loaded. Playing...");
        audio.play();
      };
  
      audio.onerror = (err) => {
        console.error("STEP 10 — ❌ AUDIO ERROR:", err);
      };
    } catch (err) {
      console.error("STEP XX — 🔥 FETCH ERROR:", err);
    }
  }
  