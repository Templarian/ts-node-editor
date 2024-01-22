import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeResize.html";
import style from './nodeResize.css';

@Component({
  selector: 'ui-node-resize',
  style,
  template
})
export default class UiNodeResize extends HTMLElement {
  @Prop() resize = '';

  @Part() $nw: HTMLDivElement;
  @Part() $n: HTMLDivElement;
  @Part() $ne: HTMLDivElement;
  @Part() $e: HTMLDivElement;
  @Part() $sw: HTMLDivElement;
  @Part() $s: HTMLDivElement;
  @Part() $se: HTMLDivElement;
  @Part() $w: HTMLDivElement;

  get edges() {
    return [
      this.$nw,
      this.$n,
      this.$ne,
      this.$e,
      this.$sw,
      this.$s,
      this.$se,
      this.$w
    ];
  }

  render(changes) {
    if (changes.resize) {
      this.edges.forEach((edge) => {
        edge.style.display = 'none';
      });
      if (this.resize !== '') {
        this[`$${this.resize}`].style.display = 'flex';
      }
    }
  }
}
