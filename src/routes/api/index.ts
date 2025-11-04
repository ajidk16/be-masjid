import Elysia from "elysia";
import { authController } from "../../modules/auth";

export const apiRoutes = new Elysia({ prefix: "/api/v1" }).use(authController);
