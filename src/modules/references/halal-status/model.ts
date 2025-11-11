import { t } from "elysia";

export const createHalalStatusBody = t.Object({
  code: t.String(),
  label: t.String(),
});

export type CreateHalalStatusBody = typeof createHalalStatusBody.static;

export const listHalalStatussQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listHalalStatussQuery = typeof listHalalStatussQuery.static;

export const updateHalalStatusBody = t.Object({
  code: t.Optional(t.String()),
  label: t.Optional(t.String()),
});

export type UpdateHalalStatusBody = typeof updateHalalStatusBody.static;
