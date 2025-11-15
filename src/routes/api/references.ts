import Elysia from "elysia";
import {
  refDonationsController,
  refOrderStatusController,
  refPaymentStatusController,
  refHalalStatusController,
  refRolesController,
  refPermissionsController,
  refModulesController,
} from "../../modules/references";

export const referenceRoutes = new Elysia({ prefix: "/references" })
  .use(refRolesController)
  .use(refHalalStatusController)
  .use(refDonationsController)
  .use(refPaymentStatusController)
  .use(refOrderStatusController)
  .use(refPermissionsController)
  .use(refModulesController);
