export type PROXY_PROTOCOL = "https" | "http" | "socks4" | "socks5" | "unknown";
export type PROXY_PROTOCOLS = PROXY_PROTOCOL[];

export interface PROXY_INFO {
  ip: string;
  port: number;
  protocol: PROXY_PROTOCOLS;
  country: string;
}

export type PROXY_LIST = PROXY_INFO[];

export type ACTIONS_RESULT = {
  status: "success";
  message: null;
  body: PROXY_LIST;
} | {
  status: "error";
  message: string;
  body: null;
};
