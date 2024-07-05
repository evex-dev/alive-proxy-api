import { GenerateBaseHeaders } from "../../base/headers.ts";
import { ACTIONS_RESULT, PROXY_LIST } from "../../types/actions.d.ts";
import { DOMParser } from "@deno_dom/wasm";
import { parseScript } from "./parseScript.ts";

type PAGE_RANGE = number;

type ENDPOINT_TYPE =
  `https://www.cybersyndrome.net/search.cgi?q=&a=ABCD&f=l&s=ip&n=500&p=${PAGE_RANGE}`;

const GenerateEndpoint = () =>
  ("https://www.cybersyndrome.net/search.cgi?q=&a=ABCD&f=l&s=ip&n=500&p=" +
    Math.floor(Math.random() * 2)) as ENDPOINT_TYPE;

const DomParser = new DOMParser();

export async function CybersyndromeAction(): Promise<ACTIONS_RESULT> {
  const endpoint = GenerateEndpoint();
  const response = await fetch(endpoint, GenerateBaseHeaders(endpoint));

  if (!response.ok) {
    return {
      status: "error",
      message: response.statusText,
      body: null,
    };
  }

  const data = await response.text();
  const document = DomParser.parseFromString(data, "text/html");

  const scripts = document.querySelectorAll("script");
  let scriptContent = "";

  for (const script of scripts) {
    if (
      script.textContent.includes("var ") && script.textContent.includes("<!--")
    ) {
      scriptContent = script.textContent;
      break;
    }
  }

  if (scriptContent === "") {
    return {
      status: "error",
      message: "Cant find script content",
      body: null,
    };
  }

  const parsedInfo = await parseScript(scriptContent);

  if (parsedInfo.length === 0) {
    return {
      status: "error",
      message: "Cant find parsed info",
      body: null,
    };
  }

  const proxyList: PROXY_LIST = [];

  const proxyElements = document.querySelectorAll(
    "#div_result > ul > li:nth-child(n) > a",
  );

  const cachedElementsLength = proxyElements.length;
  for (let i = 0; i < cachedElementsLength; i++) {
    const element = proxyElements[i];

    const label = parsedInfo[i];
    if (!label.includes(":")) {
      continue;
    }
    proxyList.push({
      ip: label.split(":")[0],
      port: Number(label.split(":")[1]),
      protocol: ["http"],
      country:
        // @ts-expect-error NOT TYPED WELL
        (element.getAttribute("onmouseover") ?? "").replace("s('", "").split(
          "',",
        )[0],
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
    // Do nothing
  }

  return {
    status: "error",
    message: "No data found",
    body: null,
  };
}
