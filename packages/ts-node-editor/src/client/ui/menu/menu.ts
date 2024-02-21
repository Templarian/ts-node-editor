import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./menu.html";
import style from './menu.css';

@Component({
  selector: 'ui-menu',
  style,
  template
})
export default class UiMenu extends HTMLElement {
  @Prop() options = [];

  @Part() $items: HTMLDivElement;

  render(changes) {
    if (changes.options) {
      /*iterate({
        parent: this.$items,
        key: 'value',
        items: this.options,
        create: () => {
          const $button = document.createElement('ui-menu-item');
          return $button;
        },
        update: (element) => {

        }
      })*/
      const items = this.$items.querySelectorAll('button');
      const values = this.options.reduce((obj, option) => {
        return { ...obj, [option.value]: option };
      }, {});
      items.forEach((item) => {
        if (values[item.dataset.value]) {

        }
      });
      console.log(changes.options);
    }
  }
}
