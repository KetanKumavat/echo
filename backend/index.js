import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import cron from "node-cron";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import sendEmail from "./controller/sendEmail.js";
import sendBulkEmail from "./controller/sendBulkEmail.js";
import emailHistoryRoutes from "./routes/emailHistory.js";
import verifyToken from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/emailgen", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("MongoDB connection error:", error));

app.use(
    cors({
        origin: [
            "https://echo-echo.vercel.app",
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173",
            "https://echo.ketankumavat.me",
        ],
    })
);
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/generate-email", verifyToken, async (req, res) => {
    const prompt = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
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

app.post("/generate-subject", verifyToken, async (req, res) => {
    const prompt = req.body.prompt;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();
        res.send({ email: text });
    } catch (error) {
        console.error("Error generating subject:", error);
        res.status(500).send({ error: "Error generating subject" });
    }
});

app.post("/send-email", verifyToken, sendEmail);
app.post("/send-bulk-email", verifyToken, sendBulkEmail);
app.use("/api", verifyToken, emailHistoryRoutes);

app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        message: "Server is up and running",
    });
});

app.get("/keep-alive", (req, res) => {
    res.json({
        status: "alive",
        timestamp: new Date().toISOString(),
        message: "Keep-alive ping successful",
    });
});

if (
    process.env.NODE_ENV === "production" ||
    process.env.ENABLE_KEEP_ALIVE === "true"
) {
    const serverUrl = process.env.RENDER_EXTERNAL_URL || process.env.SERVER_URL;

    if (serverUrl) {
        cron.schedule("*/14 * * * *", async () => {
            try {
                const fetch = (await import("node-fetch")).default;
                const response = await fetch(`${serverUrl}/keep-alive`);
                const data = await response.json();
            } catch (error) {
                console.error(
                    `Keep-alive ping failed at ${new Date().toISOString()}:`,
                    error.message
                );
            }
        });

        console.log(
            `Keep-alive cron job scheduled for ${serverUrl}/keep-alive (every 14 minutes)`
        );
    } else {
        console.log("Keep-alive disabled: SERVER_URL not configured");
    }
} else {
    console.log("Keep-alive disabled in development mode");
}

app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
