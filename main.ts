import { Hono } from "@hono/hono";

const app = new Hono();

Deno.serve({
  port: 8000,
}, app.fetch);
