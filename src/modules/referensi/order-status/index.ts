import Elysia from "elysia";
import {
  createOrderStatus,
  deleteOrderStatus,
  getOrderStatusById,
  listOrderStatus,
  updateOrderStatus,
} from "./service";
import {
  createOrderStatusBody,
  listOrderStatusQuery,
  UpdateOrderStatusBody,
} from "./model";

export const refOrderStatusController = new Elysia({ prefix: "/order-status" })
  .post(
    "/",
    async ({ body: { code, label } }) => {
      const newOrderStatus = await createOrderStatus(code, label);

      return {
        status: 200,
        message: "OrderStatus created",
        data: newOrderStatus,
      };
    },
    {
      body: createOrderStatusBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { mosqueList, total } = await listOrderStatus({
        limit,
        page: offset,
        search: searchTerm,
      });

      return {
        status: 200,
        message: "List of mosques",
        data: mosqueList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    },
    {
      query: listOrderStatusQuery,
    }
  )
  .put(
    "/:orderStatusId",
    async ({ params, body: { code, label } }) => {
      const { orderStatusId } = params;
      const updatedOrderStatus = await updateOrderStatus(
        orderStatusId,
        code,
        label
      );
      return {
        status: 200,
        message: "OrderStatus updated",
        data: updatedOrderStatus,
      };
    },
    {
      body: UpdateOrderStatusBody,
    }
  )
  .get("/:orderStatusId", async ({ params }) => {
    const { orderStatusId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getOrderStatusById(orderStatusId);
    if (!mosque) {
      return {
        status: 404,
        message: "OrderStatus not found",
      };
    }

    return {
      status: 200,
      message: "OrderStatus details",
      data: mosque,
    };
  })
  .delete("/:orderStatusId", async ({ params }) => {
    const { orderStatusId } = params;
    const mosque = await deleteOrderStatus(orderStatusId);
    if (!mosque) {
      return {
        status: 404,
        message: "OrderStatus not found",
      };
    }

    return {
      status: 200,
      message: "OrderStatus deleted",
      data: mosque,
    };
  });
