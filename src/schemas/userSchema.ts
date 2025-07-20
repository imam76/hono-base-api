/** @notice library imports */
import { boolean, pgTable, uuid, text } from "drizzle-orm/pg-core";

/// Core users table
export const users = pgTable("users", {
  id: uuid(),
  first_name: text(),
  last_name: text(),
  full_name: text(),
  email: text(),
  phone: text(),
  address: text(),
  city: text(),
  state: text(),
  zip: text(),
  country: text(),
  created_at: text(),
  updated_at: text(),
  is_active: boolean().default(true),
  is_verified: boolean().default(false),
  password: text(),
});
