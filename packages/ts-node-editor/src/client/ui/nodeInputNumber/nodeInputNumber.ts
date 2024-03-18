import {
  Component,
  Prop,
  Part,
  normalizeString
} from '@pictogrammers/element';

import template from "./nodeInputNumber.html";
import style from './nodeInputNumber.css';

@Component({
  selector: 'ui-node-input-number',
  style,
  template
})
export default class UiNodeInputText extends HTMLElement {
  @Prop(normalizeString) name;
  @Prop(normalizeString) value: any;

  @Part() $label: HTMLSpanElement;
  @Part() $input: HTMLInputElement;

  render(changes) {
    if (changes.name) {
      this.$label.textContent = this.name;
    }
  }

  connectedCallback() {
    this.$input.addEventListener('input', () => {
      this.dispatchEvent(new CustomEvent('change'));
    });
  }
}
