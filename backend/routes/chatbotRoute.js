import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const router = express.Router();

// Use a supported model name directly
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let chatHistory = [];

router.post("/", async (req, res) => {
  const { message } = req.body;
  try {
    chatHistory.push(`User: ${message}`);
    const context = chatHistory.slice(-5).join("\n");

    const prompt = `You are MediBot, AI assistant for AppointMedic. 
Help users book doctors and answer health questions. Avoid medical diagnosis.
Conversation:
${context}`;

    const result = await model.generateContent(prompt);
    const reply = result.response?.text() || "Sorry, I cannot respond right now.";

    chatHistory.push(`MediBot: ${reply}`);
    res.json({ reply });
  } catch (error) {
    console.error("Gemini error:", error.response || error.message);
    res.status(500).json({
      reply: "⚠️ Sorry, something went wrong. Please try again later.",
    });
  }
});

export default router;
