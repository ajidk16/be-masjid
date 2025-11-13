import Elysia from "elysia";
import {
  createMediaPhoto,
  deleteMediaPhoto,
  getMediaPhotoById,
  listMediaPhotos,
  updateMediaPhoto,
} from "./service";
import {
  createMediaPhotoBody,
  listMediaPhotoQuery,
  updateMediaPhotoBody,
} from "./model";
import sharp from "sharp";

export const mediaPhotosController = new Elysia({ prefix: "/media-photos" })
  .post(
    "/",
    async ({ body: { mosqueId, photos } }) => {
      let finalPhotoUrls: string = "";
      const buffer = await photos.arrayBuffer();

      const webpBuffer = await sharp(Buffer.from(buffer)).webp().toBuffer();

      if (photos) {
        const fileName = `${Date.now()}-${photos.name.toLowerCase().split(" ").join("-").split(".")[0]}.webp`;
        await Bun.write(`./public/media-photos/${fileName}`, webpBuffer);
        finalPhotoUrls = `/media-photos/${fileName}`;
      }

      const newMediaPhoto = await createMediaPhoto(
        mosqueId,
        photos.name,
        finalPhotoUrls
      );

      return {
        status: 200,
        message: "Fund Account created",
        data: newMediaPhoto,
      };
    },
    {
      body: createMediaPhotoBody,
    }
  )
  .get(
    "/",
    async ({ query: { page, limit, search } }) => {
      const offset = (Number(page) - 1) * Number(limit);
      const searchTerm = search?.toLowerCase() || "";

      const { eventList, total } = await listMediaPhotos({
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
      query: listMediaPhotoQuery,
    }
  )
  .put(
    "/:mediaPhotoId",
    async ({ params, body: { mosqueId, photos }, status }) => {
      const { mediaPhotoId } = params;
      if (!mediaPhotoId) {
        return status(400, {
          status: 400,
          message: "Media Photo ID is required",
        });
      }

      const findMediaPhoto = await getMediaPhotoById(mediaPhotoId);
      if (!findMediaPhoto) {
        return status(404, {
          status: 404,
          message: "Media Photo not found",
        });
      }

      let finalPhotoUrls: string = "";
      if (photos) {
        const fileName = `${Date.now()}-${photos.name.toLowerCase().split(" ").join("-").split(".")[0]}.webp`;
        if (findMediaPhoto.url) {
          const oldFilePath = `./public${findMediaPhoto.url}`;
          await Bun.file(oldFilePath).delete();
        }
        const buffer = await photos.arrayBuffer();

        const webpBuffer = await sharp(Buffer.from(buffer)).webp().toBuffer();

        await Bun.write(`./public/media-photos/${fileName}`, webpBuffer);
        finalPhotoUrls = `/media-photos/${fileName}`;
      } else {
        finalPhotoUrls = findMediaPhoto.url;
      }

      const updatedMediaPhoto = await updateMediaPhoto(
        mediaPhotoId,
        mosqueId,
        photos ? photos.name : findMediaPhoto.title?.toString(),
        finalPhotoUrls
      );
      return {
        status: 200,
        message: "Fund Account updated",
        data: updatedMediaPhoto,
      };
    },
    {
      body: updateMediaPhotoBody,
    }
  )
  .get("/:mediaPhotoId", async ({ params }) => {
    const { mediaPhotoId } = params;
    // For demonstration, returning a mock mosque object
    const mosque = await getMediaPhotoById(mediaPhotoId);
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
  .delete("/:mediaPhotoId", async ({ params }) => {
    const { mediaPhotoId } = params;
    const donation = await deleteMediaPhoto(mediaPhotoId);
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
