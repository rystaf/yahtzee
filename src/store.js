import m from 'mithril';
import merge from 'mergerino';
import stream from 'mithril/stream';
import { categories, nOfAKind, sum } from './categories';

const scoreService = ({ scores }) => {
  let yahtzees = -1;
  const score = Object.keys(categories).reduce((x, i) => {
    const roll = (scores[i] || { rolls: [[]] }).rolls.last();
    if (nOfAKind(5)(roll)) yahtzees += 1;
    return {
      ...x,
      [i]: roll.length
        ? categories[i](roll)
        : undefined,
    };
  }, {});
  score.yahtzeeBonus = score.yahtzee ? yahtzees * 100 : 0;
  score.bonus = sum(['aces', 'twos', 'threes', 'fours', 'fives', 'sixes'].map((i) => score[i] || 0)) >= 63 ? 35 : 0;
  score.total = Object.keys(score).reduce((a, b) => (score[b] || 0) + a, 0);
  return { score };
};

const spinningEffect = (actions) => (state) => {
  if (state.spinning) {
    setTimeout(() => {
      actions.spun();
      m.redraw();
    }, 1000);
  }
};

const localstorageEffect = () => (state) => {
  localStorage.setItem('state', JSON.stringify(state));
};

const initial = {
  turn: 0,
  order: [],
  rolls: [],
  keeps: [],
  scores: {},
  score: {},
  spinning: false,
};
const services = [scoreService];
const Actions = (u) => ({
  nextTurn: () => u({ turn: (x) => (x + 1) }),
  roll: (state) => {
    // Don't roll on 3rd turn
    if (!state.rolls.length || !state.order) u({ order: () => [0, 1, 2, 3, 4] });
    if (state.rolls.length > 2) return false;
    // Don't roll if all dice are kept
    if ((state.keeps.last() || []).filter((x) => x).length === 5) return false;
    u({ spinning: true });
    // First roll
    if (state.rolls.length === 0) {
      state.rolls.push([...Array(5)].map(() => (Math.floor(Math.random() * 6) + 1)));
      return u({
        keeps: (k) => [...k, [...Array(5)].map(() => false)],
      });
    }
    return u({
      keeps: (k) => [...k, state.keeps.last()],
      rolls: (r) => [...r, state.rolls.last().map((x, i) => (
        state.keeps.last()[i]
          ? x
          : (Math.floor(Math.random() * 6) + 1)
      ))],
    });
  },
  putkeep: (choice, state) => {
    const keeps = state.keeps[state.rolls.length - 1];
    if (state.rolls.length > 2
      || !(0 <= choice <= 5) // eslint-disable-line yoda
      || !keeps
      || !keeps.length) return false;
    return u({
      keeps: (k) => k.map((v, i, s) => (i === (s.length - 1)
        ? v.map((d, di) => (di === choice ? !d : d))
        : v
      )),
    });
  },
  score: (category, state) => {
    if (!category) return state.score;
    if (!state.rolls.length) return false;
    if (Object.keys(categories).indexOf(category) === -1) return false;
    return u({
      turn: (t) => (t + 1),
      scores: (scores) => ({
        ...scores,
        [category]: {
          rolls: state.rolls,
          keeps: state.keeps,
          timestamp: new Date(),
        },
      }),
      rolls: [],
      keeps: [],
      spinning: false,
    });
  },
  sortToggle: () => u({ sort: (x) => !x }),
  sort: (rolls) => u({
    order: () => rolls
      .map((v, i) => ({ v, i }))
      .sort((a, b) => (a.v - b.v))
      .map((x) => x.i),
  }),
  swap: (ins, del, dragged) => u((state) => {
    const order = [...state.order];
    order.splice(ins, 0, order[dragged]);
    order.splice(del, 1);
    return {
      ...state,
      order,
    };
  }),
  spun: () => u({ spinning: false }),
  newGame: () => u({
    order: [],
    turn: 0,
    rolls: [],
    keeps: [],
    scores: () => ({}),
    score: () => ({}),
    spinning: false,
  }),
});
const Effects = (_update, actions) => [
  spinningEffect(actions),
  localstorageEffect(),
];
const runServices = (startingState) => services.reduce(
  (state, service) => merge(state, service(state)),
  startingState,
);
const update = stream();
export const states = stream.scan(
  (state, patch) => runServices(merge(state, patch)),
  JSON.parse(localStorage.getItem('state')) || initial,
  update,
);
export const actions = Actions(update);
export const effects = Effects(update, actions);

states.map((state) => effects.forEach((effect) => effect(state)));
