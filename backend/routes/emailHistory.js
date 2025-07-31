import express from "express";
import Email from "../models/Email.js";

const router = express.Router();

router.get("/emails/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            page = 1,
            limit = 10,
            status,
            search,
            startDate,
            endDate,
            sortBy = "sentAt",
            sortOrder = "desc",
        } = req.query;

        const query = { userId };

        if (status) query.status = status;
        if (search) {
            query.$or = [
                { subject: { $regex: search, $options: "i" } },
                { recipientEmail: { $regex: search, $options: "i" } },
                { body: { $regex: search, $options: "i" } },
            ];
        }
        if (startDate || endDate) {
            query.sentAt = {};
            if (startDate) query.sentAt.$gte = new Date(startDate);
            if (endDate) query.sentAt.$lte = new Date(endDate);
        }

        const sort = {};
        sort[sortBy] = sortOrder === "desc" ? -1 : 1;

        const emails = await Email.find(query)
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select("-body"); // Exclude body

        const total = await Email.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        res.json({
            success: true,
            data: {
                emails,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalEmails: total,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching emails:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching email history",
        });
    }
});

router.get("/email/:id", async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }

        res.json({
            success: true,
            data: email,
        });
    } catch (error) {
        console.error("Error fetching email:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching email",
        });
    }
});

router.post("/email", async (req, res) => {
    try {
        const {
            userId,
            senderName,
            senderEmail,
            recipientEmail,
            subject,
            body,
            status = "sent",
            generatedByAI = false,
            emailTemplate = "custom",
            tags = [],
        } = req.body;

        const newEmail = new Email({
            userId,
            senderName,
            senderEmail,
            recipientEmail,
            subject,
            body,
            status,
            generatedByAI,
            emailTemplate,
            tags,
        });

        const savedEmail = await newEmail.save();

        res.status(201).json({
            success: true,
            message: "Email saved successfully",
            data: savedEmail,
        });
    } catch (error) {
        console.error("Error saving email:", error);
        res.status(500).json({
            success: false,
            message: "Error saving email",
        });
    }
});

router.delete("/email/:id", async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);
        if (!email) {
            return res.status(404).json({
                success: false,
                message: "Email not found",
            });
        }

        res.json({
            success: true,
            message: "Email deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting email:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting email",
        });
    }
});

router.get("/analytics/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const { timeRange = "30d" } = req.query;

        // date range
        const now = new Date();
        let startDate;
        switch (timeRange) {
            case "7d":
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case "30d":
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case "90d":
                startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const analytics = await Email.aggregate([
            {
                $match: {
                    userId: userId,
                    sentAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: null,
                    totalEmails: { $sum: 1 },
                    sentEmails: {
                        $sum: { $cond: [{ $eq: ["$status", "sent"] }, 1, 0] },
                    },
                    draftEmails: {
                        $sum: { $cond: [{ $eq: ["$status", "draft"] }, 1, 0] },
                    },
                    aiGeneratedEmails: {
                        $sum: { $cond: ["$generatedByAI", 1, 0] },
                    },
                    avgEmailsPerDay: { $avg: 1 },
                },
            },
        ]);

        const dailyStats = await Email.aggregate([
            {
                $match: {
                    userId: userId,
                    sentAt: { $gte: startDate },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$sentAt",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.json({
            success: true,
            data: {
                summary: analytics[0] || {
                    totalEmails: 0,
                    sentEmails: 0,
                    draftEmails: 0,
                    aiGeneratedEmails: 0,
                    avgEmailsPerDay: 0,
                },
                dailyStats,
                timeRange,
            },
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching analytics",
        });
    }
});

export default router;
