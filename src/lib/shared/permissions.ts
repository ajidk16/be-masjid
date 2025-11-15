import { and, eq } from "drizzle-orm";
import { db } from "../../db/client";
import { refPermissions, refModules } from "../../db/schema";

export async function globalPermissionGuard({
  jwt,
  bearer,
  set,
  status,
  request,
}: any) {
  const token = await jwt.verify(bearer);
  if (!token) {
    return status(401, {
      status: 401,
      message: "Missing or invalid token",
    });
  }

  const path = request.url;
  const moduleName = path.split("/")[6];

  if (!moduleName) {
    return;
  }

  const methodToActionMap: Record<
    string,
    "canRead" | "canCreate" | "canUpdate" | "canDelete" | "canManage"
  > = {
    GET: "canRead",
    POST: "canCreate",
    PUT: "canUpdate",
    PATCH: "canUpdate",
    DELETE: "canDelete",
  };

  const action = methodToActionMap[request.method];
  if (!action) {
    return { status: 400, error: "Bad Request: unsupported method" };
  }

  // Ambil module Id
  const module = await db.query.refModules.findFirst({
    where: eq(refModules.name, moduleName),
  });

  if (!module) {
    return status(403, {
      status: 403,
      message:'module not found',
    });
  }

  const permission = await db.query.refPermissions.findFirst({
    where: and(
      token.roleId && eq(refPermissions.roleId, token.roleId),
      eq(refPermissions.moduleId, module.id)
    ),
  });

  if (!permission || !permission[action]) {
    return status(403, {
      status: 403,
      message: "Forbidden: You don't have access to this resource",
    });
  }
}
