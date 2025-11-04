import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";

// Role pengguna dalam ekosistem masjid
export const refRoles = pgTable("ref_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).unique().notNull(),
  label: varchar("label", { length: 120 }).notNull(),
  description: text("description"),
});

// Jenis donasi syariah
export const refDonationTypes = pgTable("ref_donation_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).unique().notNull(),
  label: varchar("label", { length: 120 }).notNull(),
  description: text("description"),
});

// Status pembayaran (donasi/marketplace)
export const refPaymentStatuses = pgTable("ref_payment_statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).unique().notNull(),
  label: varchar("label", { length: 120 }).notNull(),
});

// Status pesanan marketplace
export const refOrderStatuses = pgTable("ref_order_statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).unique().notNull(),
  label: varchar("label", { length: 120 }).notNull(),
});

// Status halal produk/vendor
export const refHalalStatuses = pgTable("ref_halal_statuses", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 40 }).unique().notNull(),
  label: varchar("label", { length: 120 }).notNull(),
});
