import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./node.html";
import style from './node.css';

@Component({
  selector: 'ui-node',
  style,
  template
})
export default class UiNode extends HTMLElement {
  @Prop() nodes;
  @Prop() comments;

  connectedCallback() {
    
  }

  render() {

  }
}
