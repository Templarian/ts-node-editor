import { Component, Prop, Part, normalizeInt } from '@pictogrammers/element';

import template from "./nodeHandle.html";
import style from './nodeHandle.css';

@Component({
  selector: 'ui-node-handle',
  style,
  template
})
export default class UiNodeHandle extends HTMLElement {
  @Prop(normalizeInt) x = 0;
  @Prop(normalizeInt) y = 0;
  @Prop(normalizeInt) offsetX = 0;
  @Prop(normalizeInt) offsetY = 0;

  connectedCallback() {
    this.addEventListener('pointerdown', this.handlePointerEvent.bind(this));
  }

  handlePointerEvent(e) {
    this.classList.add('active');
    this.dispatchEvent(new CustomEvent('handledown', {
      detail: {
        x: this.x,
        y: this.y
      },
      composed: true
    }));
    document.addEventListener('pointerup', this.handlePointerUp.bind(this));
    document.addEventListener('pointermove', this.handlePointerMove.bind(this));
  }

  handlePointerUp() {
    document.removeEventListener('pointermove', this.handlePointerMove.bind(this));
  }

  handlePointerMove() {

  }

  render(changes) {
    if (changes.x) {
      this.style.setProperty('--node-x', `${this.x}`);
    }
    if (changes.y) {
      this.style.setProperty('--node-y', `${this.y}`);
    }
    if (changes.offsetX) {
      this.style.setProperty('--node-offset-x', `${this.offsetX}`);
    }
    if (changes.offsetY) {
      this.style.setProperty('--node-offset-y', `${this.offsetY}`);
    }
  }
}
