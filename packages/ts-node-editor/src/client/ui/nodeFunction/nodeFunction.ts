import {
  Component,
  Prop,
  Part,
  normalizeString
} from '@pictogrammers/element';

import template from "./nodeFunction.html";
import style from './nodeFunction.css';

import UiNodeBase from '../nodeBase/nodeBase';

@Component({
  selector: 'ui-node-function',
  style,
  template
})
export default class UiNodeFunction extends UiNodeBase {
  @Prop(normalizeString) name;
  @Prop() args: any;

  @Part() $label: HTMLSpanElement;

  render(changes) {
    if (changes.name) {
      this.$label.textContent = this.name;
    }
    if (changes.testing) {
      console.log('updated testing', this.testing, this.testing.length);
    }
  }

  @Part() $button: HTMLButtonElement;

  @Prop() testing = [];

  connectedCallback() {
    this.$button.addEventListener('click', () => {
      if (this.testing.length >= 1) {
        this.testing.push('thr');
      } else {
        this.testing = ['one', 'two'];
      }
    });
  }
}
