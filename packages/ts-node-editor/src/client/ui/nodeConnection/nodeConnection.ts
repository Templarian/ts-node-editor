import { Component, Prop, Part, normalizeInt } from '@pictogrammers/element';

import template from "./nodeConnection.html";
import style from './nodeConnection.css';

@Component({
  selector: 'ui-node-connection',
  style,
  template
})
export default class UiNodeConnection extends HTMLElement {
  
  @Prop() x1 = 0;
  @Prop() y1 = 0;
  @Prop() x2 = 0;
  @Prop() y2 = 0;
  @Prop() temporary = false;

  @Part() $svg: SVGSVGElement;
  @Part() $pathOuter: SVGPathElement;
  @Part() $pathInner: SVGPathElement;

  connectedCallback() {
    this.$pathOuter.addEventListener('dblclick', (event) => {
      console.log('delete connection');
      event.preventDefault();
    });
  }

  render(changes: { [key: string]: boolean }) {
    const x1 = normalizeInt(this.x1);
    const y1 = normalizeInt(this.y1);
    const x2 = normalizeInt(this.x2);
    const y2 = normalizeInt(this.y2);
    if (!(x1 === 0 || y1 === 0 || x2 === 0 || y2 === 0)) {
      const s = 20;
      const width = Math.abs(x1 - x2);
      const height = Math.abs(y1 - y2);
      if (changes.x1 || changes.x2) {
        this.style.setProperty('--node-x', `${Math.min(x1, x2)}`);
        this.style.setProperty('--node-width', `${width}`);
      }
      if (changes.y1 || changes.y2) {
        this.style.setProperty('--node-y', `${Math.min(y1, y2)}`);
        this.style.setProperty('--node-height', `${height}`);
      }
      if (changes.x1 || changes.x2 || changes.y1 || changes.y2) {
        const path = `M6,6 C${(width * s) + 6},6 6,${(height * s) + 6} ${(width * s) + 6},${(height * s) + 6}`;
        this.$svg.setAttribute('viewBox', `0 0 ${(width * s) + 12} ${(height * s) + 12}`);
        this.$pathOuter.setAttribute('d', path);
        this.$pathInner.setAttribute('d', path);
      }
    }
    if (changes.temporary) {
      this.$svg.classList.toggle('temporary', this.temporary);
    }
  }
}
