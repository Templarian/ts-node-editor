import { Component, Prop, Part } from '@pictogrammers/element';
import { wireContextMenu, unwireContextMenu } from './../../utils/contextMenu';

import template from "./grid.html";
import style from './grid.css';

import UiNodeComment from '../nodeComment/nodeComment';
import UiNodeEntry from '../nodeEntry/nodeEntry';
import UiNodeFunction from '../nodeFunction/nodeFunction';
import UiNodeImport from '../nodeImport/nodeImport';

@Component({
  selector: 'ui-grid',
  style,
  template
})
export default class UiGrid extends HTMLElement {
  @Part() $grid: HTMLDivElement;

  connectedCallback() {
    wireContextMenu(this.$grid, this.computeOptions);
    this.addEventListener('handledown', this.handleDown.bind(this));
  }

  handleDown(e: any) {
    console.log(e.detail);
  }

  computeOptions() {
    return [];
  }

  render(changes) {

  }

  #comments = [];

  #addComment(config: any) {
    const { $x, $y, $width, $height, text } = config;
    const $nodeComment = document.createElement('ui-node-comment') as UiNodeComment;
    $nodeComment.x = $x;
    $nodeComment.y = $y;
    $nodeComment.width = $width;
    $nodeComment.height = $height;
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

  #addNode(config: any) {
    const { $type } = config;
    switch($type) {
      case 'entry': {
        const { $x, $y, icon } = config;
        this.#addNodeEntry($x, $y, icon);
        break;
      }
      case 'function': {
        const { $x, $y, $width, $height, ...options } = config;
        this.#addNodeFunction($x, $y, $width, $height, options);
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

  #addNodeEntry(x: number, y: number, icon: string) {
    const $nodeComment = document.createElement('ui-node-entry') as UiNodeEntry;
    $nodeComment.x = x;
    $nodeComment.y = y;
    this.$grid.appendChild($nodeComment);
    this.#nodes.push({
      $x: x,
      $y: y,
      icon: icon
    });
  }

  #addNodeFunction(x: number, y: number, width: number, height: number, options: any) {
    if (this.#nodes.length === 0) {
      throw 'First node must be type "entry".'
    }
    const $nodeComment = document.createElement('ui-node-function') as UiNodeFunction;
    $nodeComment.x = x;
    $nodeComment.y = y;
    $nodeComment.width = width;
    $nodeComment.height = height;
    this.$grid.appendChild($nodeComment);
    this.#nodes.push({
      $x: x,
      $y: y,
      $width: width,
      $height: height,
      ...options
    });
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
  }

  @Prop()
  get addNode() {
    return this.#addNode;
  }

}
