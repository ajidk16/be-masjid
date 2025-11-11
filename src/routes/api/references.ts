import Elysia from "elysia";
import {
  refDonationsController,
  refOrderStatusController,
  refPaymentStatusController,
  refHalalStatusController,
  refRolesController,
} from "../../modules/referensi";

export const referenceRoutes = new Elysia({ prefix: "/references" })
  .use(refRolesController)
  .use(refHalalStatusController)
  .use(refDonationsController)
  .use(refPaymentStatusController)
  .use(refOrderStatusController);
