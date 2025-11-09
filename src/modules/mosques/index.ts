import Elysia from "elysia";
import { createMosque, listMosques, updateMosque } from "./service";
import { createMosqueBody, listMosquesQuery, updateMosqueBody } from "./model";

export const mosqueController = new Elysia({ prefix: "/mosques" })
  .post(
    "/",
    async ({ body: { slug, name, address, city, province } }) => {
      const newMosque = await createMosque(slug, name, address, city, province);

      return { status: 200, message: "Mosque created", data: newMosque };
    },
    {
      body: createMosqueBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { mosqueList, total } = await listMosques({
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
      query: listMosquesQuery,
    }
  )
  .put(
    "/:mosqueId",
    async ({ params, body: { name, address, city, province, lat, lng } }) => {
      const { mosqueId } = params;
      const updatedMosque = await updateMosque(
        mosqueId,
        name,
        address,
        city,
        province,
        lat,
        lng
      );
      return { status: 200, message: "Mosque updated", data: updatedMosque };
    },
    {
      body: updateMosqueBody,
    }
  )
  .delete("/:mosqueId", async () => {
    return { status: 200, message: "Mosque deleted" };
  });
