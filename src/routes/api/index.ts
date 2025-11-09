import Elysia from "elysia";
import { authController } from "../../modules/auth";
import { mosqueController } from "../../modules/mosques";

export const apiRoutes = new Elysia({ prefix: "/api/v1" })
  .use(authController)
  .use(mosqueController);
