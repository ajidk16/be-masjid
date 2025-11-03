import { Elysia } from "elysia";

//#region src/index.d.ts
declare const app: Elysia<"", {
  decorator: {};
  store: {};
  derive: {};
  resolve: {};
}, {
  typebox: {};
  error: {};
} & {
  typebox: {};
  error: {};
}, {
  schema: {};
  standaloneSchema: {};
  macro: {};
  macroFn: {};
  parser: {};
  response: {};
} & {
  schema: {};
  standaloneSchema: {};
  macro: {};
  macroFn: {};
  parser: {};
}, {
  get: {
    body: unknown;
    params: {};
    query: unknown;
    headers: unknown;
    response: {
      200: string;
    };
  };
}, {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
  response: {};
}, {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
  response: {};
} & {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
}>;
//#endregion
export { app as default };