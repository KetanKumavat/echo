import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";
import sendEmail from "./controller/sendEmail.js";
const app = express();
const port = process.env.PORT;
app.use(
  cors({ origin: ["https://echo-echo.vercel.app", "http://localhost:5173"] })
);
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-email", async (req, res) => {
  const prompt = req.body.prompt;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    res.send({ email: text });
  } catch (error) {
    console.error("Error generating email:", error);
    res.status(500).send({ error: "Error generating email" });
  }
});

app.post("/send-email", sendEmail);

app.listen(port, () => {
  console.log(`Server running on port:${port}`);
});