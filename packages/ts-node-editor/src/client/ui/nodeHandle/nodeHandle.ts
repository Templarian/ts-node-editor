import { Component, Prop, Part, normalizeInt } from '@pictogrammers/element';

import template from "./nodeHandle.html";
import style from './nodeHandle.css';

@Component({
  selector: 'ui-node-handle',
  style,
  template
})
export default class UiNodeHandle extends HTMLElement {
  @Prop() x = 0;
  @Prop() y = 0;

  connectedCallback() {
    this.addEventListener('pointerdown', (event) => {
      this.dispatchEvent(new CustomEvent('handledown', {
        detail: {
          x: normalizeInt(this.x),
          y: normalizeInt(this.y)
        }
      }));
    });
  }

  render(changes) {
    if (changes.x) {
      this.style.setProperty('--node-x', `${this.x}`);
    }
    if (changes.y) {
      this.style.setProperty('--node-y', `${this.y}`);
    }
  }
}
