import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (req, res) => {
    try {
        const { sender, senderEmail, receiverEmail, subject, email } = req.body;

        const { data, error } = await resend.emails.send({
            from: `${sender} <echo@ketankumavat.me>`,
            to: [receiverEmail],
            subject: subject,
            text: email,
            html: `<html>
                  <body>
                    <h5>From: ${senderEmail}</h5>
                    ${email}
                    <br />
                    <a href="https://echo-echo.vercel.app/">
                    <h5>Powered By Echo</h5>
                    </a>
                  </body>
                </html>`,
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log(`Sender: ${senderEmail}, Receiver: ${receiverEmail}`);
        console.log("Message sent with Resend:", data.id);

        res.json({ success: true, messageId: data.id });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({
            error: "Failed to send email",
            details: error.message,
        });
    }
};

export default sendEmail;
