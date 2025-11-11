import { t } from "elysia";

export const createOrderStatusBody = t.Object({
  code: t.String(),
  label: t.String(),
});

export type CreateOrderStatusBody = typeof createOrderStatusBody.static;

export const listOrderStatusQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listOrderStatusQuery = typeof listOrderStatusQuery.static;

export const UpdateOrderStatusBody = t.Object({
  code: t.Optional(t.String()),
  label: t.Optional(t.String()),
});

export type UpdateOrderStatusBody = typeof UpdateOrderStatusBody.static;
