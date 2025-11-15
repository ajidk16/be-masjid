import { t } from "elysia";

export const createModuleBody = t.Object({
  name: t.String(),
});

export type CreateModuleBody = typeof createModuleBody.static;

export const listModuleQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listModuleQuery = typeof listModuleQuery.static;

export const updateModuleBody = t.Object({
  name: t.Optional(t.String()),
});

export type UpdateModuleBody = typeof updateModuleBody.static;
