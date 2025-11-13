import openapi from "@elysiajs/openapi";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { apiRoutes } from "./routes/api";
import { referenceRoutes } from "./routes/api/references";
import { financeRoutes } from "./routes/api/finance";
import { berandaRoutes } from "./routes/api/beranda";
import staticPlugin from "@elysiajs/static";

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
  .use(apiRoutes)
  .group("/api/v1", (app) =>
    app.use(referenceRoutes).use(financeRoutes).use(berandaRoutes)
  )
  .compile();

export default app;
