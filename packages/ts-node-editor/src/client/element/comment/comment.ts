import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./comment.html";
import style from './comment.css';

@Component({
  selector: 'ui-comment',
  style,
  template
})
export default class UiComment extends HTMLElement {
  @Prop() x = 0;
  @Prop() y = 0;
  @Prop() width = 10;
  @Prop() height = 10;
  @Prop() text = '';

  render(changes) {
    if (changes.x) {
      this.style.setProperty('--node-x', `${this.x}`);
    }
    if (changes.y) {
      this.style.setProperty('--node-y', `${this.y}`);
    }
    if (changes.width) {
      this.style.setProperty('--node-width', `${this.width}`);
    }
    if (changes.height) {
      this.style.setProperty('--node-height', `${this.height}`);
    }
  }
}
