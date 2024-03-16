const degreesToRadians = (degree: number) => {
  return degree * Math.PI / 180;
}

const generateSymbol = (): string => {
  const symbols = ["s1", "s2", "s3", "s4", "s5"];
  const randomIndex = Math.floor(Math.random() * symbols.length);
  return symbols[randomIndex];
}

const mapValues = (value: number, fromLow: number, fromHigh: number, toLow: number, toHigh: number): number => {
  const fromRange = fromHigh - fromLow;
  const toRange = toHigh - toLow;
  const scaledValue = (value - fromLow) / fromRange;
  const mappedValue = scaledValue * toRange + toLow;
  return mappedValue;
}

export {
  degreesToRadians,
  generateSymbol,
  mapValues
}