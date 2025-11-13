import Elysia from "elysia";
import {
  eventsController,
  mediaPhotosController,
  newsController,
} from "../../modules";

export const berandaRoutes = new Elysia({ prefix: "/beranda" })
  .use(newsController)
  .use(eventsController)
  .use(mediaPhotosController);
