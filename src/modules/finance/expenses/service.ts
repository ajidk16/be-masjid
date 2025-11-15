import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { listExpenseQuery } from "./model";
import { expenses } from "../../../db/schema";

export const createExpense = async (
  mosqueId: string,
  title: string,
  amount: number,
  spentAt: Date,
  fundAccountId?: string,
  spenderMemberId?: string,
  proofUrl?: string,
  note?: string
) => {
  const [newExpense] = await db
    .insert(expenses)
    .values({
      mosqueId,
      fundAccountId,
      title,
      amount: amount.toString(),
      spenderMemberId,
      proofUrl,
      spentAt,
      note,
    })
    .returning();

  return newExpense;
};

export const listExpenses = async ({
  page = 1,
  limit = 10,
  search,
}: listExpenseQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(expenses.amount, searchTerm),
      ilike(expenses.title, searchTerm),
      ilike(expenses.fundAccountId, searchTerm),
      ilike(expenses.spenderMemberId, searchTerm),
      ilike(expenses.proofUrl, searchTerm),
      ilike(expenses.spentAt, searchTerm),
      ilike(expenses.note, searchTerm)
    );
  }

  const donationList = await db.query.expenses.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(expenses)).at(0)?.count ?? 0;

  return { donationList, total };
};

export const updateExpense = async (
  expenseId: string,
  mosqueId?: string,
  title?: string,
  amount?: number,
  spentAt?: Date,
  fundAccountId?: string,
  spenderMemberId?: string,
  proofUrl?: string,
  note?: string
) => {
  const [updatedExpense] = await db
    .update(expenses)
    .set({
      mosqueId,
      fundAccountId,
      title,
      amount: amount?.toString(),
      spenderMemberId,
      proofUrl,
      spentAt,
      note,
    })
    .where(and(eq(expenses.id, expenseId)))
    .returning();

  return updatedExpense;
};

export const getExpenseById = async (expenseId: string) => {
  const donation = await db.query.expenses.findFirst({
    where: eq(expenses.id, expenseId),
  });
  return donation;
};

export const deleteExpense = async (expenseId: string) => {
  const [deletedExpense] = await db
    .delete(expenses)
    .where(eq(expenses.id, expenseId))
    .returning();
  return deletedExpense;
};
