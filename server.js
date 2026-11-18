
const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("GEMINI_API_KEY is missing!");
}

const genAI = API_KEY
  ? new GoogleGenerativeAI(API_KEY)
  : null;

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "پیام معتبر نیست."
      });
    }

    if (!genAI) {
      return res.status(503).json({
        error: "سرور هنوز به مدل هوش مصنوعی متصل نشده است."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction:
        "You are Zeno AI, a helpful Persian-speaking assistant. Reply naturally in Persian unless the user asks for another language."
    });

    const result = await model.generateContent(message);
    const response = result.response.text();

    res.json({ reply: response });

  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      error: "ارتباط با هوش مصنوعی با مشکل مواجه شد."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Zeno AI server running on port ${PORT}`);
});
