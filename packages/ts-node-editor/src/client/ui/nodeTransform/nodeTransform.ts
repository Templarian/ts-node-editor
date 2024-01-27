import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeTransform.html";
import style from './nodeTransform.css';

@Component({
  selector: 'ui-node-transform',
  style,
  template
})
export default class UiNodeTransform extends HTMLElement {
  @Prop() edge = '';
  @Prop() isResizing = false;
  @Prop() isMoving = false;
  @Prop() visible = false;

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
    if (changes.edge) {
      this.edges.forEach((edge) => {
        edge.style.display = 'none';
      });
      const edge = this.edge.toUpperCase();
      if (edge !== '') {
        this[`$outer${edge}`].style.display = 'flex';
        this[`$inner${edge}`].style.display = 'flex';
      }
    }
    if (changes.isResizing) {
      this.classList.toggle('active', this.isResizing);
    }
    if (changes.isMoving) {
      this.classList.toggle('moving', this.isMoving);
    }
    if (changes.visible) {
      this.classList.toggle('visible', this.visible)
    }
  }
}
