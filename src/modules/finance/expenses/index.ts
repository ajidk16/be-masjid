import Elysia from "elysia";
import {
  createExpense,
  deleteExpense,
  getExpenseById,
  listExpenses,
  updateExpense,
} from "./service";
import {
  createExpenseBody,
  listExpenseQuery,
  updateExpenseBody,
} from "./model";

export const refExpensesController = new Elysia({ prefix: "/roles" })
  .post(
    "/",
    async ({
      body: {
        mosqueId,
        title,
        amount,
        spentAt,
        fundAccountId,
        spenderMemberId,
        proofUrl,
        note,
      },
    }) => {
      const newExpense = await createExpense(
        mosqueId,
        title,
        amount,
        spentAt,
        fundAccountId,
        spenderMemberId,
        proofUrl,
        note
      );

      return { status: 200, message: "Expense created", data: newExpense };
    },
    {
      body: createExpenseBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listExpenses({
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
      query: listExpenseQuery,
    }
  )
  .put(
    "/:expenseId",
    async ({
      params,
      body: {
        mosqueId,
        title,
        amount,
        spentAt,
        fundAccountId,
        spenderMemberId,
        proofUrl,
        note,
      },
    }) => {
      const { expenseId } = params;
      const updatedExpense = await updateExpense(
        expenseId,
        mosqueId,
        title,
        amount,
        spentAt,
        fundAccountId,
        spenderMemberId,
        proofUrl,
        note
      );
      return {
        status: 200,
        message: "Expense updated",
        data: updatedExpense,
      };
    },
    {
      body: updateExpenseBody,
    }
  )
  .get("/:expenseId", async ({ params }) => {
    const { expenseId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getExpenseById(expenseId);
    if (!mosque) {
      return {
        status: 404,
        message: "Expense not found",
      };
    }

    return {
      status: 200,
      message: "Expense details",
      data: mosque,
    };
  })
  .delete("/:expenseId", async ({ params }) => {
    const { expenseId } = params;
    const donation = await deleteExpense(expenseId);
    if (!donation) {
      return {
        status: 404,
        message: "Expense not found",
      };
    }

    return {
      status: 200,
      message: "Expense deleted",
      data: donation,
    };
  });
