import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { fundAccounts } from "../../../db/schema";
import { listFundAccountQuery } from "./model";

export const createFundAccount = async (
  mosqueId: string,
  donationTypeId: string,
  code: string,
  name: string,
  isActive?: boolean
) => {
  const [newFundAccount] = await db
    .insert(fundAccounts)
    .values({
      mosqueId,
      donationTypeId,
      code,
      name,
      isActive,
    })
    .returning();

  return newFundAccount;
};

export const listFundAccounts = async ({
  page = 1,
  limit = 10,
  search,
}: listFundAccountQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(fundAccounts.code, searchTerm),
      ilike(fundAccounts.name, searchTerm),
      ilike(fundAccounts.mosqueId, searchTerm),
      ilike(fundAccounts.donationTypeId, searchTerm),
      ilike(fundAccounts.isActive, searchTerm)
    );
  }

  const donationList = await db.query.fundAccounts.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(fundAccounts)).at(0)?.count ?? 0;

  return { donationList, total };
};

export const updateFundAccount = async (
  donationId: string,
  mosqueId?: string,
  donationTypeId?: string,
  code?: string,
  name?: string,
  isActive?: boolean
) => {
  const [updatedFundAccount] = await db
    .update(fundAccounts)
    .set({
      mosqueId,
      donationTypeId,
      code,
      name,
      isActive,
    })
    .where(and(eq(fundAccounts.id, donationId)))
    .returning();

  return updatedFundAccount;
};

export const getFundAccountById = async (donationId: string) => {
  const donation = await db.query.fundAccounts.findFirst({
    where: eq(fundAccounts.id, donationId),
  });
  return donation;
};

export const deleteFundAccount = async (donationId: string) => {
  const [deletedFundAccount] = await db
    .delete(fundAccounts)
    .where(eq(fundAccounts.id, donationId))
    .returning();
  return deletedFundAccount;
};
