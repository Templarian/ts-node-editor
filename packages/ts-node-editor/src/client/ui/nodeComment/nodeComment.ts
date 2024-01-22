import { Component, Prop, Part } from '@pictogrammers/element';

import template from "./nodeComment.html";
import style from './nodeComment.css';

import UiNodeBase from '../nodeBase/nodeBase';
import UiNodeResize from '../nodeResize/nodeResize';

@Component({
  selector: 'ui-node-comment',
  style,
  template
})
export default class UiNodeComment extends UiNodeBase {
  @Prop() text = '';

  @Part() $textarea: HTMLTextAreaElement;

  #handlePointerMove = null;

  connectedCallback() {
    this.addEventListener('pointerenter', (e) => {
      if (this.#handlePointerMove !== null) {
        return;
      }
      const { left, top, height, width } = this.getBoundingClientRect();
      this.#handlePointerMove = (e) => {
        const x = e.x - left;
        const y = e.y - top;
        if (x < -8 || y < -8 || x > width + 8 || y > height + 8) {
          this.#removeResize();
          document.removeEventListener('pointermove', this.#handlePointerMove);
          this.#handlePointerMove = null;
          document.body.style.cursor = null;
        } else if (x >= 8 && x <= width - 8 && y >= -8 && y <= 8) {
          this.#showResize(left, top, width, height, 'n');
          document.body.style.cursor = 'n-resize';
        } else if (x >= width - 8 && x <= width + 8 && y >= 8 && y <= height - 8) {
          this.#showResize(left, top, width, height, 'e');
          document.body.style.cursor = 'e-resize';
        } else if (x >= 8 && x <= width - 8 && y >= height - 8 && y >= height - 8) {
          this.#showResize(left, top, width, height, 's');
          document.body.style.cursor = 's-resize';
        } else if (x >= -8 && x <= 8 && y >= 8 && y <= height - 8) {
          this.#showResize(left, top, width, height, 'w');
          document.body.style.cursor = 'w-resize';
        } else if (x <= 8 && x >= -8 && y <= 8 && y >= -8) {
          this.#showResize(left, top, width, height, 'nw');
          document.body.style.cursor = 'nw-resize';
        } else if (x <= width + 8 && x >= width - 8 && y <= 8 && y >= -8) {
          this.#showResize(left, top, width, height, 'ne');
          document.body.style.cursor = 'ne-resize';
        } else if (x <= 8 && x >= -8 && y <= height + 8 && y >= height - 8) {
          this.#showResize(left, top, width, height, 'sw');
          document.body.style.cursor = 'sw-resize';
        } else if (x <= width + 8 && x >= width - 8 && y <= height + 8 && y >= height - 8) {
          this.#showResize(left, top, width, height, 'se');
          document.body.style.cursor = 'se-resize';
        } else {
          this.#removeResize();
          document.body.style.cursor = null;
        }
      };
      document.addEventListener('pointermove', this.#handlePointerMove);
    });
  }

  #nodeResizeEdge = '';
  #nodeResize = null;
  #showResize(x: number, y: number, width: number, height: number, edge: string) {
    if (this.#nodeResize && this.#nodeResizeEdge === '') {
      this.#nodeResize.edge = edge;
      document.body.appendChild(this.#nodeResize);
    } else if (!this.#nodeResize) {
      const $nodeResize = document.createElement('ui-node-resize') as UiNodeResize;
      $nodeResize.style.left = `${x - 10}px`;
      $nodeResize.style.top = `${y - 10}px`;
      $nodeResize.style.width = `${width + 20}px`;
      $nodeResize.style.height = `${height + 20}px`;
      $nodeResize.resize = edge;
      document.body.appendChild($nodeResize);
      this.#nodeResize = $nodeResize;
    }
    if (this.#nodeResizeEdge !== edge) {
      this.#nodeResize.resize = edge;
      console.log('edge', edge);
      document.addEventListener('pointerdown', () => {
        // Add a mouse down and then remove on up and watch drag
      });
      this.#nodeResizeEdge = edge;
      return;
    }
  }

  #removeResize() {
    if (this.#nodeResize) {
      this.#nodeResize.remove();
      this.#nodeResizeEdge = '';
    }
  }

  render(changes) {
    if (changes.text) {
      this.$textarea.value = this.text;
    }
  }
}
