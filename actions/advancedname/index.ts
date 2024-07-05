import { DOMParser, Node } from "@deno_dom/wasm";
import { GenerateBaseHeaders } from "../../base/headers.ts";
import { ACTIONS_RESULT, PROXY_LIST, PROXY_PROTOCOLS } from "../../types/actions.d.ts";

type ENDPOINT_TYPE =
    `https://advanced.name/freeproxy?page=${number}`;

const GenerateEndpoint = () =>
    `https://advanced.name/freeproxy?page=${Math.floor(Math.random() * 4)}` as ENDPOINT_TYPE;

const DomParser = new DOMParser();

export async function AdvancednameAction(): Promise<ACTIONS_RESULT> {
    const endpoint = GenerateEndpoint();
    const response = await fetch(endpoint, GenerateBaseHeaders());

    if (!response.ok) {
        return {
            status: "error",
            message: response.statusText,
            body: null,
        };
    }

    const data = (await response.text());

    const document = DomParser.parseFromString(data, "text/html");

    const rowElements = document.querySelectorAll("#table_proxies > tbody > tr:nth-child(n)")

    const proxyList: PROXY_LIST = [];

    const cachedElementsLength = rowElements.length;

    for (let i = 0; i < cachedElementsLength; i++) {
        const rowElement = rowElements[i];
        // @ts-expect-error NOT TYPED WELL
        const ip = atob(String(rowElement.querySelector("td:nth-child(2)").getAttribute("data-ip")));
        // @ts-expect-error NOT TYPED WELL
        const port = Number(atob(String(rowElement.querySelector("td:nth-child(3)").getAttribute("data-port"))));
        // @ts-expect-error NOT TYPED WELL
        const protocolElements: Node[] = [...rowElement.querySelectorAll("td:nth-child(4) > a")];
        const protocols = protocolElements.map((protocolElement: Node) => {
            const protocol = protocolElement.textContent.toLowerCase();
            if (protocol === "https") {
                return "https";
            } else if (protocol === "http") {
                return "http";
            } else if (protocol === "socks4") {
                return "socks4";
            } else if (protocol === "socks5") {
                return "socks5";
            } else {
                return null;
            }
        }).filter(protocol => protocol !== null) as PROXY_PROTOCOLS
        // @ts-expect-error NOT TYPED WELL
        const country = String((rowElement.querySelector("td:nth-child(5) > a") ?? {
            textContent: "XX",
        }).textContent);

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
