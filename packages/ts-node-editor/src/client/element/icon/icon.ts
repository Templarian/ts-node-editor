import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./icon.html";
import style from './icon.css';

const icons = {
    '16:comment': 'M0 2H1V1H15V2H16V12H15V13H10V14H9V15H8V16H4V13H1V12H0V2M2 11H6V14H7V13H8V12H9V11H14V3H2V11Z',
    '16:play': 'M4 1H7V2H8V3H9V4H10V5H11V6H12V7H13V9H12V10H11V11H10V12H9V13H8V14H7V15H4V1M8 6V5H7V4H6V12H7V11H8V10H9V9H10V7H9V6H8Z',
    '16:step-backward': 'M16 9H14V7H16V9M12 9H5V10H6V11H7V12H8V14H6V13H5V12H4V11H3V10H2V9H1V7H2V6H3V5H4V4H5V3H6V2H8V4H7V5H6V6H5V7H12V9Z',
    '16:step-forward': 'M0 7H2V9H0V7M4 7H11V6H10V5H9V4H8V2H10V3H11V4H12V5H13V6H14V7H15V9H14V10H13V11H12V12H11V13H10V14H8V12H9V11H10V10H11V9H4V7Z',
    '16:restart': 'M1 5H2V4H3V3H4V2H5V1H7V3H6V4H5V5H12V6H13V7H14V8H15V13H14V14H13V15H12V16H5V14H11V13H12V12H13V9H12V8H11V7H5V8H6V9H7V11H5V10H4V9H3V8H2V7H1V5M1 16V14H3V16H1Z',
    '22:box': 'M4 2H18V3H19V4H20V18H19V19H18V20H4V19H3V18H2V4H3V3H4V2M17 5V4H5V5H4V17H5V18H17V17H18V5H17Z'
};

@Component({
    selector: 'ui-icon',
    style,
    template
})
export default class UiIcon extends HTMLElement {
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
