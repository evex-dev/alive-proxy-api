import { CybersyndromeAction } from "../../actions/cybersyndrome/index.ts";
import { ProxyscrapeAction } from "../../actions/proxyscrape/index.ts";
import { FreeproxyworldAction } from "../../actions/freeproxyworld/index.ts";
import { AdvancednameAction } from "../../actions/advancedname/index.ts";
import { GeonodeAction } from "../../actions/geonode/index.ts";
import { createCronActionsHandler } from "./utils.ts";
import { bgGreen } from "jsr:@std/internal@^1.0.0/styles";

const fastRefreshCronActions = [
  CybersyndromeAction,
  FreeproxyworldAction,
  GeonodeAction,
];

const slowRefreshCronActions = [
  AdvancednameAction,
  ProxyscrapeAction,
];

const fastRefreshCronActionsHandler = createCronActionsHandler(
  fastRefreshCronActions,
);
const slowRefreshCronActionsHandler = createCronActionsHandler(
  slowRefreshCronActions,
);

await (async () => {
  console.log(bgGreen("[ACTION DRY-RUN] Fast Refresh"));
  await fastRefreshCronActionsHandler();
  console.log(bgGreen("[ACTION DRY-RUN] Slow Refresh"));
  await slowRefreshCronActionsHandler();
})();

Deno.cron("get proxy list for fast refresh", {
  minute: 30
}, async () => {
  console.log(bgGreen("[ACTION RUNNING] Fast Refresh"));
  await fastRefreshCronActionsHandler();
});

Deno.cron("get proxy list for slow refresh", {
  hour: 2
}, async () => {
  console.log(bgGreen("[ACTION RUNNING] Slow Refresh"));
  await slowRefreshCronActionsHandler();
});
