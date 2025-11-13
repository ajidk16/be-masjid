import { t } from "elysia";

export const createMediaPhotoBody = t.Object({
  mosqueId: t.String({ format: "uuid" }),
  photos: t.File({
    type: "image/*",
    maxCount: 10,
    minCount: 1,
    maxSize: 5 * 1024 * 1024, // 5 MB
    required: true,
    error:
      "Please upload between 1 to 10 images, each not exceeding 5 MB in size.",
  }),
});

export type CreateMediaPhotoBody = typeof createMediaPhotoBody.static;

export const listMediaPhotoQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listMediaPhotoQuery = typeof listMediaPhotoQuery.static;

export const updateMediaPhotoBody = t.Object({
  mosqueId: t.Optional(t.String()),
  photos: t.Optional(
    t.File({
      type: "image/*",
      maxCount: 10,
      maxSize: 5 * 1024 * 1024, // 5 MB
      error: "Please upload up to 10 images, each not exceeding 5 MB in size.",
    })
  ),
});

export type UpdateMediaPhotoBody = typeof updateMediaPhotoBody.static;
