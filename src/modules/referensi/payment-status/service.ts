import { and, count, eq, ilike, or } from "drizzle-orm";

import { listPaymentStatussQuery } from "./model";
import { db } from "../../../db/client";
import { refPaymentStatuses } from "../../../db/schema";

export const createPaymentStatus = async (code: string, label: string) => {
  const [newPaymentStatus] = await db
    .insert(refPaymentStatuses)
    .values({
      code,
      label,
    })
    .returning();

  return newPaymentStatus;
};

export const listPaymentStatuss = async ({
  page = 1,
  limit = 10,
  search,
}: listPaymentStatussQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(refPaymentStatuses.code, searchTerm),
      ilike(refPaymentStatuses.label, searchTerm)
    );
  }

  const mosqueList = await db.query.refPaymentStatuses.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(refPaymentStatuses)).at(0)
      ?.count ?? 0;

  return { mosqueList, total };
};

export const updatePaymentStatus = async (
  paymentStatusId: string,
  code?: string,
  label?: string
) => {
  const [updatedPaymentStatus] = await db
    .update(refPaymentStatuses)
    .set({
      code,
      label,
    })
    .where(and(eq(refPaymentStatuses.id, paymentStatusId)))
    .returning();

  return updatedPaymentStatus;
};

export const getPaymentStatusById = async (paymentStatusId: string) => {
  const mosque = await db.query.refPaymentStatuses.findFirst({
    where: eq(refPaymentStatuses.id, paymentStatusId),
  });
  return mosque;
};

export const deletePaymentStatus = async (paymentStatusId: string) => {
  const [deletedPaymentStatus] = await db
    .delete(refPaymentStatuses)
    .where(eq(refPaymentStatuses.id, paymentStatusId))
    .returning();
  return deletedPaymentStatus;
};
