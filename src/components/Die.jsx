import m from 'mithril';
import './Die.css';

export default class Die {
  view({ attrs: { side: i } }) {
    return (
      <svg
        class={`die side${i} stroke-current`}
        viewBox="-5 -5 110 110"
        height="100%"
        ondragover={(e) => e.preventDefault()}
        ondragstart={(e) => {
          console.log('plz');
          e.preventDefault();
        }}
        ondrop={(e) => e.preventDefault()}
      >
        <circle class="fill-current pm pmm" r="10" />
        <circle class="fill-current pt pl" r="10" />
        <circle class="fill-current pm pl" r="10" />
        <circle class="fill-current pb pl" r="10" />
        <circle class="fill-current pt pr" r="10" />
        <circle class="fill-current pm pr" r="10" />
        <circle class="fill-current pb pr" r="10" />
      </svg>
    );
  }
}
