import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./tooltip.html";
import style from './tooltip.css';

function getTooltipBelow(width, height, nubbinOffset) {
  return `M 4,4L 47,4C 48,2 49,0 50,0C 50,0 51,2 53,4L 96,4C 98,4 100,6 100,8L 100,22C 100,24 98,26 96,26L 4,26C 2,26 0,24 0,22L 0,8C 0,6 2,4 4,4 Z`
}

@Component({
  selector: 'ui-tooltip',
  style,
  template
})
export default class UiTooltip extends HTMLElement {
  @Prop() text = '';

  @Part() $content: HTMLDivElement;

  render(changes) {
    if (changes.text) {
      this.$content.innerText = this.text;
      const rect = this.$content.getBoundingClientRect();
      const half = Math.floor(rect.width / 2);
      
    }
  }
}
