import express from "express";
import { IMessageSDK } from "@photon-ai/imessage-kit";

const sdk = new IMessageSDK({
  debug: true,
  maxConcurrent: 3
});

const app = express();
app.use(express.json());

app.post("/send", async (req, res) => {
  const { to, text } = req.body;

  if (!to || !text) {
    return res.status(400).json({ error: "Missing 'to' or 'text'" });
  }

  try {
    const result = await sdk.send(to, text);
    return res.json({ success: true, sent: result });
  } catch (err) {
    console.error("iMessage send failed:", err);
    return res.status(500).json({ error: "Failed to send iMessage" });
  }
});

app.listen(5051, () => {
  console.log("📱 iMessage server running on http://localhost:5051");
});
