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
        key: 'key',
        items: this.options,
        create: () => {
          const $button = document.createElement('ui-menu-item');
          return $button;
        },
        update: (element) => {
          
        }
      })*/
      // Map existing elements for a quicker reference
      const existing = new Map();
      Array.from(this.$items.children).map(($item: HTMLElement) => {
        existing.set($item.dataset.key, $item);
      });
      // Delete elements no longer in list
      const latest = this.options.map(x => x.key);
      const deleteItems = Array.from(existing.keys()).filter(x => !latest.includes(x));
      deleteItems.forEach(x => existing.get(x).remove());
      let previous = null;
      // Update or Insert elements
      this.options.forEach((option, i) => {
        const { key, ...options } = option;
        if (existing.has(key)) {
          Object.assign(existing.get(key), options);
        } else {
          const $new = document.createElement(camelToDash(option.type.name), option.type);
          $new.dataset.key = option.key;
          Object.assign($new, options);
          if ($new.role !== 'presentation') {
            $new.addEventListener('click', this.handleSelect.bind(this));
          }
          if (previous) {
            existing.get(previous).after($new);
          } else {
            this.$items.prepend($new);
          }
          existing.set(option.key, $new);
        }
        previous = option.key;
      });
      // Reorder the list

      // Loop through the new list... if it's not found insert
      // then check the previous item and insert until nodes are all moved.
      // this ensures only the nodes that need to move are

      /*
      var prevElemId = undefined;
      var prevElem = undefined;
      const cont = this.$items;
      let skipped = 0;
      for (var i=0; i < sorted.length; i++) {
        const elemId = 'e' + sorted[i];
        const elem = $('#' + elemId);
        if (prevElemId === undefined) {
          elem.prependTo(cont);
        } else {
          if (prevElem.next().attr('id') !== elemId) {
            prevElem.after(elem);
          } else {
            skipped++;
          }
        }
        prevElemId = elemId;
        prevElem = elem;		
      }
      */
      console.log('>', existing.keys());
      console.log('+', this.options.map(x => x.key));
    }
  }
}
