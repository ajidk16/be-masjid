import Elysia from "elysia";
import {
  authController,
  membersController,
  mosqueController,
} from "../../modules";

export const apiRoutes = new Elysia({ prefix: "/api/v1" })
  .use(authController)
  .use(membersController)
  .use(mosqueController);
