type Match = {
  symbol: string;
  color: string;
  sequence: number[]; // Stores the indices of drums in the sequence
  positions: Array<{ drum: number; index: number }>; // Detailed positions of the symbol in each drum
};

// a list of nice colours to use that I don't think we'll use anywhere else
const colours = [
  "0x3C7080",
  "0x4D468E",
  "0x7A687F",
  "0xD2AA61",
  "0xFAEB2D",
  "0xEE1800"
];

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
      positions: [ 0, 1, 2],
      sequence: [ 0, 2, 1 ],
      symbol: "s1"
    },
    {
      positions: [ 0, 0, 0],
      sequence: [ 2, 3, 4 ]
      symbol: "s4"
    }
  ]

*/

// Finds all indices of a symbol within a drum
function indexOfAll(array: string[], searchItem: string): number[] {
  let indices = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i] === searchItem) {
      indices.push(i);
    }
  }
  return indices;
}

function exploreSequences(
  drumIndex: number,
  symbol: string,
  currentSequence: number[],
  currentPositions: Array<{ drum: number; index: number }>,
  arr: string[][],
  matches: Match[]
) {
  const nextDrumIndex = drumIndex + 1;

  // Determine if the current sequence can be considered complete
  const canRecordSequence = (currentSequence: number[], arr: string[][]): boolean => {
    // Check if the sequence starts from the first drum or if the symbol is not present in the previous drum
    const startingDrumIndex = currentSequence[0];
    if (startingDrumIndex === 0 || !arr[startingDrumIndex - 1].includes(symbol)) {
      return true; // Sequence can be recorded
    }
    return false; // Sequence should not be recorded
  };

  if (nextDrumIndex < arr.length) {
    const nextDrumPositions = indexOfAll(arr[nextDrumIndex], symbol);
    if (nextDrumPositions.length > 0) {
      nextDrumPositions.forEach(position => {
        exploreSequences(
          nextDrumIndex,
          symbol,
          currentSequence.concat(nextDrumIndex),
          currentPositions.concat({ drum: nextDrumIndex, index: position }),
          arr,
          matches
        );
      });
    } else {
      // If no continuation in the next drum and the sequence is long enough, check if it can be recorded
      if (currentSequence.length >= 3 && canRecordSequence(currentSequence, arr)) {
        matches.push({ symbol, sequence: currentSequence, positions: currentPositions, color: colours[Math.floor(Math.random() * colours.length)] });
      }
    }
  } else {
    // Reached the end of the drums; if the sequence is long enough, check if it can be recorded
    if (currentSequence.length >= 3 && canRecordSequence(currentSequence, arr)) {
      matches.push({ symbol, sequence: currentSequence, positions: currentPositions, color: colours[Math.floor(Math.random() * colours.length)] });
    }
  }
}

function WinningSets(arr: string[][]): Match[] {
  let matches: Match[] = [];

  arr.forEach((drum, drumIndex) => {
    drum.forEach((symbol, index) => {
      // Start a new sequence from each symbol in each drum
      const initialPosition = { drum: drumIndex, index };
      exploreSequences(drumIndex, symbol, [drumIndex], [initialPosition], arr, matches);
    });
  });

  // Deduplicate matches to ensure uniqueness
  return matches.filter((match, index, self) =>
    index === self.findIndex(m =>
      m.symbol === match.symbol &&
      JSON.stringify(m.sequence) === JSON.stringify(match.sequence) &&
      JSON.stringify(m.positions) === JSON.stringify(match.positions)
    )
  );
}

export { WinningSets };
