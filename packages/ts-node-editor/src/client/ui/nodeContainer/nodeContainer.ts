import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeContainer.html";
import style from './nodeContainer.css';

@Component({
  selector: 'ui-node-container',
  style,
  template
})
export default class UiNodeContainer extends HTMLElement {
  @Prop() x = 0;
  @Prop() y = 0;
  @Prop() width = 10;
  @Prop() height = 10;

  render(changes) {

  }
}
