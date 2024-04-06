import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./index.html";
import style from './index.css';

import UiGrid from '../../ui/grid/grid';
import UiButton from '../../ui/button/button';
import UiIcon from '../../ui/icon/icon';

@Component({
  selector: 'app-index',
  style,
  template
})
export default class AppIndex extends HTMLElement {
  @Part() $grid: UiGrid;

  @Part() $debug: UiButton;
  @Part() $debugCheck: UiIcon;
  @Part() $debugPlay: UiButton;
  @Part() $debugPrevious: UiButton;
  @Part() $debugNext: UiButton;
  @Part() $debugRestart: UiButton;

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
    /*this.$grid.addNode({
      $type: 'function',
      $name: 'coinFlip',
      $x: 15,
      $y: 1,
      $width: 10,
      $height: 6
    });*/

    // Debug
    this.$debug.addEventListener('click', this.handleDebug.bind(this));
    this.$debugPlay.addEventListener('click', this.handlePlay.bind(this));
    this.$debugPrevious.addEventListener('click', this.handlePrevious.bind(this));
    this.$debugNext.addEventListener('click', this.handleNext.bind(this));
    this.$debugRestart.addEventListener('click', this.handleRestart.bind(this));
  }

  #debug = false;
  handleDebug() {
    this.#debug = !this.#debug;
    if (this.#debug) {
      this.$debugCheck.name = 'checkbox-marked';
    } else {
      this.$debugCheck.name = 'checkbox-blank';
    }
  }

  handlePlay() {
    console.log('play');
  }

  handlePrevious() {
    console.log('previous');
  }

  handleNext() {
    console.log('next');
  }

  handleRestart() {
    console.log('restart');
  }

  render() {

  }
}
