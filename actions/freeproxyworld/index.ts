import { DOMParser } from "@deno_dom/wasm";
import { GenerateBaseHeaders } from "../../base/headers.ts";
import {
  ACTIONS_RESULT,
  PROXY_LIST,
  PROXY_PROTOCOLS,
} from "../../types/actions.d.ts";

type ENDPOINT_TYPE =
  `https://www.freeproxy.world/?tcountry=&speed=&port=&page=${number}`;

const GenerateEndpoint = () =>
  `https://www.freeproxy.world/?tcountry=&speed=&port=&page=${
    Math.floor(Math.random() * 210)
  }` as ENDPOINT_TYPE;

const DomParser = new DOMParser();

export async function FreeproxyworldAction(): Promise<ACTIONS_RESULT> {
  const endpoint = GenerateEndpoint();
  const response = await fetch(endpoint, GenerateBaseHeaders());

  if (!response.ok) {
    return {
      status: "error",
      message: response.statusText,
      body: null,
    };
  }

  const data = await response.text();

  const document = DomParser.parseFromString(data, "text/html");

  const rowElements = document.querySelectorAll(
    "body > div[class] > div.proxy-table > table > tbody > tr:nth-child(2n)",
  );

  const proxyList: PROXY_LIST = [];

  const cachedElementsLength = rowElements.length;

  for (let i = 0; i < cachedElementsLength; i++) {
    const rowElement = rowElements[i];
    // @ts-expect-error NOT TYPED WELL
    const ip = String(rowElement.querySelector("td:nth-child(1)").textContent)
      .replaceAll("\n", "");
    const port = Number(
      // @ts-expect-error NOT TYPED WELL

      String(rowElement.querySelector("td:nth-child(2)").textContent),
    );
    const protocols = [
      // @ts-expect-error NOT TYPED WELL

      rowElement.querySelector("td:nth-child(6) > a").textContent.trim(),
    ] as PROXY_PROTOCOLS;
    const country = String(
      // @ts-expect-error NOT TYPED WELL

      rowElement.querySelector("td:nth-child(3) > a").getAttribute("href")
        .replace("/?country=", ""),
    );

    proxyList.push({
      ip,
      port,
      protocol: protocols,
      country,
    });
  }

  try {
    if (proxyList.length > 0) {
      return {
        status: "success",
        message: null,
        body: proxyList,
      };
    }
  } catch (_error) {
    console.log(_error);
    // Do nothing
  }

  return {
    status: "error",
    message: "No data found",
    body: null,
  };
}
