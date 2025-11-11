import { t } from "elysia";

export const createPaymentStatusBody = t.Object({
  code: t.String(),
  label: t.String(),
});

export type CreatePaymentStatusBody = typeof createPaymentStatusBody.static;

export const listPaymentStatussQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listPaymentStatussQuery = typeof listPaymentStatussQuery.static;

export const updatePaymentStatusBody = t.Object({
  code: t.Optional(t.String()),
  label: t.Optional(t.String()),
});

export type UpdatePaymentStatusBody = typeof updatePaymentStatusBody.static;
