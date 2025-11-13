import { t } from "elysia";

export const createNewBody = t.Object({
  mosqueId: t.String({ format: "uuid" }),
  title: t.String({ maxLength: 160 }),
  content: t.String(),
  isPublished: t.BooleanString({ default: true }),
  coverUrl: t.Optional(
    t.File({
      type: "image/*", // hanya terima image
      maxSize: 5 * 1024 * 1024, // max 5MB
      error: "Cover harus berupa gambar (max 5MB)",
    })
  ),
});

export type CreateNewBody = typeof createNewBody.static;

export const listNewQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listNewQuery = typeof listNewQuery.static;

export const updateNewBody = t.Object({
  mosqueId: t.Optional(t.String()),
  title: t.Optional(t.String()),
  content: t.Optional(t.String()),
  isPublished: t.Optional(t.BooleanString()),
  coverUrl: t.Optional(t.File({
    type: "image/*", // hanya terima image
    maxSize: 5 * 1024 * 1024, // max 5MB
    error: "Cover harus berupa gambar (max 5MB)",
  })),
});

export type UpdateNewBody = typeof updateNewBody.static;
