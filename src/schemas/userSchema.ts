/** @notice library imports */
import { boolean, pgTable, uuid, text, timestamp, varchar } from "drizzle-orm/pg-core";

/// Core users table
export const users = pgTable("users", {
  id: uuid().primaryKey().unique().defaultRandom(),
  first_name: varchar("first_name", { length: 25 }),
  last_name: varchar("last_name", { length: 25 }),
  full_name: text(),
  email: varchar("email", { length: 50 }).unique(),
  phone: varchar("phone", { length: 15 }).unique(),
  address: text(),
  city: varchar("city", { length: 50 }),
  state: varchar("state", { length: 50 }),
  zip: varchar("zip", { length: 10 }),
  country: varchar("country", { length: 20 }),
  password: text(),
  is_active: boolean().default(true),
  is_verified: boolean().default(false),
  last_login: timestamp().defaultNow(),
  last_login_ip: text().default(""),
  created_at: timestamp().notNull().defaultNow(),
  updated_at: timestamp().notNull().defaultNow(),
});


export type Users = typeof users.$inferSelect;