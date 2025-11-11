import Elysia from "elysia";
import {
  createMemberService,
  deleteMemberService,
  getMemberByIdService,
  listMembersService,
  updateMemberService,
} from "./service";
import { CreateMemberBody, ListMemberQuery, UpdateMemberBody } from "./model";

export const membersController = new Elysia({ prefix: "/members" })
  .post(
    "/",
    async ({ body: { mosqueId, userId, roleId, fullName, isActive } }) => {
      const newMember = await createMemberService(
        mosqueId,
        userId,
        roleId,
        fullName,
        isActive
      );

      if (!newMember) {
        return {
          status: 400,
          message: "Failed to create member",
        };
      }

      return {
        status: 200,
        message: "Create member endpoint",
        data: newMember,
      };
    },
    {
      body: CreateMemberBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { memberList, total } = await listMembersService({
        limit,
        page: offset,
        search: searchTerm,
      });

      if (!memberList) {
        return {
          status: 400,
          message: "Failed to fetch members",
        };
      }

      return {
        status: 200,
        message: "Members endpoint",
        data: memberList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    },
    {
      query: ListMemberQuery,
    }
  )
  .put(
    "/:memberId",
    async ({
      params,
      body: { mosqueId, userId, roleId, fullName, isActive },
    }) => {
      const { memberId } = params;
      if (!memberId) {
        return { status: 400, message: "Member ID is required" };
      }

      const updatedMember = await updateMemberService(
        memberId,
        mosqueId,
        userId,
        roleId,
        fullName,
        isActive
      );

      if (!updatedMember) {
        return { status: 400, message: "Failed to update member" };
      }

      return {
        status: 200,
        message: "Update member endpoint",
        data: updatedMember,
      };
    },
    {
      body: UpdateMemberBody,
    }
  )
  .delete("/:memberId", async ({ params }) => {
    const { memberId } = params;
    if (!memberId) {
      return {
        status: 400,
        message: "Member ID is required",
      };
    }

    const deletedMember = await deleteMemberService(memberId);
    if (!deletedMember) {
      return {
        status: 400,
        message: "Failed to delete member",
      };
    }

    return {
      status: 200,
      message: "Delete member endpoint",
      data: deletedMember,
    };
  })
  .get("/:memberId", async ({ params }) => {
    const { memberId } = params;
    if (!memberId) {
      return {
        status: 400,
        message: "Member ID is required",
      };
    }

    const member = await getMemberByIdService(memberId);
    if (!member) {
      return {
        status: 404,
        message: "Member not found",
      };
    }

    return {
      status: 200,
      message: "Get member by ID endpoint",
      data: member,
    };
  });
