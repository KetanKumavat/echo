import mongoose from "mongoose";

const emailSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        senderName: {
            type: String,
            required: true,
        },
        senderEmail: {
            type: String,
            required: true,
        },
        recipientEmail: {
            type: String,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "draft", "failed"],
            default: "sent",
        },
        sentAt: {
            type: Date,
            default: Date.now,
        },
        generatedByAI: {
            type: Boolean,
            default: false,
        },
        emailTemplate: {
            type: String,
            enum: ["formal", "casual", "marketing", "follow-up", "custom"],
            default: "custom",
        },
        readStatus: {
            type: Boolean,
            default: false,
        },
        tags: [
            {
                type: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

emailSchema.index({ userId: 1, sentAt: -1 });
emailSchema.index({ userId: 1, status: 1 });

const Email = mongoose.model("Email", emailSchema);

export default Email;
