import {
  Component,
  Prop,
  normalizeInt
} from '@pictogrammers/element';

import style from './nodeBase.css';

@Component({
  selector: 'ui-node-base',
  style
})
export default class UiNodeBase extends HTMLElement {
  @Prop(normalizeInt) x = 0;
  @Prop(normalizeInt) y = 0;
  @Prop(normalizeInt) width = 0;
  @Prop(normalizeInt) height = 0;

  render(changes) {
    if (changes.x) {
      this.style.setProperty('--node-x', `${this.x}`);
    }
    if (changes.y) {
      this.style.setProperty('--node-y', `${this.y}`);
    }
    if (changes.width && this.width > 2) {
      this.style.setProperty('--node-width', `${this.width}`);
    }
    if (changes.height && this.height > 2) {
      this.style.setProperty('--node-height', `${this.height}`);
    }
  }
}
