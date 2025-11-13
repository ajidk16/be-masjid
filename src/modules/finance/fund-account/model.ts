import { t } from "elysia";

export const createFundAccountBody = t.Object({
  mosqueId: t.String(),
  donationTypeId: t.String(),
  code: t.String(),
  name: t.String(),
  isActive: t.BooleanString({ default: true }),
});

export type CreateFundAccountBody = typeof createFundAccountBody.static;

export const listFundAccountQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listFundAccountQuery = typeof listFundAccountQuery.static;

export const updateFundAccountBody = t.Object({
  mosqueId: t.Optional(t.String()),
  donationTypeId: t.Optional(t.String()),
  code: t.Optional(t.String()),
  name: t.Optional(t.String()),
  isActive: t.Optional(t.BooleanString()),
});

export type UpdateFundAccountBody = typeof updateFundAccountBody.static;
