import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./menu.html";
import style from './menu.css';

function camelToDash(str: string): string {
  return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase()
}

function iterate({ container, items, create, update }: { container: HTMLElement, items: any[], create?: any, update?: any }) {
  const existing = new Map();
  Array.from(container.children).map(($item: HTMLElement) => {
    existing.set($item.dataset.key, $item);
  });
  // Delete elements no longer in list
  const latest = items.map(x => x.key);
  const deleteItems = Array.from(existing.keys()).filter(x => !latest.includes(x));
  deleteItems.forEach(x => existing.get(x).remove());
  let previous = null;
  // Update or Insert elements
  items.forEach((option, i) => {
    const { key, ...options } = option;
    if (existing.has(key)) {
        Object.assign(existing.get(key), options);
        update && update(existing.get(key), options);
    } else {
      const $new = document.createElement(camelToDash(option.type.name), option.type);
      $new.dataset.key = option.key;
      Object.assign($new, options);
      create && create($new, options);
      if (previous) {
        existing.get(previous).after($new);
      } else {
        container.prepend($new);
      }
      existing.set(option.key, $new);
    }
    previous = option.key;
  });
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
      iterate({
        container: this.$items,
        items: this.options,
        create: ($item, item) => {
          if ($item.role !== 'presentation') {
            $item.addEventListener('click', this.handleSelect.bind(this));
          }
        }
      })
    }
  }
}
