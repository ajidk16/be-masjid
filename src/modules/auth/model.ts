import { t } from "elysia";

export const CreateMemberBody = t.Object({
  fullName: t.String(),
  email: t.String({ format: "email" }),
  phone: t.Optional(t.String()),
  password: t.String(),
});
export type CreateMemberBody = typeof CreateMemberBody.static;

export const SignInBody = t.Object({
  email: t.String({ format: "email" }),
  password: t.String(),
});
export type SignInBody = typeof SignInBody.static;

export const resetPasswordBody = t.Object({
  token: t.String(),
  newPassword: t.String({ minLength: 6 }),
});

export const InviteMemberBody = t.Object({
  token: t.String(),
  mosqueId: t.String({ format: "uuid" }),
  email: t.String({ format: "email" }),
  roleId: t.Optional(t.String({ format: "uuid" })),
});

export type InviteMemberBody = typeof InviteMemberBody.static;
