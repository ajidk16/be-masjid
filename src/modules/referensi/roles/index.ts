import Elysia from "elysia";
import {
  createRole,
  deleteRole,
  getRoleById,
  listRoles,
  updateRole,
} from "./service";
import {
  createRoleBody,
  listRoleQuery,
  updateRoleBody,
} from "./model";

export const refRolesController = new Elysia({ prefix: "/roles" })
  .post(
    "/",
    async ({ body: { code, label, description } }) => {
      const newRole = await createRole(code, label, description);

      return { status: 200, message: "Role created", data: newRole };
    },
    {
      body: createRoleBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listRoles({
        limit,
        page: offset,
        search: searchTerm,
      });

      return {
        status: 200,
        message: "List of roles",
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
      query: listRoleQuery,
    }
  )
  .put(
    "/:roleId",
    async ({ params, body: { code, label, description } }) => {
      const { roleId } = params;
      const updatedRole = await updateRole(
        roleId,
        code,
        label,
        description
      );
      return {
        status: 200,
        message: "Role updated",
        data: updatedRole,
      };
    },
    {
      body: updateRoleBody,
    }
  )
  .get("/:roleId", async ({ params }) => {
    const { roleId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getRoleById(roleId);
    if (!mosque) {
      return {
        status: 404,
        message: "Role not found",
      };
    }

    return {
      status: 200,
      message: "Role details",
      data: mosque,
    };
  })
  .delete("/:roleId", async ({ params }) => {
    const { roleId } = params;
    const donation = await deleteRole(roleId);
    if (!donation) {
      return {
        status: 404,
        message: "Role not found",
      };
    }

    return {
      status: 200,
      message: "Role deleted",
      data: donation,
    };
  });
