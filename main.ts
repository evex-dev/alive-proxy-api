import { Hono } from "@hono/hono";
import { CybersyndromeAction } from "./actions/cybersyndrome/index.ts";

const app = new Hono();

console.log(await CybersyndromeAction());

Deno.serve({
  port: 8000,
}, app.fetch);
