import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: true,
  },
});

export const sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!to) throw new Error("Recipient email (to) is required.");
    if (!subject) throw new Error("Email subject is required.");
    if (!text && !html)
      throw new Error("Either text or html content must be provided.");

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    };

    transporter
      .verify()
      .then(() => console.log("SMTP ready"))
      .catch(console.error);

    const info = await transporter.sendMail(mailOptions);

    if (info.rejected && info.rejected.length > 0) {
      throw new Error(`Email rejected: ${info.rejected.join(", ")}`);
    }

    console.log(`✅ Mail sent to ${to}: ${info.messageId}`);
    return info;
  } catch (err) {
    console.error("❌ Mail send error:", err.message);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};
