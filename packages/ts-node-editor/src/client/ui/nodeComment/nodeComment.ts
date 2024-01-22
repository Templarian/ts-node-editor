import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeComment.html";
import style from './nodeComment.css';

import UiNodeBase from '../nodeBase/nodeBase';

@Component({
  selector: 'ui-node-comment',
  style,
  template
})
export default class UiNodeComment extends UiNodeBase {
  @Prop() text = '';

  @Part() $textarea: HTMLTextAreaElement;

  render(changes) {
    if (changes.text) {
      this.$textarea.value = this.text;
    }
  }
}
