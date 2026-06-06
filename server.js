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
        model: "grok-3",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error("STORY ERROR:", error);

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
  console.log("Server läuft auf Port", PORT);
});