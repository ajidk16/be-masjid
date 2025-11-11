import Elysia from "elysia";
import {
  createHalalStatus,
  deleteHalalStatus,
  getHalalStatusById,
  listHalalStatus,
  updateHalalStatus,
} from "./service";
import {
  createHalalStatusBody,
  listHalalStatussQuery,
  updateHalalStatusBody,
} from "./model";

export const refHalalStatusController = new Elysia({ prefix: "/halal-status" })
  .post(
    "/",
    async ({ body: { code, label } }) => {
      const newHalalStatus = await createHalalStatus(code, label);

      return {
        status: 200,
        message: "Halal status created",
        data: newHalalStatus,
      };
    },
    {
      body: createHalalStatusBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { halalStatusList, total } = await listHalalStatus({
        limit,
        page: offset,
        search: searchTerm,
      });

      return {
        status: 200,
        message: "List of halal statuses",
        data: halalStatusList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    },
    {
      query: listHalalStatussQuery,
    }
  )
  .put(
    "/:halalStatusId",
    async ({ params, body: { code, label } }) => {
      const { halalStatusId } = params;
      const updatedHalalStatus = await updateHalalStatus(
        halalStatusId,
        code,
        label
      );
      return {
        status: 200,
        message: "Halal status updated",
        data: updatedHalalStatus,
      };
    },
    {
      body: updateHalalStatusBody,
    }
  )
  .get("/:halalStatusId", async ({ params }) => {
    const { halalStatusId } = params;
    // For demonstration, returning a mock halalStatus object
    const halalStatus = await getHalalStatusById(halalStatusId);
    if (!halalStatus) {
      return {
        status: 404,
        message: "Halal status not found",
      };
    }

    return {
      status: 200,
      message: "Halal Status details",
      data: halalStatus,
    };
  })
  .delete("/:halalStatusId", async ({ params }) => {
    const { halalStatusId } = params;
    const halalStatus = await deleteHalalStatus(halalStatusId);
    if (!halalStatus) {
      return {
        status: 404,
        message: "Halal Status not found",
      };
    }

    return {
      status: 200,
      message: "Halal Status deleted",
      data: halalStatus,
    };
  });
