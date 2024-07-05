import { Hono } from "@hono/hono";
import "./crons/getProxyList/index.ts";
import { PROXY_LIST } from "./types/actions.d.ts";

const app = new Hono();
const kv = await Deno.openKv();

app.get("/", async (c) => {
  const proxyListIter = await kv.list({ prefix: [] });
  const proxyList: PROXY_LIST = [];

  for await (const proxy of proxyListIter) {
    proxyList.push(proxy.value as PROXY_LIST[number]);
  }

  return c.json(proxyList);
});

Deno.serve({
  port: 8000,
  onListen: () => {},
}, app.fetch);
