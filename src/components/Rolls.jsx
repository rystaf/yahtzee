import m from 'mithril';
import classNames from 'classnames';
import '../last';
import Die from './Die';

export default class Rolls {
  view({ attrs: { store: { state, actions } } }) {
    const keeps = state.keeps.last() || [];
    this.dice = (state.rolls.last() || [0, 0, 0, 0, 0]).map((d, i) => ({ d, i })).map((r) => (
      <div
        key={r.i}
        data-value={r.d}
        data-index={r.i}
        draggable={!state.sort}
        ondragend={() => {
          if (state.order.indexOf(r.i) === this.start) {
            actions.putkeep(r.i, state);
          }
        }}
        ondragstart={(e) => {
          e.dataTransfer.setData('text', 'FF Hack');
          this.start = state.order.indexOf(r.i);
          this.drag = r.i;
        }}
        ontouchstart={() => {
          this.start = state.order.indexOf(r.i);
          this.drag = r.i;
        }}
        ontouchmove={({ changedTouches: c }) => {
          const x = c[0].clientX;
          for (const d of document.getElementsByClassName('die')) {
            const { left, right } = d.getBoundingClientRect();
            if (left < x && x < right) {
              if (this.drag > -1) {
                const drag = state.order.indexOf(this.drag);
                const drop = state.order.indexOf(Number(d.parentNode.attributes['data-index'].value));
                const ins = drag < drop ? drop + 1 : drop;
                const del = drag > drop ? drag + 1 : drag;
                if (ins !== del) {
                  state.order.splice(ins, 0, state.order[drag]);
                  state.order.splice(del, 1);
                }
              }
            }
          }
        }}
        ondragover={() => {
          if (this.drag > -1) {
            console.log(this.drag, r.i);
            const drag = state.order.indexOf(this.drag);
            const drop = state.order.indexOf(r.i);
            const ins = drag < drop ? drop + 1 : drop;
            const del = drag > drop ? drag + 1 : drag;
            if (ins !== del) {
              state.order.splice(ins, 0, state.order[drag]);
              state.order.splice(del, 1);
            }
          }
        }}
        class={classNames(
          'select-none px-05 bg-white h-10 stroke-current shadow-md rounded-lg border-2 lg:border-3',
          { 'opacity-0': !r.d },
          { roll: state.spinning && !keeps[r.i] },
          { 'text-blue-500': keeps[r.i] },
          { 'border-blue-500': keeps[r.i] },
          { 'border-gray-400': !keeps[r.i] },
          { 'cursor-pointer': r.d && state.rolls.length < 3 },
        )}
        onclick={() => {
          if (![1, 2].includes(state.rolls.length)) return;
          actions.putkeep(r.i, state);
        }}
      >
        <Die side={r.d} />
      </div>
    ));
    return (
      <div
        class="w-100 h-12 flex justify-center items-center"
        ondragover={(e) => e.preventDefault()}
        ondrop={(e) => e.preventDefault()}
      >
        {
          !state.sort
            ? state.order.map((i) => this.dice[i])
            : this.dice.sort((x, y) => {
              if (!state.sort) return 0;
              const a = Number(x.attrs['data-value']);
              const b = Number(y.attrs['data-value']);
              if (a > b) return 1;
              if (a < b) return -1;
              return 0;
            })
        }
      </div>
    );
  }
}
