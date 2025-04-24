const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = async (req, res) => {
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

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_TO,
      subject: `New message from ${name}`,
      text: message,
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
