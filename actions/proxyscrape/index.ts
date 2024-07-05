import { GenerateBaseHeaders } from "../../base/headers.ts";
import {
  ACTIONS_RESULT,
  PROXY_PROTOCOL,
} from "../../types/actions.d.ts";

type ENDPOINT_TYPE =
  `https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&proxy_format=protocolipport&format=json`;

const GenerateEndpoint = () =>
  "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&proxy_format=protocolipport&format=json" as ENDPOINT_TYPE;

type RESPONSE_DATA = {
  "shown_records": number;
  "total_records": number;
  "limit": number;
  "skip": number;
  "nextpage": boolean;
  "proxies": {
    "alive": boolean;
    "alive_since": number;
    "anonymity": string;
    "average_timeout": number;
    "first_seen": number;
    "ip_data": {
      "as": string;
      "asname": string;
      "city": string;
      "continent": string;
      "continentCode": string;
      "country": string;
      "countryCode": string;
      "district": string;
      "hosting": boolean;
      "isp": string;
      "lat": number;
      "lon": number;
      "mobile": boolean;
      "org": string;
      "proxy": boolean;
      "regionName": string;
      "status": string;
      "timezone": string;
      "zip": string;
    } | null;
    "ip_data_last_update": number;
    "last_seen": number;
    "port": number;
    "protocol": PROXY_PROTOCOL;
    "proxy": `${PROXY_PROTOCOL}://${string}:${number}`;
    "ssl": boolean;
    "timeout": number;
    "times_alive": number;
    "times_dead": number;
    "uptime": number;
    "ip": string;
  }[];
};

export async function ProxyscrapeAction(): Promise<ACTIONS_RESULT> {
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
    if (data.proxies.length > 0) {
      return {
        status: "success",
        message: null,
        body: data.proxies.map((proxy) => {
          let country = "XX";
          if ("ip_data" in proxy) {
            country = proxy.ip_data!.country;
          }
          return ({
            ip: proxy.ip,
            port: Number(proxy.port),
            protocol: [proxy.protocol],
            country,
          });
        }),
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
