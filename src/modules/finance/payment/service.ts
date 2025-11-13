import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { listPaymentQuery } from "./model";
import { payments } from "../../../db/schema";

export const createPayment = async (
  donationId: string,
  orderId: string,
  statusId: string,
  provider: string,
  amount: number,
  paidAt: Date
) => {
  const [newPayment] = await db
    .insert(payments)
    .values({
      donationId,
      orderId,
      statusId,
      provider,
      amount: amount.toString(),
      paidAt,
    })
    .returning();

  return newPayment;
};

export const listPayments = async ({
  page = 1,
  limit = 10,
  search,
}: listPaymentQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(payments.amount, searchTerm),
      ilike(payments.paidAt, searchTerm),
      ilike(payments.statusId, searchTerm),
      ilike(payments.orderId, searchTerm)
    );
  }

  const donationList = await db.query.payments.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(payments)).at(0)?.count ?? 0;

  return { donationList, total };
};

export const updatePayment = async (
  paymentId: string,
  donationId?: string,
  orderId?: string,
  statusId?: string,
  provider?: string,
  amount?: number,
  paidAt?: Date
) => {
  const [updatedPayment] = await db
    .update(payments)
    .set({
      donationId,
      orderId,
      statusId,
      provider,
      amount: amount?.toString(),
      paidAt,
    })
    .where(and(eq(payments.id, paymentId)))
    .returning();

  return updatedPayment;
};

export const getPaymentById = async (paymentId: string) => {
  const donation = await db.query.payments.findFirst({
    where: eq(payments.id, paymentId),
  });
  return donation;
};

export const deletePayment = async (paymentId: string) => {
  const [deletedPayment] = await db
    .delete(payments)
    .where(eq(payments.id, paymentId))
    .returning();
  return deletedPayment;
};
