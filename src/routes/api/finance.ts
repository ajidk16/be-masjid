import Elysia from "elysia";
import { fundAccountController } from "../../modules/finance/fund-account";

export const financeRoutes = new Elysia({ prefix: "/finance" }).use(
  fundAccountController
);
