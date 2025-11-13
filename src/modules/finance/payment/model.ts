import { t } from "elysia";

export const createPaymentBody = t.Object({
  donationId: t.String(),
  orderId: t.String(),
  statusId: t.String(),
  provider: t.String(),
  amount: t.Number(),
  paidAt: t.Date(),
});

export type CreatePaymentBody = typeof createPaymentBody.static;

export const listPaymentQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listPaymentQuery = typeof listPaymentQuery.static;

export const updatePaymentBody = t.Object({
  donationId: t.Optional(t.String()),
  orderId: t.Optional(t.String()),
  statusId: t.Optional(t.String()),
  provider: t.Optional(t.String()),
  amount: t.Optional(t.Number()),
  paidAt: t.Optional(t.Date()),
});

export type UpdatePaymentBody = typeof updatePaymentBody.static;
