import Elysia from "elysia";
import {
  createNew,
  deleteNew,
  getNewById,
  listNews,
  updateNew,
} from "./service";
import { createNewBody, listNewQuery, updateNewBody } from "./model";
import sharp from "sharp";

export const newsController = new Elysia({ prefix: "/news" })
  .post(
    "/",
    async ({ body: { mosqueId, title, content, isPublished, coverUrl } }) => {
      let finalCoverUrl: string = "";

      if (coverUrl) {
        const fileName = `${Date.now()}-${coverUrl.name.toLowerCase().split(" ").join("-").split(".")[0]}.webp`;
        const buffer = await coverUrl.arrayBuffer();
        const webpBuffer = await sharp(Buffer.from(buffer)).webp().toBuffer();

        await Bun.write(`./public/covers/${fileName}`, webpBuffer);
        finalCoverUrl = `/covers/${fileName}`;
      }

      const newNew = await createNew(
        mosqueId,
        title,
        content,
        isPublished,
        finalCoverUrl
      );
      if (!newNew) {
        return {
          status: 500,
          message: "Failed to create news",
        };
      }

      return {
        status: 200,
        message: "New item created",
        data: newNew,
      };
    },
    {
      body: createNewBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { newList, total } = await listNews({
        limit,
        page: offset,
        search: searchTerm,
      });
      if (!newList) {
        return {
          status: 500,
          message: "Failed to fetch news",
        };
      }

      return {
        status: 200,
        message: "List of news",
        data: newList,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    },
    {
      query: listNewQuery,
    }
  )
  .put(
    "/:newId",
    async ({
      params,
      body: { mosqueId, title, content, isPublished, coverUrl },
      status,
    }) => {
      const { newId } = params;
      if (!newId) {
        return status(400, {
          status: 400,
          message: "New ID is required",
        });
      }

      const findNewItem = await getNewById(newId);
      if (!findNewItem) {
        return status(404, {
          status: 404,
          message: "New item not found",
        });
      }

      let finalCoverUrl: string = "";

      if (coverUrl) {
        const fileName = `${Date.now()}-${coverUrl.name.toLowerCase().split(" ").join("-").split(".")[0]}.webp`;
        const buffer = await coverUrl.arrayBuffer();
        const webpBuffer = await sharp(Buffer.from(buffer)).webp().toBuffer();

        if (findNewItem.coverUrl) {
          // Hapus file cover lama jika ada
          const oldFilePath = `./public${findNewItem.coverUrl}`;
          try {
            await Bun.file(oldFilePath).delete();
          } catch (error) {
            console.error("Gagal menghapus file cover lama:", error);
          }
        }
        await Bun.write(`./public/covers/${fileName}`, webpBuffer);
        finalCoverUrl = `/covers/${fileName}`;
      } else {
        finalCoverUrl = findNewItem.coverUrl || "";
      }

      const updatedNew = await updateNew(
        newId,
        mosqueId,
        title,
        content,
        isPublished,
        finalCoverUrl
      );
      return status(200, {
        status: 200,
        message: "New item updated",
        data: updatedNew,
      });
    },
    {
      body: updateNewBody,
    }
  )
  .get("/:newId", async ({ params, status }) => {
    const { newId } = params;
    if (!newId) {
      return status(400, {
        status: 400,
        message: "New ID is required",
      });
    }

    const mosque = await getNewById(newId);
    if (!mosque) {
      return status(404, {
        status: 404,
        message: "New item not found",
      });
    }

    return status(200, {
      status: 200,
      message: "New item details",
      data: mosque,
    });
  })
  .delete("/:newId", async ({ params }) => {
    const { newId } = params;
    const donation = await deleteNew(newId);
    if (!donation) {
      return {
        status: 404,
        message: "New item not found",
      };
    }

    return {
      status: 200,
      message: "New item deleted",
      data: donation,
    };
  });
