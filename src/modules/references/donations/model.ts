import { t } from "elysia";

export const createDonationBody = t.Object({
  code: t.String(),
  label: t.String(),
  description: t.Optional(t.String()),
});

export type CreateDonationBody = typeof createDonationBody.static;

export const listDonationQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listDonationQuery = typeof listDonationQuery.static;

export const updateDonationBody = t.Object({
  code: t.Optional(t.String()),
  label: t.Optional(t.String()),
  description: t.Optional(t.String()),
});

export type UpdateDonationBody = typeof updateDonationBody.static;
