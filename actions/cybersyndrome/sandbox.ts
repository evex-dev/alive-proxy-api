/// <reference lib="deno.worker" />
self.onmessage = ({ data }: {
  data: {
    evalString: string;
    portList: number[];
  };
}) => {
  const base: number = new Function(data.evalString)(data.portList);

  self.postMessage(base);

  self.close();
};
