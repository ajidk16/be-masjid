import { and, count, eq, ilike, or } from "drizzle-orm";
import { listNewQuery } from "./model";
import { db } from "../../../db/client";
import { news } from "../../../db/schema";

export const createNew = async (
  mosqueId: string,
  title: string,
  content: string,
  isPublished: boolean,
  coverUrl?: string
) => {
  const [newNew] = await db
    .insert(news)
    .values({
      mosqueId,
      title,
      content,
      isPublished,
      publishedAt: new Date(),
      coverUrl,
    })
    .returning();

  return newNew;
};

export const listNews = async ({
  page = 1,
  limit = 10,
  search,
}: listNewQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(news.title, searchTerm),
      ilike(news.content, searchTerm)
    );
  }

  const newList = await db.query.news.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(news)).at(0)?.count ?? 0;

  return { newList, total };
};

export const updateNew = async (
  newId: string,
  mosqueId?: string,
  title?: string,
  content?: string,
  isPublished?: boolean,
  coverUrl?: string
) => {
  const [updatedNew] = await db
    .update(news)
    .set({
      mosqueId,
      title,
      content,
      isPublished,
      coverUrl,
    })
    .where(and(eq(news.id, newId)))
    .returning();

  return updatedNew;
};

export const getNewById = async (newId: string) => {
  const newsItem = await db.query.news.findFirst({
    where: eq(news?.id, newId),
  });

  return newsItem;
};

export const deleteNew = async (newId: string) => {
  const [deletedNew] = await db
    .delete(news)
    .where(eq(news.id, newId))
    .returning();
  return deletedNew;
};
