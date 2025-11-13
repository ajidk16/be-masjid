import Elysia from "elysia";
import {
  createPayment,
  deletePayment,
  getPaymentById,
  listPayments,
  updatePayment,
} from "./service";
import {
  createPaymentBody,
  listPaymentQuery,
  updatePaymentBody,
} from "./model";

export const refPaymentsController = new Elysia({ prefix: "/roles" })
  .post(
    "/",
    async ({
      body: { donationId, orderId, statusId, provider, amount, paidAt },
    }) => {
      const newPayment = await createPayment(
        donationId,
        orderId,
        statusId,
        provider,
        amount,
        paidAt
      );

      return { status: 200, message: "Payment created", data: newPayment };
    },
    {
      body: createPaymentBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listPayments({
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
      query: listPaymentQuery,
    }
  )
  .put(
    "/:paymentId",
    async ({
      params,
      body: { donationId, orderId, statusId, provider, amount, paidAt },
    }) => {
      const { paymentId } = params;
      const updatedPayment = await updatePayment(
        paymentId,
        donationId,
        orderId,
        statusId,
        provider,
        amount,
        paidAt
      );
      return {
        status: 200,
        message: "Payment updated",
        data: updatedPayment,
      };
    },
    {
      body: updatePaymentBody,
    }
  )
  .get("/:paymentId", async ({ params }) => {
    const { paymentId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getPaymentById(paymentId);
    if (!mosque) {
      return {
        status: 404,
        message: "Payment not found",
      };
    }

    return {
      status: 200,
      message: "Payment details",
      data: mosque,
    };
  })
  .delete("/:paymentId", async ({ params }) => {
    const { paymentId } = params;
    const donation = await deletePayment(paymentId);
    if (!donation) {
      return {
        status: 404,
        message: "Payment not found",
      };
    }

    return {
      status: 200,
      message: "Payment deleted",
      data: donation,
    };
  });
