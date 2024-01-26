import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeComment.html";
import style from './nodeComment.css';

import UiNodeBase from '../nodeBase/nodeBase';
import { wireTransformNode } from '../../utils/transformNode';

@Component({
  selector: 'ui-node-comment',
  style,
  template
})
export default class UiNodeComment extends UiNodeBase {
  @Prop() text = '';

  @Part() $textarea: HTMLTextAreaElement;

  connectedCallback() {
    wireTransformNode(this, {
      resizable: true,
      moveable: true,
      minWidth: 2,
      minHeight: 2
    });
  }

  render(changes) {
    if (changes.text) {
      this.$textarea.value = this.text;
    }
  }
}
