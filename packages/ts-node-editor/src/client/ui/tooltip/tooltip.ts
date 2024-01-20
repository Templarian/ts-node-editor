import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./tooltip.html";
import style from './tooltip.css';

function getTooltipBelow(width, height, nubbinOffset) {
  return `M 4,4L 47,4C 48,2 49,0 50,0C 50,0 51,2 53,4L 96,4C 98,4 100,6 100,8L 100,22C 100,24 98,26 96,26L 4,26C 2,26 0,24 0,22L 0,8C 0,6 2,4 4,4 Z`
}

@Component({
  selector: 'ui-tooltip',
  style,
  template
})
export default class UiTooltip extends HTMLElement {
  @Prop() text = '';
  @Prop() sourceWidth = 0;
  @Prop() sourceHeight = 0;

  @Part() $content: HTMLDivElement;

  updatePath(width: number, height: number) {
    const halfWidth = Math.floor(width / 2); // 102, 51
    const halfHeight = Math.floor(height / 2); // 28, 14
    const offsetHeight = 6;
    const path = [
      `M 5,7`,
      `L ${halfWidth - 5}, 7`,
      `C ${halfWidth - 4},5 ${halfWidth - 1},1 ${halfWidth},1C ${halfWidth + 1},1 ${halfWidth + 4},5 ${halfWidth + 5},7`,
      `L ${width - 5},7`,
      `C ${width - 3},7 ${width - 1},9 ${width - 1},11`,
      `L ${width - 1},${height - 1 - offsetHeight}`,
      `C ${width - 1},${height + 1 - offsetHeight} ${width - 3},${height + 3 - offsetHeight} ${width - 5},${height + 3 - offsetHeight}`,
      `L 5,${height + 3 - offsetHeight}`,
      `C 3,${height + 3 - offsetHeight} 1,${height + 1 - offsetHeight} 1,${height - 1 - offsetHeight}`,
      `L 1,11`,
      `C 1,9 3,7 5,7`,
      `Z`
    ].join('');
    this.$content.style.setProperty(
      '--ui-tooltip-path',
      `path('${path}')`
    );
    this.$content.style.setProperty(
      '--ui-tooltip-image',
      `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Cpath d='${path}' fill='%23181818' stroke='white' stroke-opacity='0.2' stroke-width='2' /%3E%3C/svg%3E")`
    );
    this.style.setProperty('transform', `translate(${(this.sourceWidth - width) / 2}px, 0)`);
  }

  render(changes) {
    if (changes.text) {
      this.$content.innerText = this.text;
      const rect = this.$content.getBoundingClientRect();
      const half = Math.floor(rect.width / 2);
      const resizeObserver = new ResizeObserver(([entry]) => {
        const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];
        if (width === 0 || height === 0) { return; }
        this.updatePath(width, height);
      });
      resizeObserver.observe(this.$content);
    }
  }
}
