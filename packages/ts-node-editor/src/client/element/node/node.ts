import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./node.html";
import style from './node.css';

@Component({
  selector: 'ui-node',
  style,
  template
})
export default class UiNode extends HTMLElement {
  @Prop() x = 0;
  @Prop() y = 0;
  @Prop() width = 10;
  @Prop() height = 10;

  render(changes) {

  }
}
