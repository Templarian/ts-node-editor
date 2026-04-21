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

  @Part() $header: HTMLDivElement;
  @Part() $label: HTMLSpanElement;

  render(changes) {
    if (changes.name) {
      this.$label.textContent = this.name;
    }
  }

  @Prop() testing = [];

  connectedCallback() {
    this.$header.addEventListener('doubleclick', this.handleSelect.bind(this));
  }

  handleSelect() {
    this.classList.add('selected');
  }
}
