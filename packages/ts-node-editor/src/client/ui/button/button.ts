import { Component, Prop, Part } from '@pictogrammers/element';
import { unwireTooltip, wireTooltip } from '../../utils/tooltip';

import template from "./button.html";
import style from './button.css';

function isNodesEmpty(nodes: Node[]) {
    for(const node of nodes) {
        if (node.nodeName !== '#text') {
            return false;
        }
        if (node.nodeValue.trim() !== '') {
            return false;
        }
    }
    return true;
}

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
        let slots = this.shadowRoot?.querySelectorAll("slot");
        slots?.forEach((slot) => {
            slot.addEventListener('slotchange', () => {
                const elements = slot.assignedElements() as HTMLElement[];
                switch(slot.name) {
                    case 'start':
                        console.log('start', isNodesEmpty(slot.assignedNodes()));
                        elements.forEach((element: HTMLElement) => {
                            element.style.setProperty('margin-right', '0.375rem');
                        });
                        break;
                    case 'end':
                        console.log('end', isNodesEmpty(slot.assignedNodes()));
                        elements.forEach((element: HTMLElement) => {
                            element.style.setProperty('margin-left', '0.375rem');
                        });
                        break;
                    default:
                        const empty = isNodesEmpty(slot.assignedNodes());
                        console.log('default', empty);
                        break;
                }
            });
        });
        // Stop context menu
        this.addEventListener('contextmenu', (e) => { e.preventDefault(); });
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
