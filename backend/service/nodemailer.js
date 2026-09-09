const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail({ to, subject, text, html }) {
  const mailInfo = await transporter.sendMail({
    from: `${process.env.EMAIL_USER}`,
    to,
    subject,
    text,
    html,
  });

  console.log("message sent:", mailInfo.messageId);
}

module.exports = sendMail;