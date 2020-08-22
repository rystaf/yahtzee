import m from 'mithril';
import classNames from 'classnames';
import '../last';
import Rolls from './Rolls';
import Scoreboard from './Scoreboard';

export default class Main {
  view({ attrs: { store } }) {
    const disabled = store.state.rolls.length > 2
      || store.state.turn > 12
      || store.state.spinning
      || store.state.keeps.last()?.filter((x) => x).length === 5;
    return (
      <div class="h-screen flex items-center">
        <div>
          <div class="w-screen text-center">
            <div class="inline-block align-top text-center">
              <div class="shadow-md bg-white px-2 pb-2 rounded-lg text-right border-gray-400 border-2 lg:border-4 border-blue-500">
                { m(Scoreboard, { store }) }
              </div>
              <div
                style={{ 'padding-top': '.05rem' }}
                class="mb-1 pb-1 bg-gray-200 rounded-b-lg"
              >
                { m(Rolls, { store }) }
              </div>
            </div>
          </div>
          <div class="w-screen flex justify-center">
            <div class="flex items-center flex-grow" style={{ 'flex-basis': 0 }}>
              <div class="text-right w-full">
                <button
                  style={{ padding: '.1rem .2rem' }}
                  type="button"
                  onclick={() => store.actions.newGame()}
                  class="bg-gray-300 shadow-md active:bg-gray-500 hover:bg-gray-400 text-gray-800 rounded"
                >
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div style={{ width: '5.6rem' }} class="mx-2">
              <button
                class={classNames(
                  'h-10 w-20 bg-blue-500 text-white active:bg-blue-700 shadow-md font-bold py-2 px-1 rounded',
                  { 'hover:bg-blue-600': !disabled },
                  { 'opacity-50 cursor-not-allowed': disabled },
                  store.state.rolls.length > 2
                    ? 'selectcategory'
                    : 'leading-3s',
                )}
                type="button"
                onclick={() => {
                  store.actions.roll(store.state);
                }}
                disabled={disabled}
              >
                {
                  store.state.turn > 12 // eslint-disable-line no-nested-ternary
                    ? 'Game over'
                    : store.state.rolls.length > 2
                      ? 'Select a category'
                      : ([
                        'Roll',
                        <div
                          class="opacity-75"
                          style={{
                            'font-size': '.5rem',
                          }}
                        >
                          {`${store.state.rolls.length}/3`}
                        </div>,
                      ])
                }
              </button>
            </div>
            <div class="flex items-center flex-grow" style={{ 'flex-basis': 0 }}>
              <button
                style={{ padding: '.1rem .2rem' }}
                type="button"
                onclick={() => store.actions.sort(store.state.rolls.last())}
                disabled={store.state.sort}
                class={classNames(
                  'bg-gray-300 focus:outline-none active:bg-gray-500 shadow-md text-gray-800 rounded',
                  { 'hover:bg-gray-400': !store.state.sort },
                  { 'opacity-50 cursor-not-allowed': store.state.sort },
                )}
              >
                <svg class="w-6 h-6" transform="scale(1, -1) rotate(90)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
              <input
                type="checkbox"
                checked={store.state.sort}
                onclick={() => store.actions.sortToggle()}
                class="ml-1"
                style={{ height: '.8rem', width: '.8rem' }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
