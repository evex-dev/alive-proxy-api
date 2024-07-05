import { GenerateBaseHeaders } from "../base/headers.ts";
import { ACTIONS_RESULT, PROXY_PROTOCOLS } from "../types/actions.d.ts";

type PAGE_RANGE = number;

type ENDPOINT_TYPE =
  `https://proxylist.geonode.com/api/proxy-list?limit=500&page=${PAGE_RANGE}`;

const GenerateEndpoint = () =>
  ("https://proxylist.geonode.com/api/proxy-list?limit=500&page=" +
    Math.floor(Math.random() * 13)) as ENDPOINT_TYPE;

type RESPONSE_DATA = {
  data: {
    "_id": string;
    "ip": string;
    "port": string;
    "anonymityLevel": string;
    "asn": string;
    "city": string;
    "country": string;
    "created_at": string;
    "google": boolean;
    "isp": string;
    "lastChecked": number;
    "latency": number;
    "org": string;
    "protocols": PROXY_PROTOCOLS;
    "region": unknown;
    "responseTime": number;
    "speed": number;
    "updated_at": string;
    "workingPercent": unknown;
    "upTime": number;
    "upTimeSuccessCount": number;
    "upTimeTryCount": number;
  }[];
  total: number;
  page: PAGE_RANGE;
  limit: 500;
};

export async function GeonodeAction(): Promise<ACTIONS_RESULT> {
  const endpoint = GenerateEndpoint();
  const response = await fetch(endpoint, GenerateBaseHeaders());

  if (!response.ok) {
    return {
      status: "error",
      message: response.statusText,
      body: null,
    };
  }

  const data = (await response.json()) as RESPONSE_DATA;
  try {
    if (data.data.length > 0) {
      return {
        status: "success",
        message: null,
        body: data.data.map((proxy) => ({
          ip: proxy.ip,
          port: Number(proxy.port),
          protocol: proxy.protocols,
          country: proxy.country,
        })),
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
