import { count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../db/client";
import { members } from "../../db/schema";
import { ListMemberQuery } from "./model";

export const createMemberService = async (
  mosqueId: string,
  userId: string,
  roleId: string,
  fullName: string,
  isActive: boolean
) => {
  const [newMember] = await db
    .insert(members)
    .values({
      mosqueId,
      userId,
      roleId,
      fullName,
      isActive,
    })
    .returning();

  return newMember;
};

export const listMembersService = async ({
  page = 1,
  limit = 10,
  search,
}: ListMemberQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(members.fullName, searchTerm),
      ilike(members.isActive, searchTerm),
      ilike(members.mosqueId, searchTerm),
      ilike(members.roleId, searchTerm)
    );
  }

  const memberList = await db.query.members.findMany({
    with: {
      mosque: true,
      user: {
        columns: {
          email: true,
          phone: true,
        },
      },
      role: true,
    },
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(members)).at(0)?.count ?? 0;

  return { memberList, total };
};

export const updateMemberService = async (
  memberId: string,
  mosqueId?: string,
  userId?: string,
  roleId?: string,
  fullName?: string,
  isActive?: boolean
) => {
  const [updatedMember] = await db
    .update(members)
    .set({
      mosqueId,
      userId,
      roleId,
      fullName,
      isActive,
    })
    .where(eq(members.id, memberId))
    .returning();

  return updatedMember;
};

export const getMemberByIdService = async (memberId: string) => {
  const member = await db.query.members.findFirst({
    with: {
      mosque: true,
      user: {
        columns: {
          email: true,
          phone: true,
        },
      },
      role: true,
    },
    where: eq(members.id, memberId),
  });

  return member;
};

export const deleteMemberService = async (memberId: string) => {
  const [deletedMember] = await db
    .delete(members)
    .where(eq(members.id, memberId))
    .returning();

  return deletedMember;
};
