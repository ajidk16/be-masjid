import { and, count, eq, ilike, or } from "drizzle-orm";
import { listOrderStatusQuery } from "./model";
import { db } from "../../../db/client";
import { refOrderStatuses } from "../../../db/schema";

export const createOrderStatus = async (code: string, label: string) => {
  const [newOrderStatus] = await db
    .insert(refOrderStatuses)
    .values({
      code,
      label,
    })
    .returning();

  return newOrderStatus;
};

export const listOrderStatus = async ({
  page = 1,
  limit = 10,
  search,
}: listOrderStatusQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(refOrderStatuses.code, searchTerm),
      ilike(refOrderStatuses.label, searchTerm)
    );
  }

  const mosqueList = await db.query.refOrderStatuses.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(refOrderStatuses)).at(0)?.count ??
    0;

  return { mosqueList, total };
};

export const updateOrderStatus = async (
  orderStatusId: string,
  code?: string,
  label?: string
) => {
  const [updatedOrderStatus] = await db
    .update(refOrderStatuses)
    .set({
      code,
      label,
    })
    .where(and(eq(refOrderStatuses.id, orderStatusId)))
    .returning();

  return updatedOrderStatus;
};

export const getOrderStatusById = async (orderStatusId: string) => {
  const mosque = await db.query.refOrderStatuses.findFirst({
    where: eq(refOrderStatuses.id, orderStatusId),
  });
  return mosque;
};

export const deleteOrderStatus = async (orderStatusId: string) => {
  const [deletedOrderStatus] = await db
    .delete(refOrderStatuses)
    .where(eq(refOrderStatuses.id, orderStatusId))
    .returning();
  return deletedOrderStatus;
};
