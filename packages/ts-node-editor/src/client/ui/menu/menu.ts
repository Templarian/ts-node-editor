import { Component, Prop, Part, forEach } from '@pictogrammers/element';

import template from "./menu.html";
import style from './menu.css';

import UiMenuItem from '../menuItem/menuItem';
import UiMenuSeperator from '../menuSeperator/menuSeperator';

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
      forEach({
        container: this.$items,
        items: this.options,
        type: (item) => {
          return item.label ? UiMenuItem : UiMenuSeperator;
        },
        create: ($item, item) => {
          if ($item.role !== 'presentation') {
            $item.addEventListener('click', this.handleSelect.bind(this));
          }
        }
      });
    }
  }
}
