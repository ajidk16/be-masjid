import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { refHalalStatuses } from "../../../db/schema";
import { listHalalStatussQuery } from "./model";

export const createHalalStatus = async (code: string, label: string) => {
  const [newHalalStatus] = await db
    .insert(refHalalStatuses)
    .values({
      code,
      label,
    })
    .returning();

  return newHalalStatus;
};

export const listHalalStatus = async ({
  page = 1,
  limit = 10,
  search,
}: listHalalStatussQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(refHalalStatuses.code, searchTerm),
      ilike(refHalalStatuses.label, searchTerm)
    );
  }

  const halalStatusList = await db.query.refHalalStatuses.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(refHalalStatuses)).at(0)?.count ??
    0;

  return { halalStatusList, total };
};

export const updateHalalStatus = async (
  halalStatusId: string,
  code?: string,
  label?: string
) => {
  const [updatedHalalStatus] = await db
    .update(refHalalStatuses)
    .set({
      code,
      label,
    })
    .where(and(eq(refHalalStatuses.id, halalStatusId)))
    .returning();

  return updatedHalalStatus;
};

export const getHalalStatusById = async (halalStatusId: string) => {
  const halalStatus = await db.query.refHalalStatuses.findFirst({
    where: eq(refHalalStatuses.id, halalStatusId),
  });
  return halalStatus;
};

export const deleteHalalStatus = async (halalStatusId: string) => {
  const [deletedHalalStatus] = await db
    .delete(refHalalStatuses)
    .where(eq(refHalalStatuses.id, halalStatusId))
    .returning();
  return deletedHalalStatus;
};
