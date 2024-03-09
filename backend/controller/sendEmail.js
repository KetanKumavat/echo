import nodemailer from "nodemailer";

const sendEmail = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  let transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "ketan.kumavat1984@gmail.com",
      pass: "jnor ucli hexi ecal",
    },
  });
  let info = await transporter.sendMail({
    from: {
        name: "Ketan Kumavat",
        address: "ketan.kumavat1984@gmail.com"
    },
    to: "evangeline.mariadurai@gmail.com",
    subject: "Hiii Evuuuuu",
    text: "I ma sending this email from my backend server.",
    html: "<b>I ma sending this email from my backend server.</b>. <br> <h1>Yayyy!!! it finally worked</h1>",
  });

  console.log("Message sent: %s", info.messageId);

  res.json(info);
};

export default sendEmail;