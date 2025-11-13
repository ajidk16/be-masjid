import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";
import { members, mosques, users } from "./core-tables";
import { refDonationTypes, refPaymentStatuses } from "./ref-tables";

// rekening dana
export const fundAccounts = pgTable("fund_accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id").references(() => mosques.id),
  donationTypeId: uuid("donation_type_id").references(
    () => refDonationTypes.id
  ),
  code: varchar("code", { length: 40 }).unique().notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  isActive: boolean("is_active").default(true),
});

// Kampanye penggalangan dana
export const campaigns = pgTable("campaigns", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  fundAccountId: uuid("fund_account_id").references(() => fundAccounts.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 160 }).notNull(),
  targetAmount: numeric("target_amount", { precision: 18, scale: 2 }),
  startAt: timestamp("start_at"),
  endAt: timestamp("end_at"),
  isPublished: boolean("is_published").default(true).notNull(),
  coverUrl: text("cover_url"),
});

export const donations = pgTable("donations", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id").references(() => mosques.id),
  fundAccountId: uuid("fund_account_id").references(() => fundAccounts.id),
  donorUserId: uuid("donor_user_id").references(() => users.id),
  donationTypeId: uuid("donation_type_id").references(
    () => refDonationTypes.id
  ),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  donationId: uuid("donation_id").references(() => donations.id, {
    onDelete: "cascade",
  }),
  orderId: uuid("order_id"),
  statusId: uuid("status_id").references(() => refPaymentStatuses.id),
  provider: varchar("provider", { length: 64 }),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  paidAt: timestamp("paid_at"),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").primaryKey().defaultRandom(),
  mosqueId: uuid("mosque_id")
    .notNull()
    .references(() => mosques.id, { onDelete: "cascade" }),
  fundAccountId: uuid("fund_account_id").references(() => fundAccounts.id, {
    onDelete: "set null",
  }),
  title: varchar("title", { length: 160 }).notNull(),
  amount: numeric("amount", { precision: 18, scale: 2 }).notNull(),
  spenderMemberId: uuid("spender_member_id").references(() => members.id),
  proofUrl: text("proof_url"),
  spentAt: timestamp("spent_at").defaultNow().notNull(),
  note: text("note"),
});
