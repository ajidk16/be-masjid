import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  numeric,
  integer,
  timestamp,
} from "drizzle-orm/pg-core";
import { mosques, users } from "./core-tables";
import { refHalalStatuses, refOrderStatuses } from "./ref-tables";

export const vendors = pgTable("vendors", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id").references(() => mosques.id),
  ownerUserId: uuid("owner_user_id").references(() => users.id),
  halalStatusId: uuid("halal_status_id").references(() => refHalalStatuses.id),
  name: varchar("name", { length: 160 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
});

export const halalCertificates = pgTable("halal_certificates", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").references(() => vendors.id, {
    onDelete: "cascade",
  }),
  productId: uuid("product_id"), // opsional: sertifikat per-produk
  certificateNo: varchar("certificate_no", { length: 120 }).notNull(),
  issuer: varchar("issuer", { length: 160 }).notNull(), // MUI/LPH
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  documentUrl: text("document_url"),
});

export const productCategories = pgTable("product_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 120 }).notNull(),
  slug: varchar("slug", { length: 120 }).notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  vendorId: uuid("vendor_id").references(() => vendors.id),
  halalStatusId: uuid("halal_status_id").references(() => refHalalStatuses.id),
  name: varchar("name", { length: 160 }).notNull(),
  price: numeric("price", { precision: 18, scale: 2 }).notNull(),
  stock: integer("stock").default(0),
});

export const productImages = pgTable("product_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  buyerUserId: uuid("buyer_user_id").references(() => users.id),
  statusId: uuid("status_id").references(() => refOrderStatuses.id),
  subtotal: numeric("subtotal", { precision: 18, scale: 2 }).notNull(),
  shippingCost: numeric("shipping_cost", { precision: 18, scale: 2 }).default(
    "0"
  ),
  total: numeric("total", { precision: 18, scale: 2 }).notNull(),
  shippingAddress: text("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  vendorId: uuid("vendor_id")
    .notNull()
    .references(() => vendors.id),
  name: varchar("name", { length: 160 }).notNull(),
  qty: integer("qty").notNull(),
  price: numeric("price", { precision: 18, scale: 2 }).notNull(),
  lineTotal: numeric("line_total", { precision: 18, scale: 2 }).notNull(),
});
