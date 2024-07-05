import { green, red } from "jsr:@std/internal@^1.0.0/styles";
import { ACTIONS_RESULT } from "../../types/actions.d.ts";
import { ValidateData } from "../../lib/validate/index.ts";

const kv = await Deno.openKv();

export const evaluateCronAction = async (
  action: () => Promise<ACTIONS_RESULT>,
) => {
  const actionResult = await action();

  if (actionResult.status === "error") {
    console.error(red("[ACTION ERROR]") + " " + actionResult.message);
    return;
  }

  const actionBody = actionResult.body;

  const validateResult = ValidateData(actionBody);

  if (validateResult.status === "error") {
    console.error(red("[ACTION ERROR]") + " " + validateResult.message);
    return;
  }

  const cachedValidateResultLength = validateResult.body.length;

  for (let i = 0; i < cachedValidateResultLength; i++) {
    const proxy = validateResult.body[i];
    try {
      await kv.set([proxy.ip, proxy.port], proxy);
    } catch (e) {
      console.error(red("[KV ERROR]") + " " + e.message);
      continue;
    }
  }

  console.log(
    green("[ACTION SUCCESS]") + " " + validateResult.body.length +
      " proxies added.",
  );
};

export const createCronActionsHandler = (
  actions: (() => Promise<ACTIONS_RESULT>)[],
) => {
  return async () => {
    for (const action of actions) {
      await evaluateCronAction(action);
    }
  };
};
