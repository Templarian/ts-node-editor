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

  #startX = 0;
  #startY = 0;
  #startWidth = 0;
  #startHeight = 0;
  connectedCallback() {
    this.addEventListener('pointerenter', (e) => {
      if (this.#handlePointerMove !== null) {
        return;
      }
      const {
        left,
        top,
        height,
        width
      } = this.getBoundingClientRect();
      this.#handlePointerMove = (e) => {
        const x = e.x - left;
        const y = e.y - top;
        const o = 16;
        const c = 12;
        if (this.#nodeResize && this.#nodeResize.isResizing) {
          this.#updateSize(x, y);
        } else if (x <= -o || y <= -o || x > width + o || y > height + o) {
          this.#removeResize();
          document.removeEventListener('pointermove', this.#handlePointerMove);
          this.#handlePointerMove = null;
          document.body.style.cursor = null;
        } else if (x >= c && x <= width - c && y >= -o && y <= 4) {
          this.#showResize(left, top, width, height, 'n');
          document.body.style.cursor = 'n-resize';
        } else if (x >= width - 4 && x <= width + o && y >= c && y <= height - c) {
          this.#showResize(left, top, width, height, 'e');
          document.body.style.cursor = 'e-resize';
        } else if (x >= c && x <= width - c && y >= height - 4 && y <= height + o) {
          this.#showResize(left, top, width, height, 's');
          document.body.style.cursor = 's-resize';
        } else if (x >= -o && x <= 4 && y >= c && y <= height - c) {
          this.#showResize(left, top, width, height, 'w');
          document.body.style.cursor = 'w-resize';
        } else if (x <= c && x >= -o && y <= c && y >= -o) {
          this.#showResize(left, top, width, height, 'nw');
          document.body.style.cursor = 'nw-resize';
        } else if (x <= width + o && x >= width - c && y <= c && y >= -o) {
          this.#showResize(left, top, width, height, 'ne');
          document.body.style.cursor = 'ne-resize';
        } else if (x <= c && x >= -o && y <= height + o && y >= height - c) {
          this.#showResize(left, top, width, height, 'sw');
          document.body.style.cursor = 'sw-resize';
        } else if (x <= width + o && x >= width - c && y <= height + o && y >= height - c) {
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

  #handlePointerDownHandler;
  #handlePointerUpHandler;
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
      if (!this.#handlePointerDownHandler) {
        this.#handlePointerDownHandler = this.#handlePointerDown.bind(this);
        this.#handlePointerUpHandler = this.#handlePointerUp.bind(this);
        document.addEventListener('pointerdown', this.#handlePointerDownHandler);
        document.addEventListener('pointerup', this.#handlePointerUpHandler);
      }
      this.#nodeResizeEdge = edge;
      return;
    }
  }

  #cacheWidth;
  #cacheHeight;
  #handlePointerDown(e) {
    const { left, top, width, height } = this.getBoundingClientRect();
    const x = e.x - left;
    const y = e.y - top;;
    this.#startX = x;
    this.#startY = y;
    this.#startWidth = width;
    this.#startHeight = height;
    this.#cacheWidth = this.width;
    this.#cacheHeight = this.height;
    this.#nodeResize.isResizing = true;
    this.#updateSize(x, y);
  }

  #handlePointerUp(e) {
    console.log('foo')
    this.#nodeResize.isResizing = false;
  }

  #updateSize(x: number, y: number) {
    switch(this.#nodeResize.resize) {
      case 'nw':

        break;
      case 'n':

        break;
      case 'ne':

        break;
      case 'e':
        const offsetX = (this.#startWidth - 1) - this.#startX;
        const diff = (x - this.#startX) - offsetX;
        const nWidth = this.#startWidth + diff;
        this.#nodeResize.style.width = `${nWidth + 20}px`;
        console.log(x - this.#startX);
        this.width = this.#cacheWidth + Math.floor((x - this.#startX) / 20);
        break;
      case 'se':

        break;
      case 's':

        break;
      case 'sw':

        break;
      case 'w':

        break;
    }
    //const nWidth = this.#startWidth + (x - this.#startX);
    //const nHeight = this.#startHeight - this.#startY - y;
    //this.#nodeResize.style.width = `${nWidth + 20}px`;
    //this.#nodeResize.style.height = `${nHeight + 20}px`;
  }

  #handlePointerMove2(e) {
    console.log('foos');
  }

  #removeResize() {
    if (this.#nodeResize) {
      this.#nodeResize.remove();
      this.#nodeResizeEdge = '';
      document.removeEventListener('pointerdown', this.#handlePointerDownHandler);
      document.removeEventListener('pointerup', this.#handlePointerUpHandler);
      this.#handlePointerDownHandler = null;
    }
  }

  render(changes) {
    if (changes.text) {
      this.$textarea.value = this.text;
    }
  }
}
