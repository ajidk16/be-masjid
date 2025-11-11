import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { refDonationTypes } from "../../../db/schema";
import { listDonationQuery } from "./model";

export const createDonation = async (
  code: string,
  label: string,
  description?: string
) => {
  const [newDonation] = await db
    .insert(refDonationTypes)
    .values({
      code,
      label,
      description,
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
      ilike(refDonationTypes.code, searchTerm),
      ilike(refDonationTypes.label, searchTerm),
      ilike(refDonationTypes.description, searchTerm)
    );
  }

  const donationList = await db.query.refDonationTypes.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(refDonationTypes)).at(0)?.count ??
    0;

  return { donationList, total };
};

export const updateDonation = async (
  donationId: string,
  code?: string,
  label?: string,
  description?: string
) => {
  const [updatedDonation] = await db
    .update(refDonationTypes)
    .set({
      code,
      label,
      description,
    })
    .where(and(eq(refDonationTypes.id, donationId)))
    .returning();

  return updatedDonation;
};

export const getDonationById = async (donationId: string) => {
  const donation = await db.query.refDonationTypes.findFirst({
    where: eq(refDonationTypes.id, donationId),
  });
  return donation;
};

export const deleteDonation = async (donationId: string) => {
  const [deletedDonation] = await db
    .delete(refDonationTypes)
    .where(eq(refDonationTypes.id, donationId))
    .returning();
  return deletedDonation;
};
