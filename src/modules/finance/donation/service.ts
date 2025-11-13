import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { listDonationQuery } from "./model";
import { donations } from "../../../db/schema";

export const createDonation = async (
  mosqueId: string,
  fundAccountId: string,
  donorUserId: string,
  donationTypeId: string,
  amount: number,
  note?: string
) => {
  const [newDonation] = await db
    .insert(donations)
    .values({
      mosqueId,
      fundAccountId,
      donorUserId,
      donationTypeId,
      amount: amount.toString(),
      note,
    })
    .returning();

  return newDonation;
};

export const listDonations = async ({
  page = 1,
  limit = 10,
  search,
}: listDonationQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(donations.mosqueId, searchTerm),
      ilike(donations.fundAccountId, searchTerm),
      ilike(donations.donorUserId, searchTerm),
      ilike(donations.donationTypeId, searchTerm),
      ilike(donations.amount, searchTerm),
      ilike(donations.note, searchTerm)
    );
  }

  const donationList = await db.query.donations.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(donations)).at(0)?.count ?? 0;

  return { donationList, total };
};

export const updateDonation = async (
  donationId: string,
  mosqueId?: string,
  fundAccountId?: string,
  donorUserId?: string,
  donationTypeId?: string,
  amount?: number,
  note?: string
) => {
  const [updatedDonation] = await db
    .update(donations)
    .set({
      mosqueId,
      fundAccountId,
      donorUserId,
      donationTypeId,
      amount: amount?.toString(),
      note,
    })
    .where(and(eq(donations.id, donationId)))
    .returning();

  return updatedDonation;
};

export const getDonationById = async (donationId: string) => {
  const donation = await db.query.donations.findFirst({
    where: eq(donations.id, donationId),
  });
  return donation;
};

export const deleteDonation = async (donationId: string) => {
  const [deletedDonation] = await db
    .delete(donations)
    .where(eq(donations.id, donationId))
    .returning();
  return deletedDonation;
};
