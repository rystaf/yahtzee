import m from 'mithril';
import Main from './components/Main';
import './app.css';
import { states, actions } from './state';

m.mount(document.body, {
  view: () => m(Main, { store: { state: states(), actions } }),
});
