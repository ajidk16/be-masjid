import { pgTable, boolean, uuid, varchar, text } from "drizzle-orm/pg-core";

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

export const refModules = pgTable("ref_modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 40 }).unique().notNull(),
});

export const refPermissions = pgTable("ref_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id").references(() => refModules.id, {
    onDelete: "cascade",
  }),
  roleId: uuid("role_id").references(() => refRoles.id, {
    onDelete: "cascade",
  }),
  canRead: boolean("can_read").default(false),
  canCreate: boolean("can_create").default(false),
  canUpdate: boolean("can_update").default(false),
  canDelete: boolean("can_delete").default(false),
  canManage: boolean("can_manage").default(false),
});
