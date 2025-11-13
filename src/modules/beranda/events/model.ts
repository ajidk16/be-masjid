import { t } from "elysia";

export const createEventBody = t.Object({
  mosqueId: t.String({ format: "uuid" }),
  title: t.String({ maxLength: 160 }),
  startAt: t.Date(),
  speaker: t.Optional(t.String({ maxLength: 160 })),
  endAt: t.Optional(t.Date()),
  location: t.Optional(t.String({ maxLength: 160 })),
  description: t.Optional(t.String()),
  isPublished: t.Optional(t.BooleanString({ default: true })),
});

export type CreateEventBody = typeof createEventBody.static;

export const listEventQuery = t.Object({
  page: t.Optional(t.Number({ default: 1 })),
  limit: t.Optional(t.Number({ default: 10 })),
  search: t.Optional(t.String({ default: "" })),
});

export type listEventQuery = typeof listEventQuery.static;

export const updateEventBody = t.Object({
  mosqueId: t.Optional(t.String()),
  title: t.Optional(t.String()),
  speaker: t.Optional(t.String()),
  startAt: t.Optional(t.Date()),
  endAt: t.Optional(t.Date()),
  location: t.Optional(t.String()),
  description: t.Optional(t.String()),
  isPublished: t.Optional(t.BooleanString()),
});

export type UpdateEventBody = typeof updateEventBody.static;
