import { Component, Prop, Part } from '@pictogrammers/element';
import { wireContextMenu, unwireContextMenu } from './../../utils/contextMenu';

import template from "./grid.html";
import style from './grid.css';

import UiNodeComment from '../nodeComment/nodeComment';
import UiNodeEntry from '../nodeEntry/nodeEntry';
import UiNodeFunction from '../nodeFunction/nodeFunction';
import UiNodeImport from '../nodeImport/nodeImport';
import UiNodeHandle from '../nodeHandle/nodeHandle';
import UiNodeConnection from '../nodeConnection/nodeConnection';
import UiMenu from '../menu/menu';
import { getPath } from '../../utils/mouse';

@Component({
  selector: 'ui-grid',
  style,
  template
})
export default class UiGrid extends HTMLElement {
  @Part() $grid: HTMLDivElement;
  @Part() $scroll: HTMLDivElement;

  #cache = new Map();

  connectedCallback() {
    wireContextMenu(this.$grid, {
      open($menu: UiMenu, x: number, y: number) {
        const nX = Math.floor(x / 20);
        const nY = Math.floor(y / 20);
        console.log(nX, nY);
        $menu.options = [{
          label: 'Comment',
          icon: 'comment',
          key: '0'
        }, {
          key: '1'
        }, {
          label: 'Node 1',
          key: '2'
        }, {
          label: 'Node 2',
          key: '3'
        }];
        setTimeout(() => {
          $menu.options.push({
            label: 'Node 3',
            key: '4'
          });
        }, 3000);
      },
      select(item: any) {
        console.log(item);
      },
      close(wasItemSelected: boolean) {
        console.log('closed', wasItemSelected);
      }
    });
    this.addEventListener('handlestart', this.handleStart.bind(this));
    this.addEventListener('handlemove', this.handleMove.bind(this));
    this.addEventListener('handleend', this.handleEnd.bind(this));
    this.addEventListener('touchstart', (e) => {
      console.log('touchstart');
      if (e.touches.length > 1) {
        e.preventDefault();
        console.log('touchstart');
      }
    });
    this.$scroll.scrollTop = 400 - 32;
    this.$scroll.scrollLeft = 400 - 32;
    // Drag
    this.$grid.addEventListener('pointerdown', this.handleDragStart.bind(this));
  }

  disconnectedCallback() {
    unwireContextMenu(this.$grid);
  }

  handleDragStart() {

  }

  handleDragEnd() {

  }

  _startX;
  _startY;
  _tempConnection: UiNodeConnection;
  handleStart(e: any) {
    const { x, y } = e.detail;
    this._startX = x;
    this._startY = y;
    this._tempConnection = document.createElement('ui-node-connection') as UiNodeConnection;
    this._tempConnection.x1 = x;
    this._tempConnection.y1 = y;
    this._tempConnection.temporary = true;
    this.$grid.appendChild(this._tempConnection);
  }

  handleMove(e: any) {
    const { x, y } = e.detail;
    this._tempConnection.x2 = x;
    this._tempConnection.y2 = y;
    //console.log(e.detail);
  }

  handleEnd(e: any) {
    const { x, y } = e.detail;
    if (this._startX !== x || this._startY !== y) {
      console.log(x, y);
      this._tempConnection.temporary = false;
    }
  }

  render(changes) {

  }

  cacheNodeHandle(x: number, y: number, offsetX: number, offsetY: number, element: UiNodeHandle) {
    if (!this.#cache.has(y)) {
      this.#cache.set(y, new Map());
    }
    if (!this.#cache.get(y).has(x)) {
      this.#cache.get(y).set(x, new Map());
    }
    this.#cache.get(y).get(x).set(`${offsetX},${offsetY}`, element);
  }

  #addNodeHandle(x: number, y: number, offsetX: number = 0, offsetY: number = 0) {
    const $nodeHandle = document.createElement('ui-node-handle') as UiNodeHandle;
    $nodeHandle.x = x;
    $nodeHandle.y = y;
    $nodeHandle.offsetX = offsetX;
    $nodeHandle.offsetY = offsetY;
    this.$grid.appendChild($nodeHandle);
    this.cacheNodeHandle(x, y, offsetX, offsetY, $nodeHandle);
  }

  #comments = [];

  #addComment(config: any) {
    const { $x, $y, $width, $height, text } = config;
    const $nodeComment = document.createElement('ui-node-comment') as UiNodeComment;
    $nodeComment.x = $x;
    $nodeComment.y = $y;
    $nodeComment.width = $width;
    $nodeComment.height = $height;
    $nodeComment.text = text;
    this.$grid.appendChild($nodeComment);
    this.#comments.push({
      $x,
      $y,
      $width,
      $height,
      text
    });
  }

  @Prop()
  get addComment() {
    return this.#addComment;
  }

  #nodes = [];
  #matrix = [[]];

  #addNode(config: any) {
    const { $type } = config;
    switch ($type) {
      case 'entry': {
        const { $x, $y, icon } = config;
        this.#addNodeEntry($x, $y, icon);
        break;
      }
      case 'function': {
        const { $x, $y, $width, $height, $name, ...options } = config;
        this.#addNodeFunction($x, $y, $width, $height, $name, options);
        break;
      }
      case 'import': {
        const { $x, $y, path, src } = config;
        this.#addNodeImport($x, $y, path, src);
        break;
      }
      default:
        throw `Unknown node type "${$type}"!`
    }
  }

  #cacheDots = [];
  #updateCollision() {
    const columns = 20 * 2;
    const rows = 24 * 2;
    this.#matrix = Array.from({ length: rows }, () => (
      Array.from({ length: columns }, () => 0)
    ));
    this.#cacheDots = Array.from({ length: rows * 2 }, () => (
      Array.from({ length: columns * 2 }, () => null)
    ));
    // No lines on the boxes
    [...this.#nodes, ...this.#comments].forEach(node => {
      const x = node.$x * 2;
      const y = node.$y * 2;
      const width = node.$width * 2 + 1;
      const height = node.$height * 2 + 1;
      for (let iy = y; iy < y + height; iy++) {
        for (let ix = x; ix < x + width; ix++) {
          this.#matrix[iy][ix] = 1;
        }
      }
      // Carve out the drag handles
      if (node.$type === 'function') {
        this.#matrix[y + 2][x + width - 1] = 0;
      }
    });
    let startX = null, startY = null;
    // Debug
    this.#matrix.forEach((row, rowIndex) => {
      row.forEach((column, columnIndex) => {
        const x = Math.floor(columnIndex / 2);
        const y = Math.floor(rowIndex / 2);
        const dot = document.createElement('span');
        this.#cacheDots[rowIndex][columnIndex] = dot;
        dot.style.setProperty('grid-column', `${x + 1}`);
        dot.style.setProperty('grid-row', `${y + 1}`);
        dot.style.setProperty('background', column ? 'red' : '#000');
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.transform = `translate(${columnIndex % 2 ? 6 : -4}px, ${rowIndex % 2 ? 6 : -4}px)`;
        let down = null;
        dot.addEventListener('pointerdown', () => {
          startY = rowIndex;
          startX = columnIndex;
          console.log(startX, startY);
        });
        dot.addEventListener('pointerup', () => {
          console.log(startX, startY, rowIndex, columnIndex);
          const path = getPath(this.#matrix, { x: startX, y: startY }, { x: columnIndex, y: rowIndex });
          // turn the squares a different color
          path.forEach(point => {
            this.#cacheDots[point.y][point.x].style.setProperty('background', 'green');
          });
        });
        this.$grid.appendChild(dot);
      });
    });
  }

  #addNodeEntry(x: number, y: number, icon: string) {
    const $nodeComment = document.createElement('ui-node-entry') as UiNodeEntry;
    $nodeComment.x = x;
    $nodeComment.y = y;
    this.$grid.appendChild($nodeComment);
    this.#nodes.push({
      $type: 'function',
      $x: x,
      $y: y,
      $width: 2,
      $height: 2,
      icon: icon
    });
    this.#addNodeHandle(x + 2, y + 1, -2, 0);
    this.#updateCollision();
  }

  #addNodeFunction(x: number, y: number, width: number, height: number, name: string, args: any) {
    if (this.#nodes.length === 0) {
      throw 'First node must be type "entry".'
    }
    const $nodeFunction = document.createElement('ui-node-function') as UiNodeFunction;
    $nodeFunction.x = x;
    $nodeFunction.y = y;
    $nodeFunction.width = width;
    $nodeFunction.height = height;
    $nodeFunction.name = name;
    $nodeFunction.args = args;
    this.$grid.appendChild($nodeFunction);
    this.#nodes.push({
      $x: x,
      $y: y,
      $width: width,
      $height: height,
      ...args
    });
    this.#addNodeHandle(x, y + 1, 2, 0);
    this.#addNodeHandle(x + width, y + 1, -2, 0);
    this.#updateCollision();
  }

  #addNodeImport(x: number, y: number, path: string[], src: string) {
    const $nodeComment = document.createElement('ui-node-import') as UiNodeImport;
    $nodeComment.x = x;
    $nodeComment.y = y;
    this.$grid.appendChild($nodeComment);
    this.#nodes.push({
      $x: x,
      $y: y,
      path,
      src
    });
    this.#addNodeHandle(x, y + 1);
  }

  @Prop()
  get addNode() {
    return this.#addNode;
  }

}
