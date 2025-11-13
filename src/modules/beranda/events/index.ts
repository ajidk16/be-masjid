import Elysia from "elysia";
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  updateEvent,
} from "./service";
import { createEventBody, listEventQuery, updateEventBody } from "./model";

export const eventsController = new Elysia({ prefix: "/events" })
  .post(
    "/",
    async ({
      body: {
        mosqueId,
        title,
        speaker,
        startAt,
        endAt,
        location,
        description,
        isPublished,
      },
    }) => {
      const newEvent = await createEvent(
        mosqueId,
        title,
        startAt,
        speaker,
        endAt,
        location,
        description,
        isPublished
      );

      return {
        status: 200,
        message: "Fund Account created",
        data: newEvent,
      };
    },
    {
      body: createEventBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { eventList, total } = await listEvents({
        limit,
        page: offset,
        search: searchTerm,
      });

      return {
        status: 200,
        message: "List of events",
        data: eventList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    },
    {
      query: listEventQuery,
    }
  )
  .put(
    "/:eventId",
    async ({
      params,
      body: {
        mosqueId,
        title,
        speaker,
        startAt,
        endAt,
        location,
        description,
        isPublished,
      },
    }) => {
      const { eventId } = params;
      const updatedEvent = await updateEvent(
        eventId,
        mosqueId,
        title,
        speaker,
        startAt,
        endAt,
        location,
        description,
        isPublished
      );
      return {
        status: 200,
        message: "Fund Account updated",
        data: updatedEvent,
      };
    },
    {
      body: updateEventBody,
    }
  )
  .get("/:eventId", async ({ params }) => {
    const { eventId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getEventById(eventId);
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
  .delete("/:eventId", async ({ params }) => {
    const { eventId } = params;
    const donation = await deleteEvent(eventId);
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
