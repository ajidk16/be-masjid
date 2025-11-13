import Elysia from "elysia";
import {
  createFundAccount,
  deleteFundAccount,
  getFundAccountById,
  listFundAccounts,
  updateFundAccount,
} from "./service";
import {
  createFundAccountBody,
  listFundAccountQuery,
  updateFundAccountBody,
} from "./model";

export const fundAccountController = new Elysia({ prefix: "/fund-account" })
  .post(
    "/",
    async ({ body: { mosqueId, donationTypeId, code, name, isActive } }) => {
      const newFundAccount = await createFundAccount(
        mosqueId,
        donationTypeId,
        code,
        name,
        isActive
      );

      return {
        status: 200,
        message: "Fund Account created",
        data: newFundAccount,
      };
    },
    {
      body: createFundAccountBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listFundAccounts({
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
      query: listFundAccountQuery,
    }
  )
  .put(
    "/:foundAccountId",
    async ({
      params,
      body: { mosqueId, donationTypeId, code, name, isActive },
    }) => {
      const { foundAccountId } = params;
      const updatedFundAccount = await updateFundAccount(
        foundAccountId,
        mosqueId,
        donationTypeId,
        code,
        name,
        isActive
      );
      return {
        status: 200,
        message: "Fund Account updated",
        data: updatedFundAccount,
      };
    },
    {
      body: updateFundAccountBody,
    }
  )
  .get("/:foundAccountId", async ({ params }) => {
    const { foundAccountId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getFundAccountById(foundAccountId);
    if (!mosque) {
      return {
        status: 404,
        message: "Fund Account not found",
      };
    }

    return {
      status: 200,
      message: "Fund Account details",
      data: mosque,
    };
  })
  .delete("/:foundAccountId", async ({ params }) => {
    const { foundAccountId } = params;
    const donation = await deleteFundAccount(foundAccountId);
    if (!donation) {
      return {
        status: 404,
        message: "Fund Account not found",
      };
    }

    return {
      status: 200,
      message: "Fund Account deleted",
      data: donation,
    };
  });
