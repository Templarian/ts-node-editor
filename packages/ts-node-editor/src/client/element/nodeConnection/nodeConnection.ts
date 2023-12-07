import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeConnection.html";
import style from './nodeConnection.css';

@Component({
  selector: 'ui-node-connection',
  style,
  template
})
export default class UiNodeConnection extends HTMLElement {
  @Prop() x1 = 0;
  @Prop() y1 = 0;
  @Prop() x2 = 0;
  @Prop() y2 = 0;

  @Part() $svg: SVGSVGElement;
  @Part() $pathOuter: SVGPathElement;
  @Part() $pathInner: SVGPathElement;

  connectedCallback() {
    this.$pathOuter.addEventListener('dblclick', (event) => {
      console.log('delete connection');
      event.preventDefault();
    });
  }

  render(changes) {
    if (this.x1 === 0 || this.y1 === 0 || this.x2 === 0 || this.y2 === 0) {
      return;
    }
    if (changes.x1 || changes.x2) {
      this.style.setProperty('--node-x', `${Math.min(this.x1, this.x2)}`);
      this.style.setProperty('--node-width', `${Math.abs(this.x1 - this.x2)}`);
    }
    if (changes.y1 || changes.y2) {
      this.style.setProperty('--node-y', `${Math.min(this.y1, this.y2)}`);
      this.style.setProperty('--node-height', `${Math.abs(this.y1 - this.y2)}`);
    }
  }
}
