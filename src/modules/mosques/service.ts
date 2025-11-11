import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../db/client";
import { mosques } from "../../db/schema";
import { listMosquesQuery } from "./model";

export const createMosque = async (
  slug: string,
  name: string,
  address?: string,
  city?: string,
  province?: string,
  lat?: string,
  lng?: string
) => {
  const [newMosque] = await db
    .insert(mosques)
    .values({
      slug: slug,
      name: name,
      address: address ? address : null,
      city: city ? city : null,
      province: province ? province : null,
      lat: lat ? lat : null,
      lng: lng ? lng : null,
    })
    .returning();

  return newMosque;
};

export const listMosques = async ({
  page = 1,
  limit = 10,
  search,
}: listMosquesQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(mosques.name, searchTerm),
      ilike(mosques.address, searchTerm),
      ilike(mosques.city, searchTerm),
      ilike(mosques.province, searchTerm)
    );
  }

  const mosqueList = await db.query.mosques.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(mosques)).at(0)?.count ?? 0;

  return { mosqueList, total };
};

export const updateMosque = async (
  mosqueId: string,
  name?: string,
  address?: string,
  city?: string,
  province?: string,
  lat?: string,
  lng?: string
) => {
  const [updatedMosque] = await db
    .update(mosques)
    .set({
      name: name,
      address: address,
      city: city,
      province: province,
      lat: lat,
      lng: lng,
    })
    .where(and(eq(mosques.id, mosqueId)))
    .returning();

  return updatedMosque;
};

export const getMosqueById = async (mosqueId: string) => {
  const mosque = await db.query.mosques.findFirst({
    where: eq(mosques.id, mosqueId),
  });
  return mosque;
};

export const deleteMosque = async (mosqueId: string) => {
  const [deletedMosque] = await db
    .delete(mosques)
    .where(eq(mosques.id, mosqueId))
    .returning();
  return deletedMosque;
};
