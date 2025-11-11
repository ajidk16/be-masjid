import Elysia from "elysia";
import {
  createDonation,
  deleteDonation,
  getDonationById,
  listDonations,
  updateDonation,
} from "./service";
import {
  createDonationBody,
  listDonationQuery,
  updateDonationBody,
} from "./model";

export const refDonationsController = new Elysia({ prefix: "/donations" })
  .post(
    "/",
    async ({ body: { code, label, description } }) => {
      const newDonation = await createDonation(code, label, description);

      return { status: 200, message: "Donation created", data: newDonation };
    },
    {
      body: createDonationBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { donationList, total } = await listDonations({
        limit,
        page: offset,
        search: searchTerm,
      });

      return {
        status: 200,
        message: "List of donations",
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
      query: listDonationQuery,
    }
  )
  .put(
    "/:donationId",
    async ({ params, body: { code, label, description } }) => {
      const { donationId } = params;
      const updatedDonation = await updateDonation(
        donationId,
        code,
        label,
        description
      );
      return {
        status: 200,
        message: "Donation updated",
        data: updatedDonation,
      };
    },
    {
      body: updateDonationBody,
    }
  )
  .get("/:donationId", async ({ params }) => {
    const { donationId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getDonationById(donationId);
    if (!mosque) {
      return {
        status: 404,
        message: "Donation not found",
      };
    }

    return {
      status: 200,
      message: "Donation details",
      data: mosque,
    };
  })
  .delete("/:donationId", async ({ params }) => {
    const { donationId } = params;
    const donation = await deleteDonation(donationId);
    if (!donation) {
      return {
        status: 404,
        message: "Donation not found",
      };
    }

    return {
      status: 200,
      message: "Donation deleted",
      data: donation,
    };
  });
