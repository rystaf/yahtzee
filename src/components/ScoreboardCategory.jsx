import m from 'mithril';
import classNames from 'classnames';

export default class ScoreboardCategory {
  view({ attrs: { onclick, title, score, hint } }) {
    return (
      <div
        class={classNames(
          { 'cursor-pointer': onclick && !(score > -1) },
          { 'cursor-default': !onclick || score > -1 },
          'rounded',
          'mt-1',
          'category',
          'flex',
          'whitespace-no-wrap',
        )}
        onclick={!(score > -1) ? onclick : () => {}}
      >
        <span class="flex-grow mr-2 text-right">{ title }</span>
        <span class={classNames(
          'text-left w-8',
          score > -1 ? 'font-bold' : 'italic opacity-50',
        )}
        >
          { score ?? hint }
        </span>
      </div>
    );
  }
}
