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
        this.$grid.addComment({ 
            $x: 1,
            $y: 10,
            $width: 10,
            $height: 10,
            text: 'Describe the script use here.'
        });
    }

    render() {
        
    }
}
