import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./menu.html";
import style from './menu.css';

@Component({
  selector: 'ui-menu',
  style,
  template
})
export default class HelloWorld extends HTMLElement {
  @Prop() message = 'Hello World';

  @Part() $message: HTMLDivElement;

  render(changes) {
    if (changes.message) {
      this.$message.innerText = this.message;
    }
  }
}
