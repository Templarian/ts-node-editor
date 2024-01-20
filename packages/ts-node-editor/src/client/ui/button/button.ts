import { Component, Prop, Part } from '@pictogrammers/element';
import { unwireTooltip, wireTooltip } from '../../utils/tooltip';

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

    connectedCallback() {
        let slots = this.shadowRoot.querySelectorAll("slot");
        slots.forEach((slot) => {
            slot.addEventListener('slotchange', () => {
                const elements = slot.assignedElements();
                switch(slot.name) {
                    case 'start':
                        elements.map((element: HTMLElement) => {
                            element.style.setProperty('margin-right', '0.25rem');
                        });
                        break;
                    case 'end':
                        elements.map((element: HTMLElement) => {
                            element.style.setProperty('margin-left', '0.25rem');
                        });
                        break;
                }
            });
        });
    }

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
