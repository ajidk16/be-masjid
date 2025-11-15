import { t } from "elysia";

export const createExpenseBody = t.Object({
  mosqueId: t.String(),
  fundAccountId: t.Optional(t.String()),
  title: t.String({ maxLength: 160 }),
  amount: t.Number(),
  spenderMemberId: t.Optional(t.String()),
  proofUrl: t.Optional(t.String()),
  spentAt: t.Date(),
  note: t.Optional(t.String()),
});

export type CreateExpenseBody = typeof createExpenseBody.static;

export const listExpenseQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listExpenseQuery = typeof listExpenseQuery.static;

export const updateExpenseBody = t.Object({
  mosqueId: t.Optional(t.String()),
  fundAccountId: t.Optional(t.String()),
  title: t.Optional(t.String({ maxLength: 160 })),
  amount: t.Optional(t.Number()),
  spenderMemberId: t.Optional(t.String()),
  proofUrl: t.Optional(t.String()),
  spentAt: t.Optional(t.Date()),
  note: t.Optional(t.String()),
});

export type UpdateExpenseBody = typeof updateExpenseBody.static;
