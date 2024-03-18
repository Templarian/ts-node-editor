import {
  Component,
  Prop,
  Part,
  normalizeString
} from '@pictogrammers/element';

import template from "./nodeInputText.html";
import style from './nodeInputText.css';

@Component({
  selector: 'ui-node-input-text',
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
