const upper = (n) => (roll = []) => roll.filter((r) => r === n).length * n;
// this.upper = n => roll => roll.reduce((a,b)=>b==n?a+b:0,0)

export const sum = (roll = []) => roll.reduce((a, b) => a + b, 0);

export const nOfAKind = (n) => (roll = []) => [1, 2, 3, 4, 5, 6]
  .map((x) => roll.filter((r) => r === x).length)
  .filter((x) => x >= n)
  .length;

export const straight = (n) => (roll = []) => [1, 2, 3, 4, 5, 6]
  .map((i) => (roll.indexOf(i) !== -1 ? 1 : 0))
  .join('')
  .indexOf(new Array(n + 1).join(1)) !== -1;

export const categories = {
  aces: upper(1),
  twos: upper(2),
  threes: upper(3),
  fours: upper(4),
  fives: upper(5),
  sixes: upper(6),
  threeOfAKind: (roll = []) => (nOfAKind(3)(roll) ? sum(roll) : 0),
  fourOfAKind: (roll = []) => (nOfAKind(4)(roll) ? sum(roll) : 0),
  chance: sum,
  fullHouse: (roll = []) => ([1, 2, 3, 4, 5, 6]
    .map((n) => roll.filter((r) => r === n).length)
    .filter((x) => x < 4 && x > 1)
    .reduce((a, b) => a + b, 0) === 5
    || nOfAKind(5)(roll) ? 25 : 0),
  sStraight: (roll = []) => (straight(4)(roll) || nOfAKind(5)(roll) ? 40 : 0),
  lStraight: (roll = []) => (straight(5)(roll) || nOfAKind(5)(roll) ? 50 : 0),
  yahtzee: (roll = []) => (nOfAKind(5)(roll) ? 50 : 0),
  bonus: () => 0,
};
