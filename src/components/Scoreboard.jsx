import m from 'mithril';
import ScoreboardCategory from './ScoreboardCategory';
import '../last';
import { categories, sum } from '../categories';

// TODO move into categories file
const categoryNames = {
  aces: 'Aces',
  twos: 'Twos',
  threes: 'Threes',
  fours: 'Fours',
  fives: 'Fives',
  sixes: 'Sixes',
  bonus: 'Bonus',
  threeOfAKind: '3 of a kind',
  fourOfAKind: '4 of a kind',
  chance: 'Chance',
  fullHouse: 'Full House',
  sStraight: 'Sm Straight',
  lStraight: 'Lg Straight',
  yahtzee: 'YAHTZEE',
};
const upper = ['aces', 'twos', 'threes', 'fours', 'fives', 'sixes'];
const lower = ['threeOfAKind', 'fourOfAKind', 'chance', 'fullHouse', 'sStraight', 'lStraight', 'yahtzee'];

export default class Scoreboard {
  view({ attrs: { store } }) {
    const upperSum = sum(upper.map((i) => store.state.score[i] || 0));
    return (
      <div class="flex">
        <div class="mr-1">
          {[
            ...upper.map((c) => ({
              title: categoryNames[c],
              score: store.state.score[c],
              hint: store.state.rolls.last()
                ? categories[c](store.state.rolls.last())
                : null,
              onclick: () => store.actions.score(c, store.state),
            })),
            {
              title: 'Bonus',
              score: upperSum >= 63
                ? 35
                : !upper.some((c) => !(store.state.score[c] > -1))
                  ? 0
                  : undefined,
              hint: upperSum - 63,
            },
            {
              title: 'Total',
              score: store.state.score.total,
            },
          ].map((s) => m(ScoreboardCategory, s))}
        </div>
        <div class="flex-grow">
          {[
            ...lower.map((c) => ({
              title: categoryNames[c],
              score: store.state.score[c],
              hint: store.state.rolls.last()
                ? categories[c](store.state.rolls.last())
                : null,
              onclick: () => store.actions.score(c, store.state),
            })),
            {
              title: 'Ytz. Bonus',
              score: store.state.score.yahtzeeBonus,
            },
          ].map((s) => m(ScoreboardCategory, s))}
        </div>
      </div>
    );
  }
}
