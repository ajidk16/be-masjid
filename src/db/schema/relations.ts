import { relations } from "drizzle-orm";
import { mosques, users, members } from "./core-tables";
import {
  refRoles,
  refDonationTypes,
  refPaymentStatuses,
  refOrderStatuses,
  refHalalStatuses,
} from "./ref-tables";
import { campaigns, fundAccounts, payments } from "./finance-tables";
import {
  vendors,
  orders,
  products,
  halalCertificates,
} from "./marketplace-tables";
import { events, mediaPhotos, news } from "./beranda";

export const membersRelations = relations(members, ({ one }) => ({
  mosque: one(mosques, {
    fields: [members.mosqueId],
    references: [mosques.id],
  }),
  user: one(users, { fields: [members.userId], references: [users.id] }),
  role: one(refRoles, { fields: [members.roleId], references: [refRoles.id] }),
}));

export const fundAccountsRelations = relations(fundAccounts, ({ one }) => ({
  donationType: one(refDonationTypes, {
    fields: [fundAccounts.donationTypeId],
    references: [refDonationTypes.id],
  }),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  halalStatus: one(refHalalStatuses, {
    fields: [vendors.halalStatusId],
    references: [refHalalStatuses.id],
  }),
  products: many(products),
  certs: many(halalCertificates),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  status: one(refOrderStatuses, {
    fields: [orders.statusId],
    references: [refOrderStatuses.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  status: one(refPaymentStatuses, {
    fields: [payments.statusId],
    references: [refPaymentStatuses.id],
  }),
}));

export const mosquesRelations = relations(mosques, ({ many }) => ({
  members: many(members),
  events: many(events),
  news: many(news),
  photos: many(mediaPhotos),
  fundAccounts: many(fundAccounts),
  campaigns: many(campaigns),
}));

export const usersRelations = relations(users, ({ one }) => ({
  members: one(members, {
    fields: [users.id],
    references: [members.userId],
  }),
}));
