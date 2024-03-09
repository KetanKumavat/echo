import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
const sendEmail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

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
        name: "Ketan Kumavat",
        address: "ketan.kumavat1984@gmail.com"
    },
    to: "evangeline.mariadurai@gmail.com",
    subject: "Hiii Evuuuuu 2nd time",
    text: "I am sending this email from my backend server.",
    html: "<b>I am sending this email from my backend server for the 2nd time ik </b>.",
  });

  console.log("Message sent: %s", info.messageId);

  res.json(info);
};

export default sendEmail;