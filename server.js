const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ---------- Story erzeugen ----------
app.post("/generate", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: prompt }
        ]
      })
    });

    const data = await response.json();

    res.json(data); // 👈 NUR EINMAL
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});
// ---------- Bild erzeugen ----------
app.post("/generate-image", async (req, res) => {
const { prompt } = req.body;

try {

const response = await fetch(
  "https://api.openai.com/v1/images/generations",
  {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      "Authorization":
        `Bearer ${process.env.OPENAI_API_KEY}`
    },

    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: prompt,
      size: "1024x1024"
    })
  }
);

const data = await response.json();

res.json(data);

} catch (error) {

console.error(error);

res.status(500).json({
  error: error.message
});

}
});

app.listen(3000, () => {

console.log("Server läuft auf Port 3000");

});