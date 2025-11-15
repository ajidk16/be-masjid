import openapi from "@elysiajs/openapi";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { referenceRoutes } from "./routes/api/references";
import { financeRoutes } from "./routes/api/finance";
import { berandaRoutes } from "./routes/api/beranda";
import staticPlugin from "@elysiajs/static";
import { authController } from "./modules";
import { mosqueRoutes } from "./routes/api/mosque";
import { globalPermissionGuard } from "./lib/shared/permissions";

const app = new Elysia()
  .use(swagger())
  .use(openapi())
  .get("/", () => "Hello Elysia")
  .use(staticPlugin({ assets: "./public", prefix: "/api/v1" }))
  .use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Accept",
        "X-Requested-With",
        "Origin",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
      ],
      credentials: true,
    })
  )

  .group("/api/v1", (app) =>
    app
      .use(authController)
      .onBeforeHandle(globalPermissionGuard)
      // .guard({
      //   beforeHandle: [
      //     async ({ jwt, bearer, status, set }) => {
      //       const token = await jwt.verify(bearer);
      //       if (!token) {
      //         return status(401, {
      //           status: 401,
      //           message: "Missing or invalid token",
      //         });
      //       }

      //       if (token.role !== "admin") {
      //         return status(403, {
      //           status: 403,
      //           message: "Forbidden: You don't have access to this resource",
      //         });
      //       }
      //     },
      //   ],
      // })
      .use(referenceRoutes)
      .use(mosqueRoutes)
      .use(financeRoutes)
      .use(berandaRoutes)
  )
  .compile();

export default app;
