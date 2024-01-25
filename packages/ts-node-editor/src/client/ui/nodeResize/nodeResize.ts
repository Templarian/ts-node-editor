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
  @Prop() isResizing = false;

  @Part() $outerNW: HTMLDivElement;
  @Part() $outerN: HTMLDivElement;
  @Part() $outerNE: HTMLDivElement;
  @Part() $outerE: HTMLDivElement;
  @Part() $outerSW: HTMLDivElement;
  @Part() $outerS: HTMLDivElement;
  @Part() $outerSE: HTMLDivElement;
  @Part() $outerW: HTMLDivElement;

  @Part() $innerNW: HTMLDivElement;
  @Part() $innerN: HTMLDivElement;
  @Part() $innerNE: HTMLDivElement;
  @Part() $innerE: HTMLDivElement;
  @Part() $innerSW: HTMLDivElement;
  @Part() $innerS: HTMLDivElement;
  @Part() $innerSE: HTMLDivElement;
  @Part() $innerW: HTMLDivElement;

  get edges() {
    return [
      this.$outerNW,
      this.$outerN,
      this.$outerNE,
      this.$outerE,
      this.$outerSW,
      this.$outerS,
      this.$outerSE,
      this.$outerW,
      this.$innerNW,
      this.$innerN,
      this.$innerNE,
      this.$innerE,
      this.$innerSW,
      this.$innerS,
      this.$innerSE,
      this.$innerW
    ];
  }

  render(changes) {
    if (changes.resize) {
      this.edges.forEach((edge) => {
        edge.style.display = 'none';
      });
      const edge = this.resize.toUpperCase();
      if (edge !== '') {
        this[`$outer${edge}`].style.display = 'flex';
        this[`$inner${edge}`].style.display = 'flex';
      }
    }
    if (changes.isResizing) {
      this.classList.toggle('active', this.isResizing);
    }
  }
}
