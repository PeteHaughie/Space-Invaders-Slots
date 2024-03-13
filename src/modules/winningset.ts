type Match = {
  symbol: string;
  sequence: number[];
  positions: number[];
};

/*

  Example array:
  [
    [1, 2, 5],
    [3, 3, 1],
    [4, 1, 2],
    [4, 2, 5],
    [4, 5, 1]
  ];

  Example return:
  [
    {
      length: 3,
      positions: [ 0, 1, 2],
      sequence: [ 0, 2, 1 ],
      symbol: "s1"
    },
    {
      length: 3,
      positions: [ 0, 0, 0],
      sequence: [ 2, 3, 4 ]
      symbol: "s4"
    }
  ]

*/

function WinningSets(arr: string[][]): Match[] {
  const matches: Match[] = [];

  arr.forEach((drum, drumIndex) => {
    if (drumIndex < arr.length - 2) { // Stop at the third drum because if it's not a match by now, it can't be part of a winning set
      drum.forEach((symbol, symbolIndex) => {
        let matchSequence: number[] = [drumIndex];
        let matchPositions: number[] = [symbolIndex];
        for (let nextDrumIndex = drumIndex + 1; nextDrumIndex < arr.length; nextDrumIndex++) {
          const nextDrum = arr[nextDrumIndex];
          const foundIndex = nextDrum.findIndex(s => s === symbol);

          if (foundIndex !== -1) {
            matchSequence.push(nextDrumIndex);
            matchPositions.push(foundIndex);
            if (matchSequence.length > 2) {
              console.log(`
                matchSequence: ${matchSequence}
                symbol: ${symbol}
              `);
            }
          } else {
            break; // Stop if no contiguous match is found
          }
        }

        // Only record matches that span more than two drums
        if (matchSequence.length > 2) {
          const matchFound = matches.find(m => m.symbol === symbol && JSON.stringify(m.sequence) === JSON.stringify(matchSequence));
          if (!matchFound) {
            matches.push({ symbol, sequence: matchSequence, positions: matchPositions});
          }
        }
      });
    }
  });

  return matches;
}

export { WinningSets };
