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

  #pointerUp;
  #pointerMove;

  handlePointerEvent(e) {
    this.classList.add('active');
    this.dispatchEvent(new CustomEvent('handlestart', {
      detail: {
        x: this.x,
        y: this.y
      },
      composed: true
    }));
    this.#pointerUp = this.handlePointerUp.bind(this);
    document.addEventListener('pointerup', this.#pointerUp);
    this.#pointerMove = this.handlePointerMove.bind(this);
    document.addEventListener('pointermove', this.#pointerMove);
  }

  handlePointerUp(e: any) {
    const rect = this.getBoundingClientRect();
    this.dispatchEvent(new CustomEvent('handleend', {
      detail: {
        x: this.x + Math.floor((e.x - rect.left) / 20),
        y: this.y + Math.floor((e.y - rect.top) / 20)
      },
      composed: true
    }));
    document.removeEventListener('pointermove', this.#pointerMove);
    document.removeEventListener('pointerup', this.#pointerUp);
    this.classList.remove('active');
  }

  handlePointerMove(e: any) {
    const rect = this.getBoundingClientRect();
    this.dispatchEvent(new CustomEvent('handlemove', {
      detail: {
        x: this.x + Math.floor((e.x - rect.left) / 20),
        y: this.y + Math.floor((e.y - rect.top) / 20)
      },
      composed: true
    }));
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
