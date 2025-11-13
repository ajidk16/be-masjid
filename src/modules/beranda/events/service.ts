import { and, count, eq, ilike, or } from "drizzle-orm";
import { listEventQuery } from "./model";
import { events } from "../../../db/schema/beranda";
import { db } from "../../../db/client";

export const createEvent = async (
  mosqueId: string,
  title: string,
  startAt: Date,
  speaker?: string,
  endAt?: Date,
  location?: string,
  description?: string,
  isPublished?: boolean
) => {
  const [newEvent] = await db
    .insert(events)
    .values({
      mosqueId,
      title,
      startAt,
      speaker,
      endAt,
      location,
      description,
      isPublished,
    })
    .returning();

  return newEvent;
};

export const listEvents = async ({
  page = 1,
  limit = 10,
  search,
}: listEventQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(events.title, searchTerm),
      ilike(events.speaker, searchTerm),
      ilike(events.location, searchTerm),
      ilike(events.description, searchTerm)
    );
  }

  const eventList = await db.query.events.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(events)).at(0)?.count ?? 0;

  return { eventList, total };
};

export const updateEvent = async (
  eventId: string,
  mosqueId?: string,
  title?: string,
  speaker?: string,
  startAt?: Date,
  endAt?: Date,
  location?: string,
  description?: string,
  isPublished?: boolean
) => {
  const [updatedEvent] = await db
    .update(events)
    .set({
      mosqueId,
      title,
      speaker,
      startAt,
      endAt,
      location,
      description,
      isPublished,
    })
    .where(and(eq(events.id, eventId)))
    .returning();

  return updatedEvent;
};

export const getEventById = async (eventId: string) => {
  const event = await db.query.events.findFirst({
    where: eq(events.id, eventId),
  });
  return event;
};

export const deleteEvent = async (eventId: string) => {
  const [deletedEvent] = await db
    .delete(events)
    .where(eq(events.id, eventId))
    .returning();
  return deletedEvent;
};
