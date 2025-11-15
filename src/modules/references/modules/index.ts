import Elysia from "elysia";
import {
  createModule,
  deleteModule,
  getModuleById,
  listModules,
  updateModule,
} from "./service";
import { createModuleBody, listModuleQuery, updateModuleBody } from "./model";

export const refModulesController = new Elysia({ prefix: "/modules" })
  .post(
    "/",
    async ({ body: { name } }) => {
      const newModule = await createModule(name);

      return { status: 200, message: "Module created", data: newModule };
    },
    {
      body: createModuleBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listModules({
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
      query: listModuleQuery,
    }
  )
  .put(
    "/:moduleId",
    async ({ params, body: { name } }) => {
      const { moduleId } = params;
      const updatedModule = await updateModule(moduleId, name);
      return {
        status: 200,
        message: "Module updated",
        data: updatedModule,
      };
    },
    {
      body: updateModuleBody,
    }
  )
  .get("/:moduleId", async ({ params }) => {
    const { moduleId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getModuleById(moduleId);
    if (!mosque) {
      return {
        status: 404,
        message: "Module not found",
      };
    }

    return {
      status: 200,
      message: "Module details",
      data: mosque,
    };
  })
  .delete("/:moduleId", async ({ params }) => {
    const { moduleId } = params;
    const donation = await deleteModule(moduleId);
    if (!donation) {
      return {
        status: 404,
        message: "Module not found",
      };
    }

    return {
      status: 200,
      message: "Module deleted",
      data: donation,
    };
  });
