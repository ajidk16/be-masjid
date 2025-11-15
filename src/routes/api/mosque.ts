import Elysia from "elysia";
import { membersController, mosqueController } from "../../modules";

export const mosqueRoutes = new Elysia({ prefix: "mosques" })
  .use(membersController)
  .use(mosqueController);
