import Elysia from "elysia";
import {
  createPaymentStatus,
  deletePaymentStatus,
  getPaymentStatusById,
  listPaymentStatuss,
  updatePaymentStatus,
} from "./service";
import {
  createPaymentStatusBody,
  listPaymentStatussQuery,
  updatePaymentStatusBody,
} from "./model";

export const refPaymentStatusController = new Elysia({ prefix: "/payment-status" })
  .post(
    "/",
    async ({ body: { code, label } }) => {
      const newPaymentStatus = await createPaymentStatus(code, label);

      return {
        status: 200,
        message: "Payment Status created",
        data: newPaymentStatus,
      };
    },
    {
      body: createPaymentStatusBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { mosqueList, total } = await listPaymentStatuss({
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
      query: listPaymentStatussQuery,
    }
  )
  .put(
    "/:paymentStatusId",
    async ({ params, body: { code, label } }) => {
      const { paymentStatusId } = params;
      const updatedPaymentStatus = await updatePaymentStatus(
        paymentStatusId,
        code,
        label
      );
      return {
        status: 200,
        message: "Payment Status updated",
        data: updatedPaymentStatus,
      };
    },
    {
      body: updatePaymentStatusBody,
    }
  )
  .get("/:paymentStatusId", async ({ params }) => {
    const { paymentStatusId } = params;
    const mosque = await getPaymentStatusById(paymentStatusId);
    if (!mosque) {
      return {
        status: 404,
        message: "Payment Status not found",
      };
    }

    return {
      status: 200,
      message: "Payment Status details",
      data: mosque,
    };
  })
  .delete("/:paymentStatusId", async ({ params }) => {
    const { paymentStatusId } = params;
    const mosque = await deletePaymentStatus(paymentStatusId);
    if (!mosque) {
      return {
        status: 404,
        message: "Payment Status not found",
      };
    }

    return {
      status: 200,
      message: "Payment Status deleted",
      data: mosque,
    };
  });
