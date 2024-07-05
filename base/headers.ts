export const GenerateBaseHeaders = (): RequestInit => {
  return {
    headers: {
      "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/${
        Math.floor(Math.random() * 1000)
      }.0 (KHTML, like Gecko) Chrome/${
        Math.floor(Math.random() * 100)
      }.0.0.0 Safari/${Math.floor(Math.random() * 1000)}.0.0`,
    },
    mode: "cors",
    cache: "default",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    credentials: "omit",
    method: "GET",
  };
};
