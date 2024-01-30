import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./index.html";
import style from './index.css';

import UiGrid from '../../ui/grid/grid';

@Component({
  selector: 'app-index',
  style,
  template
})
export default class AppIndex extends HTMLElement {
  @Part() $grid: UiGrid;

  connectedCallback() {
    document.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    }, { passive: false });
    this.$grid.addComment({
      $x: 1,
      $y: 10,
      $width: 10,
      $height: 10,
      text: 'Describe the script use here.'
    });
    this.$grid.addNode({
      $type: 'entry',
      $x: 1,
      $y: 1,
      icon: 'application'
    });
    this.$grid.addNode({
      $type: 'function',
      $name: 'setState',
      $x: 4,
      $y: 1,
      $width: 10,
      $height: 6
    });
    this.$grid.addNode({
      $type: 'function',
      $name: 'coinFlip',
      $x: 15,
      $y: 1,
      $width: 10,
      $height: 6
    });
  }

  render() {

  }
}
