import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";

//#region src/index.ts
const app = new Elysia().use(swagger()).get("/", () => "Hello Elysia").compile();
var src_default = app;

//#endregion
export { src_default as default };