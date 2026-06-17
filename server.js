const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const XAI_API_KEY = process.env.XAI_API_KEY;

// =========================
// STORY (TEXT)
// =========================
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "grok-3",           // oder "grok-4.3" falls du upgradest
        messages: [
          { 
            role: "system", 
            content: "Du bist eine sehr talentierte erotische Autorin. Schreibe detailliert, sinnlich und explizit." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.85,
        max_tokens: 2500
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("STORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =========================
// BILDGENERIERUNG (NEU)
// =========================
app.post("/generate-image", async (req, res) => {
  const { prompt, model = "grok-imagine-image-quality", n = 1, aspect_ratio = "9:16" } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt für das Bild fehlt" });
  }

  try {
    const response = await fetch("https://api.x.ai/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${XAI_API_KEY}`
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        n: n,                    // Anzahl Bilder (1-10)
        aspect_ratio: aspect_ratio,   // z.B. "9:16", "16:9", "1:1", "4:3"
        response_format: "url"   // oder "b64_json"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Fehler bei der Bildgenerierung");
    }

    res.json(data);

  } catch (error) {
    console.error("IMAGE ERROR:", error);
    res.status(500).json({ 
      error: "Fehler beim Generieren des Bildes",
      details: error.message 
    });
  }
});

// STimme
app.post("/generate-audio", async (req, res) => {

  const { text, voice } = req.body;

  const voices = {
    Adam: process.env.VOICE_ADAM,
    David: process.env.VOICE_DAVID,
    Riley: process.env.VOICE_RILEY,
    Monika: process.env.VOICE_MONIKA,
    Voice_Actor: process.env.VOICE_VOICE_ACTOR
  };

  const voiceId = voices[voice];
  if (!voiceId) {
  return res.status(400).json({
    error: "Unbekannte Stimme: " + voice
  });
}
  const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

  console.log("Voice:", voice);
  console.log("VoiceID:", voiceId);

  try {

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2"
        })
      }
    );

    if (!response.ok) {

      const errorText = await response.text();

      console.log("ELEVENLABS ERROR:");
      console.log(errorText);

      return res.status(500).json({
        error: errorText
      });
    }
console.log("Status:", response.status);
console.log("Content-Type:", response.headers.get("content-type"));
    const buffer = await response.arrayBuffer();

    res.set("Content-Type", "audio/mpeg");

    res.send(Buffer.from(buffer));

  } catch (error) {

    console.error("AUDIO ERROR:", error);

    res.status(500).json({
      error: error.message
    });

  }

});
// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});