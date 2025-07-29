import { type User, type InsertUser, type Submission, type InsertSubmission, type AdminSession, type InsertAdminSession } from "@shared/schema";
import { randomUUID } from "crypto";

// Extended interface with admin and submission methods
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Submission methods
  createSubmission(submission: InsertSubmission): Promise<Submission>;
  getSubmissions(limit?: number, offset?: number): Promise<Submission[]>;
  getSubmissionById(id: string): Promise<Submission | undefined>;
  getSubmissionStats(): Promise<{
    total: number;
    byWallet: Record<string, number>;
    byCategory: Record<string, number>;
    byMethod: Record<string, number>;
    recent: number; // last 24 hours
  }>;
  
  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getAdminSession(sessionToken: string): Promise<AdminSession | undefined>;
  deleteAdminSession(sessionToken: string): Promise<void>;
  cleanExpiredSessions(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private submissions: Map<string, Submission>;
  private adminSessions: Map<string, AdminSession>;

  constructor() {
    this.users = new Map();
    this.submissions = new Map();
    this.adminSessions = new Map();
    
    // Create default admin user
    this.createDefaultAdmin();
  }

  private async createDefaultAdmin() {
    const adminExists = Array.from(this.users.values()).some(user => user.isAdmin);
    if (!adminExists) {
      const adminUser: User = {
        id: randomUUID(),
        username: 'admin',
        password: 'admin123', // In production, this should be hashed
        isAdmin: true,
        createdAt: new Date(),
      };
      this.users.set(adminUser.id, adminUser);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      isAdmin: insertUser.isAdmin || false,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, ...updates };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Submission methods
  async createSubmission(insertSubmission: InsertSubmission): Promise<Submission> {
    const id = randomUUID();
    const submission: Submission = {
      ...insertSubmission,
      id,
      timestamp: new Date(),
      status: 'pending',
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmissions(limit = 100, offset = 0): Promise<Submission[]> {
    const allSubmissions = Array.from(this.submissions.values());
    const sorted = allSubmissions.sort((a, b) => 
      new Date(b.timestamp!).getTime() - new Date(a.timestamp!).getTime()
    );
    return sorted.slice(offset, offset + limit);
  }

  async getSubmissionById(id: string): Promise<Submission | undefined> {
    return this.submissions.get(id);
  }

  async getSubmissionStats(): Promise<{
    total: number;
    byWallet: Record<string, number>;
    byCategory: Record<string, number>;
    byMethod: Record<string, number>;
    recent: number;
  }> {
    const allSubmissions = Array.from(this.submissions.values());
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const stats = {
      total: allSubmissions.length,
      byWallet: {} as Record<string, number>,
      byCategory: {} as Record<string, number>,
      byMethod: {} as Record<string, number>,
      recent: 0,
    };

    allSubmissions.forEach(submission => {
      // Count by wallet
      stats.byWallet[submission.wallet] = (stats.byWallet[submission.wallet] || 0) + 1;
      
      // Count by category
      if (submission.category) {
        stats.byCategory[submission.category] = (stats.byCategory[submission.category] || 0) + 1;
      }
      
      // Count by method
      stats.byMethod[submission.method] = (stats.byMethod[submission.method] || 0) + 1;
      
      // Count recent
      if (submission.timestamp && new Date(submission.timestamp) > oneDayAgo) {
        stats.recent++;
      }
    });

    return stats;
  }

  // Admin session methods
  async createAdminSession(insertSession: InsertAdminSession): Promise<AdminSession> {
    const id = randomUUID();
    const session: AdminSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.adminSessions.set(session.sessionToken, session);
    return session;
  }

  async getAdminSession(sessionToken: string): Promise<AdminSession | undefined> {
    const session = this.adminSessions.get(sessionToken);
    if (session && new Date() < new Date(session.expiresAt)) {
      return session;
    }
    // Remove expired session
    if (session) {
      this.adminSessions.delete(sessionToken);
    }
    return undefined;
  }

  async deleteAdminSession(sessionToken: string): Promise<void> {
    this.adminSessions.delete(sessionToken);
  }

  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    for (const [token, session] of this.adminSessions.entries()) {
      if (new Date(session.expiresAt) < now) {
        this.adminSessions.delete(token);
      }
    }
  }
}

export const storage = new MemStorage();
