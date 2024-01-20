import { Component, Prop, Part } from '@pictogrammers/element';
import { wireContextMenu, unwireContextMenu } from './../../utils/contextMenu';

import template from "./grid.html";
import style from './grid.css';

@Component({
  selector: 'ui-grid',
  style,
  template
})
export default class UiGrid extends HTMLElement {
  @Part() $grid: HTMLDivElement;

  connectedCallback() {
    wireContextMenu(this.$grid, this.computeOptions);
  }

  computeOptions() {
    return [];
  }

  render(changes) {

  }
}
