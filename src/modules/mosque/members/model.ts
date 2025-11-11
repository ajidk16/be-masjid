import { t } from "elysia";

export const ListMemberQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String()),
});

export type ListMemberQuery = typeof ListMemberQuery.static;

export const CreateMemberBody = t.Object({
  mosqueId: t.String(),
  userId: t.String(),
  roleId: t.String(),
  fullName: t.String(),
  isActive: t.BooleanString({ default: true }),
});

export type CreateMemberBody = typeof CreateMemberBody.static;

export const UpdateMemberBody = t.Object({
  mosqueId: t.Optional(t.String()),
  userId: t.Optional(t.String()),
  roleId: t.Optional(t.String()),
  fullName: t.Optional(t.String()),
  isActive: t.Optional(t.BooleanString()),
});

export type UpdateMemberBody = typeof UpdateMemberBody.static;