import { Component, Prop, Part } from '@pictogrammers/element';
import { unwireTooltip, wireTooltip } from '../../utils/tooltip.js';

import template from "./button.html";
import style from './button.css';

@Component({
    selector: 'ui-button',
    style,
    template
})
export default class UiButton extends HTMLElement {
    @Prop() name = 'box';
    @Prop() tooltip = '';
    @Prop() disabled = false;

    @Part() $button: HTMLButtonElement;

    render(changes) {
        if (changes.tooltip) {
            if (this.tooltip) {
                wireTooltip(this, () => this.tooltip);
            } else {
                unwireTooltip(this);
            }
        }
    }
}
