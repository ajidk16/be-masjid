import Elysia from "elysia";
import {
  createPermission,
  deletePermission,
  getPermissionById,
  listPermissions,
  updatePermission,
} from "./service";
import {
  createPermissionBody,
  listPermissionQuery,
  updatePermissionBody,
} from "./model";

export const refPermissionsController = new Elysia({ prefix: "/permissions" })
  .post(
    "/",
    async ({ body: { moduleId, roleId } }) => {
      const newPermission = await createPermission(moduleId, roleId);

      return {
        status: 200,
        message: "Permission created",
        data: newPermission,
      };
    },
    {
      body: createPermissionBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listPermissions({
        limit,
        page: offset,
        search: searchTerm,
      });

      return {
        status: 200,
        message: "List of modules",
        data: donationList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    },
    {
      query: listPermissionQuery,
    }
  )
  .put(
    "/:permissionId",
    async ({
      params,
      body: {
        moduleId,
        roleId,
        canRead,
        canCreate,
        canUpdate,
        canDelete,
        canManage,
      },
    }) => {
      const { permissionId } = params;
      const updatedPermission = await updatePermission(
        permissionId,
        moduleId,
        roleId,
        canRead,
        canCreate,
        canUpdate,
        canDelete,
        canManage
      );
      return {
        status: 200,
        message: "Permission updated",
        data: updatedPermission,
      };
    },
    {
      body: updatePermissionBody,
    }
  )
  .get("/:permissionId", async ({ params }) => {
    const { permissionId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getPermissionById(permissionId);
    if (!mosque) {
      return {
        status: 404,
        message: "Permission not found",
      };
    }

    return {
      status: 200,
      message: "Permission details",
      data: mosque,
    };
  })
  .delete("/:permissionId", async ({ params }) => {
    const { permissionId } = params;
    const donation = await deletePermission(permissionId);
    if (!donation) {
      return {
        status: 404,
        message: "Permission not found",
      };
    }

    return {
      status: 200,
      message: "Permission deleted",
      data: donation,
    };
  });
