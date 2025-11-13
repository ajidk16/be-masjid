import { t } from "elysia";

export const createDonationBody = t.Object({
  mosqueId: t.String(),
  fundAccountId: t.String(),
  donorUserId: t.String(),
  donationTypeId: t.String(),
  amount: t.Number(),
  note: t.Optional(t.String()),
});

export type CreateDonationBody = typeof createDonationBody.static;

export const listDonationQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listDonationQuery = typeof listDonationQuery.static;

export const updateDonationBody = t.Object({
  mosqueId: t.Optional(t.String()),
  fundAccountId: t.Optional(t.String()),
  donorUserId: t.Optional(t.String()),
  donationTypeId: t.Optional(t.String()),
  amount: t.Optional(t.Number()),
  note: t.Optional(t.String()),
});

export type UpdateDonationBody = typeof updateDonationBody.static;
