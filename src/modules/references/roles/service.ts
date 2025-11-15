import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { listRoleQuery } from "./model";
import { members, refPermissions, refRoles } from "../../../db/schema";

export const createRole = async (
  code: string,
  label: string,
  description?: string
) => {
  const [newRole] = await db
    .insert(refRoles)
    .values({
      code,
      label,
      description,
    })
    .returning();

  const findPermission = await db.query.refRoles.findMany();

  findPermission.map(async (role) => {
    await db
      .insert(refPermissions)
      .values({
        roleId: newRole.id,
        moduleId: role.id,
        canRead: false,
        canCreate: false,
        canUpdate: false,
        canDelete: false,
        canManage: false,
      })
      .returning();
  });

  return newRole;
};

export const listRoles = async ({
  page = 1,
  limit = 10,
  search,
}: listRoleQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(
      ilike(refRoles.code, searchTerm),
      ilike(refRoles.label, searchTerm),
      ilike(refRoles.description, searchTerm)
    );
  }

  // const donationList = await db.query.refRoles.findMany({
  //   with: {
  //     members: true,
  //   },
  //   offset: page,
  //   limit,
  //   where: whereCondition,
  // });

  const donationList = await db
    .select({
      code: refRoles.code,
      label: refRoles.label,
      description: refRoles.description,
      memberCount: count(members.id),
    })
    .from(refRoles)
    .leftJoin(members, eq(refRoles.id, members.roleId))
    .groupBy(refRoles.id)
    .orderBy(refRoles.code);

  const total =
    (await db.select({ count: count() }).from(refRoles)).at(0)?.count ?? 0;

  return { donationList, total };
};

export const updateRole = async (
  donationId: string,
  code?: string,
  label?: string,
  description?: string
) => {
  const [updatedRole] = await db
    .update(refRoles)
    .set({
      code,
      label,
      description,
    })
    .where(and(eq(refRoles.id, donationId)))
    .returning();

  return updatedRole;
};

export const getRoleById = async (donationId: string) => {
  const donation = await db.query.refRoles.findFirst({
    where: eq(refRoles.id, donationId),
  });
  return donation;
};

export const deleteRole = async (donationId: string) => {
  const [deletedRole] = await db
    .delete(refRoles)
    .where(eq(refRoles.id, donationId))
    .returning();
  return deletedRole;
};
