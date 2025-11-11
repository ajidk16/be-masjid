import { t } from "elysia";

export const createMosqueBody = t.Object({
  slug: t.String(),
  name: t.String(),
  address: t.Optional(t.String()),
  city: t.Optional(t.String()),
  province: t.Optional(t.String()),
});

export type CreateMosqueBody = typeof createMosqueBody.static;

export const listMosquesQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listMosquesQuery = typeof listMosquesQuery.static;

export const updateMosqueBody = t.Object({
  name: t.Optional(t.String()),
  address: t.Optional(t.String()),
  city: t.Optional(t.String()),
  province: t.Optional(t.String()),
  lat: t.Optional(t.String()),
  lng: t.Optional(t.String()),
});

export type UpdateMosqueBody = typeof updateMosqueBody.static;
