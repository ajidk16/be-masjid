import { t } from "elysia";

export const createRoleBody = t.Object({
  code: t.String(),
  label: t.String(),
  description: t.Optional(t.String()),
});

export type CreateRoleBody = typeof createRoleBody.static;

export const listRoleQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listRoleQuery = typeof listRoleQuery.static;

export const updateRoleBody = t.Object({
  code: t.Optional(t.String()),
  label: t.Optional(t.String()),
  description: t.Optional(t.String()),
});

export type UpdateRoleBody = typeof updateRoleBody.static;
