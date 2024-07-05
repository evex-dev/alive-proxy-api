export const GenerateBaseHeaders = (url?: string): RequestInit => {
  return {
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${
        Math.floor(Math.random() * 1000)
      }.0 (KHTML, like Gecko) Chrome/${
        Math.floor(Math.random() * 100)
      }.0.0.0 Safari/${Math.floor(Math.random() * 1000)}.0.0`,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language":
        "ja-JP,ja;q=0.9,ar-SS;q=0.8,ar;q=0.7,en-US;q=0.6,en;q=0.5,ko-KR;q=0.4,ko;q=0.3",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      Host: "www.cybersyndrome.net",
      Pragma: "no-cache",
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "none",
      "Sec-Fetch-User": "?1",
      "Upgrade-Insecure-Requests": "1",
      "sec-ch-ua":
        'Not/A)Brand";v="8", "Chromium";v="100", "Google Chrome";v="100',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
    },
    mode: "cors",
    redirect: "follow",
    credentials: "omit",
    method: "GET",
    referrer: url ?? "https://google.com",
  };
};
