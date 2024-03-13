const degreesToRadians = (degree: number) => {
  return degree * Math.PI / 180;
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
  mapValues
}