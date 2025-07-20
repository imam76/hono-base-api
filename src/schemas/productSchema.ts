/** @notice library imports */
import {
  boolean,
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./userSchema";

/// Core products table
export const products = pgTable("products", {
  id: uuid().primaryKey().unique(),
  name: text(),
  code: text().unique(),
  description: text(),
  unit_price: numeric("unit_price", { precision: 18, scale: 2 }),
  is_active: boolean().default(true),
  created_at: timestamp().notNull().defaultNow(),
  created_by: uuid("created_by")
    .notNull()
    .references(() => users.id),
  updated_at: timestamp().notNull().defaultNow(),
  updated_by: uuid("updated_by")
    .notNull()
    .references(() => users.id),
});
