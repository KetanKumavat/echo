import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendEmail = async (req, res) => {
  const { sender, senderEmail, receiverEmail, subject, email } = req.body;
  let transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD,
    },
  });
  let info = await transporter.sendMail({
    from: `"${sender}" <${senderEmail}>`,
    to: receiverEmail,
    subject: subject,
    text: email,
    html: `<html>
              <body>
                <p>${email}</p>
                <br />
                <p>Powered By Echo</p>
              </body>
            </html>`,
  });
  console.log(`Sender: ${senderEmail}, Receiver: ${receiverEmail}`);
  console.log("Message sent: %s", info.messageId);

  res.json(info);
};

export default sendEmail;