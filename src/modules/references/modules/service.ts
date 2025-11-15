import { and, count, eq, ilike, or } from "drizzle-orm";
import { db } from "../../../db/client";
import { listModuleQuery } from "./model";
import { refModules, refPermissions } from "../../../db/schema";

export const createModule = async (name: string) => {
  const [newModule] = await db
    .insert(refModules)
    .values({
      name,
    })
    .returning();

    console.log("newModule:", newModule);

  const findRole = await db.query.refRoles.findMany();

  for (const role of findRole) {
    if (role.code === "admin") {
      await db.insert(refPermissions).values({
        roleId: role.id,
        moduleId: newModule.id,
        canCreate: true,
        canRead: true,
        canUpdate: true,
        canDelete: true,
      });
    } else {
      await db.insert(refPermissions).values({
        roleId: role.id,
        moduleId: newModule.id,
        canCreate: false,
        canRead: false,
        canUpdate: false,
        canDelete: false,
      });
    }
  }

  return newModule;
};

export const listModules = async ({
  page = 1,
  limit = 10,
  search,
}: listModuleQuery) => {
  let whereCondition = undefined;
  const searchTerm = `%${search}%`;

  if (search) {
    whereCondition = or(ilike(refModules.name, searchTerm));
  }

  const donationList = await db.query.refModules.findMany({
    offset: page,
    limit,
    where: whereCondition,
  });

  const total =
    (await db.select({ count: count() }).from(refModules)).at(0)?.count ?? 0;

  return { donationList, total };
};

export const updateModule = async (donationId: string, name?: string) => {
  const [updatedModule] = await db
    .update(refModules)
    .set({
      name,
    })
    .where(and(eq(refModules.id, donationId)))
    .returning();

  return updatedModule;
};

export const getModuleById = async (donationId: string) => {
  const donation = await db.query.refModules.findFirst({
    where: eq(refModules.id, donationId),
  });
  return donation;
};

export const deleteModule = async (donationId: string) => {
  const [deletedModule] = await db
    .delete(refModules)
    .where(eq(refModules.id, donationId))
    .returning();
  return deletedModule;
};
