import { Resend } from "resend";
import Email from "../models/Email.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendBulkEmail = async (req, res) => {
    const {
        senderName,
        recipientEmails,
        subject,
        email,
        userId,
        generatedByAI,
    } = req.body;

    if (!senderName || !recipientEmails || !subject || !email) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
    }

    if (!Array.isArray(recipientEmails) || recipientEmails.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Invalid recipient emails list",
        });
    }

    try {
        const results = {
            successful: [],
            failed: [],
        };

        const BATCH_SIZE = 5;
        for (let i = 0; i < recipientEmails.length; i += BATCH_SIZE) {
            const batch = recipientEmails.slice(i, i + BATCH_SIZE);

            const batchPromises = batch.map(async (recipientEmail) => {
                try {
                    const personalizedEmail = email
                        .replace(/\{name\}/g, recipientEmail.split("@")[0])
                        .replace(/\{email\}/g, recipientEmail);

                    const data = await resend.emails.send({
                        from: `${senderName} <echo@ketankumavat.me>`,
                        to: [recipientEmail],
                        subject: subject,
                        html: personalizedEmail,
                    });

                    const emailRecord = new Email({
                        userId,
                        senderName,
                        senderEmail: "echo@ketankumavat.me",
                        recipientEmail,
                        subject,
                        body: personalizedEmail,
                        status: "sent",
                        sentAt: new Date(),
                        generatedByAI: generatedByAI || false,
                        tags: ["bulk-email"],
                    });

                    await emailRecord.save();

                    results.successful.push({
                        email: recipientEmail,
                        id: data.id,
                    });
                } catch (error) {
                    console.error(
                        `Failed to send email to ${recipientEmail}:`,
                        error
                    );
                    results.failed.push({
                        email: recipientEmail,
                        error: error.message,
                    });
                }
            });

            await Promise.allSettled(batchPromises);

            if (i + BATCH_SIZE < recipientEmails.length) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }
        }

        const totalSent = results.successful.length;
        const totalFailed = results.failed.length;

        res.status(200).json({
            success: true,
            message: `Bulk email completed: ${totalSent} sent, ${totalFailed} failed`,
            results: {
                totalSent,
                totalFailed,
                successful: results.successful,
                failed: results.failed,
            },
        });
    } catch (error) {
        console.error("Bulk email error:", error);
        res.status(500).json({
            success: false,
            message: "Error sending bulk emails",
            error: error.message,
        });
    }
};

export default sendBulkEmail;
