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
    from: {
      name: sender,
      address: senderEmail,
    },
    to: receiverEmail,
    subject: subject,
    text: email,
    html: `<html>
              <body>
                <h5>From: ${senderEmail}</h5>
                <p>${email}</p>
                <br />
                <h5>Powered By Echo</h5>
              </body>
            </html>`,
  });
  console.log(`Sender: ${senderEmail}, Receiver: ${receiverEmail}`);
  console.log("Message sent: %s", info.messageId);

  res.json(info);
};

export default sendEmail;