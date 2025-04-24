const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://pri-lla.vercel.app");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Structuring the email like a traditional email
    const mailOptions = {
      from: email, // This is the sender's email
      to: process.env.EMAIL_TO, // This is your email where you want to receive the message
      subject: `New message from ${name}`, // This is the subject of the email
      text: `
        From: ${name} <${email}>
        To: ${process.env.EMAIL_TO}
        Subject: ${mailOptions.subject}

        Message:
        ${message}
      `, // Traditional format
    };

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send message." });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};
