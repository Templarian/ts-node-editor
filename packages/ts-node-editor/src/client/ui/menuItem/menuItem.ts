import { Component, Prop, Part } from '@pictogrammers/element';
import UiIcon from '../icon/icon';

import template from "./menuItem.html";
import style from './menuItem.css';

@Component({
  selector: 'ui-menu-item',
  style,
  template
})
export default class UiMenuItem extends HTMLElement {
  @Prop() label = '';
  @Prop() icon;

  @Part() $button: HTMLButtonElement;
  @Part() $label: HTMLSpanElement;
  @Part() $icon: UiIcon;

  render(changes) {
    if (changes.label) {
      this.$label.textContent = this.label;
    }
    if (changes.icon) {
      console.log(this.$icon);
      if (this.icon) {
        const $icon = document.createElement('ui-icon') as UiIcon;
        $icon.setAttribute('part', 'icon');
        $icon.size = 16;
        $icon.name = this.icon;
        this.$button.prepend($icon);
      }
    }
  }
}
