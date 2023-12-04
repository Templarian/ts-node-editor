import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./icon.html";
import style from './icon.css';

const icons = {
    '16:play': 'M4 1H7V2H8V3H9V4H10V5H11V6H12V7H13V9H12V10H11V11H10V12H9V13H8V14H7V15H4V1M8 6V5H7V4H6V12H7V11H8V10H9V9H10V7H9V6H8Z',
    '22:box': 'M4 2H18V3H19V4H20V18H19V19H18V20H4V19H3V18H2V4H3V3H4V2M17 5V4H5V5H4V17H5V18H17V17H18V5H17Z'
};

@Component({
  selector: 'ui-icon',
  style,
  template
})
export default class HelloWorld extends HTMLElement {
  @Prop() name = 'box';
  @Prop() size = 22;

  @Part() $svg: SVGSVGElement;
  @Part() $path: SVGPathElement;

  render(changes) {
    if (changes.name || changes.size) {
      const path = icons[`${this.size}:${this.name}`];
      this.$svg.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`)
      this.$path.setAttribute('d', path);
      this.style.setProperty('--icon-size', `${this.size}`);
    }
  }
}
