import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./menu.html";
import style from './menu.css';

function camelToDash(str: string): string {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

@Component({
  selector: 'ui-menu',
  style,
  template
})
export default class UiMenu extends HTMLElement {
  @Prop() options = [];

  @Part() $items: HTMLDivElement;

  handleSelect(e: any) {
    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        item: this.options.find(x => `${x.key}` === e.target.dataset.key)
      }
    }));
  }

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
      const existing = new Map();
      Array.from(this.$items.children).map(($item: HTMLElement) => {
        existing.set($item.dataset.key, $item);
      });
      this.options.forEach((option, i) => {
        const { key, ...options } = option;
        if (existing.has(key)) {
          Object.assign(existing, options);
        } else {
          const $new = document.createElement(camelToDash(option.type.name), option.type);
          $new.dataset.key = option.key;
          Object.assign($new, options);
          // only add click handlers if not presentational
          $new.addEventListener('click', this.handleSelect.bind(this));
          this.$items.appendChild($new);
        }
      });
      /*
      const items = this.$items.querySelectorAll('button');
      const values = this.options.reduce((obj, option) => {
        return { ...obj, [option.value]: option };
      }, {});
      items.forEach((item) => {
        if (values[item.dataset.value]) {

        }
      });*/
      console.log(changes.options);
    }
  }
}
