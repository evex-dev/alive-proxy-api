import { assertEquals } from "@std/assert";
import { ValidateData } from "./index.ts";
import { PROXY_LIST } from "../../types/actions.d.ts";

const sampleData = [
  {
    ip: "171.243.26.71",
    port: 5307,
    protocol: ["socks5"],
    country: "VN",
  },
  {
    ip: "92.255.190.41",
    port: 4153,
    protocol: ["socks4"],
    country: "RU",
  },
] as PROXY_LIST;

Deno.test("Validate Data Testing with success", () => {
    const validateResult = ValidateData(sampleData);
    assertEquals(validateResult.body, sampleData);
    assertEquals(validateResult.message, null);
    assertEquals(validateResult.status, "success");
});

const sampleData2 = [
  {
    ip: "x.xxx.x.xxx",
    port: 1919,
    protocol: ["socks5"],
    country: "VN",
  },
  {
    ip: "171.243.26.71",
    port: 114514,
    protocol: ["socks5"],
    country: "VN",
  },
  {
    ip: "17.21.144.1",
    port: 4545,
    protocol: ["xxxxx"],
    country: "VN",
  },
  {
    ip: "171.243.26.71",
    port: 5307,
    protocol: ["socks5"],
    country: "XXX",
  }
] as PROXY_LIST;

Deno.test("Validate Data Testing with error", () => {
  const validateResult = ValidateData(sampleData2);
  assertEquals(validateResult.body, null);
  assertEquals(validateResult.message, "Empty data");
  assertEquals(validateResult.status, "error");
})