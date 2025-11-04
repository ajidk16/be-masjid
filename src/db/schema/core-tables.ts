import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { refRoles } from "./ref-tables";

// Tabel mosques dan users
export const mosques = pgTable("mosques", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  address: text("address"),
  city: varchar("city", { length: 80 }),
  province: varchar("province", { length: 80 }),
  lat: numeric("lat", { precision: 10, scale: 6 }),
  lng: numeric("lng", { precision: 10, scale: 6 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 160 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).unique(),
  passwordHash: text("password_hash").notNull(),
  verifiedEmail: boolean("verified_email").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const members = pgTable("members", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id").references(() => mosques.id, {
    onDelete: "cascade",
  }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  roleId: uuid("role_id").references(() => refRoles.id),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});
