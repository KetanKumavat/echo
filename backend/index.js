// import express from "express";
// import dotenv from "dotenv";
// dotenv.config();
// const app = express();
// const port = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`App is listening on port ${port}`);
// });

import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-email", async (req, res) => {
  const prompt = req.body.prompt;
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
  res.send({ email: text });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

