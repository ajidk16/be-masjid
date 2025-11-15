import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { listPermissionQuery } from "./model";
import { refPermissions } from "../../../db/schema";

export const createPermission = async (moduleId: string, roleId: string) => {
  const [newPermission] = await db
    .insert(refPermissions)
    .values({
      moduleId,
      roleId,
    })
    .returning();

  return newPermission;
};

export const listPermissions = async ({
  page = 1,
  limit = 10,
  search,
}: listPermissionQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(ilike(refPermissions.moduleId, searchTerm));
    whereCondition = or(ilike(refPermissions.roleId, searchTerm));
  }

  const donationList = await db.query.refPermissions.findMany({
    columns: {
      id: true,
      canRead: true,
      canCreate: true,
      canUpdate: true,
      canDelete: true,
      canManage: true,
    },
    with: {
      module: true,
      role: true,
    },
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(refPermissions)).at(0)?.count ??
    0;

  return { donationList, total };
};

export const updatePermission = async (
  permissionId: string,
  moduleId?: string,
  roleId?: string,
  canRead?: boolean,
  canCreate?: boolean,
  canUpdate?: boolean,
  canDelete?: boolean,
  canManage?: boolean
) => {
  const [updatedPermission] = await db
    .update(refPermissions)
    .set({
      moduleId,
      roleId,
      canRead,
      canCreate,
      canUpdate,
      canDelete,
      canManage,
    })
    .where(and(eq(refPermissions.id, permissionId)))
    .returning();

  return updatedPermission;
};

export const getPermissionById = async (permissionId: string) => {
  const donation = await db.query.refPermissions.findFirst({
    where: eq(refPermissions.id, permissionId),
  });
  return donation;
};

export const deletePermission = async (permissionId: string) => {
  const [deletedPermission] = await db
    .delete(refPermissions)
    .where(eq(refPermissions.id, permissionId))
    .returning();
  return deletedPermission;
};
