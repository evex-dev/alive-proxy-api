import { Hono } from "@hono/hono";
import { AdvancednameAction } from "./actions/advancedname/index.ts";

const app = new Hono();

console.log(await AdvancednameAction());

Deno.serve({
  port: 8000,
}, app.fetch);
