import { t } from "elysia";

export const createPermissionBody = t.Object({
  moduleId: t.String(),
  roleId: t.String(),
});

export type CreatePermissionBody = typeof createPermissionBody.static;

export const listPermissionQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listPermissionQuery = typeof listPermissionQuery.static;

export const updatePermissionBody = t.Object({
  moduleId: t.Optional(t.String()),
  roleId: t.Optional(t.String()),
  canRead: t.Optional(t.BooleanString()),
  canCreate: t.Optional(t.BooleanString()),
  canUpdate: t.Optional(t.BooleanString()),
  canDelete: t.Optional(t.BooleanString()),
  canManage: t.Optional(t.BooleanString()),
});

export type UpdatePermissionBody = typeof updatePermissionBody.static;
