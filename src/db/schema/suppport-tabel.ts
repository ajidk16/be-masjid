import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { mosques, users } from "./core-tables";
import { refRoles } from "./ref-tables";

// Token verifikasi email
export const emailVerifications = pgTable("email_verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 400 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
});

// Reset password
export const passwordResets = pgTable("password_resets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 400 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
});

// Undangan gabung masjid
export const invites = pgTable("invites", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id").references(() => mosques.id, {
    onDelete: "cascade",
  }),
  email: varchar("email", { length: 400 }).notNull(),
  roleId: uuid("role_id").references(() => refRoles.id),
  token: varchar("token", { length: 400 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  acceptedAt: timestamp("accepted_at"),
});

// Kode join publik (opsional)
export const mosqueJoinCodes = pgTable("mosque_join_codes", {
  mosqueId: uuid("mosque_id")
    .primaryKey()
    .references(() => mosques.id, { onDelete: "cascade" }),
  code: varchar("code", { length: 32 }).notNull().unique(),
  roleId: uuid("role_id").references(() => refRoles.id), // default role saat join
  isActive: boolean("is_active").default(true).notNull(),
});
