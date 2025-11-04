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
