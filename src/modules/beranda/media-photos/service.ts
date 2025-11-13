import { and, count, eq, ilike, or } from "drizzle-orm";
import { listMediaPhotoQuery } from "./model";
import { db } from "../../../db/client";
import { mediaPhotos } from "../../../db/schema";

export const createMediaPhoto = async (
  mosqueId: string,
  title: string,
  url: string,
  takenAt?: Date
) => {
  const [newMediaPhoto] = await db
    .insert(mediaPhotos)
    .values({
      mosqueId,
      title,
      url,
      takenAt,
    })
    .returning();

  return newMediaPhoto;
};

export const listMediaPhotos = async ({
  page = 1,
  limit = 10,
  search,
}: listMediaPhotoQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(mediaPhotos.title, searchTerm),
      ilike(mediaPhotos.url, searchTerm)
    );
  }

  const eventList = await db.query.mediaPhotos.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(mediaPhotos)).at(0)?.count ?? 0;

  return { eventList, total };
};

export const updateMediaPhoto = async (
  eventId: string,
  mosqueId?: string,
  title?: string,
  url?: string,
  takenAt?: Date
) => {
  const [updatedMediaPhoto] = await db
    .update(mediaPhotos)
    .set({
      mosqueId,
      title,
      url,
      takenAt,
    })
    .where(and(eq(mediaPhotos.id, eventId)))
    .returning();

  return updatedMediaPhoto;
};

export const getMediaPhotoById = async (eventId: string) => {
  const event = await db.query.mediaPhotos.findFirst({
    where: eq(mediaPhotos.id, eventId),
  });
  return event;
};

export const deleteMediaPhoto = async (eventId: string) => {
  const [deletedMediaPhoto] = await db
    .delete(mediaPhotos)
    .where(eq(mediaPhotos.id, eventId))
    .returning();
  return deletedMediaPhoto;
};
