import openapi from "@elysiajs/openapi";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { authController } from "./modules/auth";
import cors from "@elysiajs/cors";
import { apiRoutes } from "./routes/api";

const app = new Elysia()
  .use(swagger())
  .use(openapi())
  .get("/", () => "Hello Elysia")
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
  .compile();

export default app;
