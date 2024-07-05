export async function parseScript(scriptContent: string): Promise<string[]> {
  const arraySplit = scriptContent.split("=[");
  arraySplit.shift();

  const addressBefore = arraySplit[0].split("]").shift();

  if (!addressBefore) {
    return [];
  }

  const addressList = addressBefore.split(",").map((address) =>
    Number(address.trim())
  );

  arraySplit.shift();

  const portBefore = arraySplit[0].split("];var ").shift();

  if (!portBefore) {
    return [];
  }

  const portList = portBefore.split(",").map((port) => Number(port.trim()));

  const dynamicBefore = arraySplit[0].split("];").shift();

  if (!dynamicBefore) {
    return [];
  }

  const dynamicBaseBefore = dynamicBefore.split(";").shift();

  if (!dynamicBaseBefore) {
    return [];
  }

  const dynamicBaseBefore2 = dynamicBaseBefore.split("n=").pop();

  if (!dynamicBaseBefore2) {
    return [];
  }

  if (!/[()0-9a-zA-Z\[\]+*%\/\-]+/.test(dynamicBaseBefore2)) {
    return [];
  }

  const evalString = `(ps) => ${dynamicBaseBefore2}`;

  const workerPath = new URL("./sandbox.ts", import.meta.url).href;
  const worker = new Worker(workerPath, { type: "module" });

  worker.postMessage({ evalString, portList });

  let base: number = -1;

  worker.onmessage = ({ data }: { data: number }) => {
    base = data;
  };

  let antiEndlessLoop = 0;

  while (base === -1) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    antiEndlessLoop++;
    if (antiEndlessLoop > 100) {
      return [];
    }
  }

  const addressList2 = addressList.concat(addressList.splice(0, base));

  const addrs = [];

  const cachedAddrsListLength = addressList2.length;

  for (let i = 0; i < cachedAddrsListLength; i++) {
    const idx = Math.floor(i / 4);
    if (i % 4 == 0) addrs[idx] = addressList2[i] + ".";
    else if (i % 4 == 3) addrs[idx] += addressList2[i];
    else addrs[idx] += addressList2[i] + ".";
  }

  for (let i = 0; i < portList.length; i++) {
    addrs[i] += ":" + portList[i];
  }

  return addrs;
}
