import { PROXY_LIST } from "../../types/actions.d.ts";
import { VALIDATE_RESULT } from "./index.d.ts";

export function ValidateData(data: PROXY_LIST): VALIDATE_RESULT {
  const cachedLength = data.length;
  const validatedData: PROXY_LIST = [];

  for (let i = 0; i < cachedLength; i++) {
    if (
      !data[i].ip ||
      !data[i].port ||
      !data[i].protocol ||
      !data[i].country
    ) {
      continue;
    }

    if (typeof data[i].ip !== "string") {
      continue;
    } else if (
      !data[i].ip.match(
        /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
      )
    ) {
      continue;
    }

    if (typeof data[i].port !== "number") {
      continue;
    } else if (data[i].port < 1 || data[i].port > 65535) {
      continue;
    }

    const cachedProtocolLength = data[i].protocol.length;
    let isProtocolValid = true;

    for (let j = 0; j < cachedProtocolLength; j++) {
      if (
        data[i].protocol[j] !== "https" &&
        data[i].protocol[j] !== "http" &&
        data[i].protocol[j] !== "socks4" &&
        data[i].protocol[j] !== "socks5" &&
        data[i].protocol[j] !== "unknown"
      ) {
        isProtocolValid = false;
        break;
      }
    }

    if (!isProtocolValid) {
      continue;
    }

    if (typeof data[i].country !== "string") {
      continue;
    } else if (!data[i].country.match(/^[A-Z]{2}$/)) {
      continue;
    }

    validatedData.push(data[i]);
  }

  if (validatedData.length === 0) {
    return {
      status: "error",
      message: "Empty data",
      body: null,
    };
  }

  return {
    status: "success",
    message: null,
    body: validatedData,
  };
}
