import UiNodeBase from '../ui/nodeBase/nodeBase';
import UiNodeTransform from '../ui/nodeTransform/nodeTransform';

// There can only be one...
let $nodeTransform: UiNodeTransform;
const events = new Map();
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let resizable: boolean;
let moveable: boolean;
let minWidth: number;
let minHeight: number;
let maxWidth: number;
let maxHeight: number;
let nodeTransformEdge: string = '';

interface Config {
  resizable?: boolean,
  moveable?: boolean,
  minWidth?: number,
  minHeight?: number,
  maxWidth?: number,
  maxHeight?: number,
}

function handlePointerMove(e: any) {
  const {
    left,
    top,
    height,
    width
  } = this.getBoundingClientRect();
  const x = e.x - left;
  const y = e.y - top;
  const o = 16;
  const c = 12;
  if ($nodeTransform.isResizing) {
    updateSize(this, x, y);
  } else if (x <= -o || y <= -o || x > width + o || y > height + o) {
    removeResize(this);
    const { pointerMove } = events.get(this);
    document.removeEventListener('pointermove', pointerMove);
    document.body.style.cursor = null;
  } else if (x >= c && x <= width - c && y >= -o && y <= 4) {
    showResize(this, left, top, width, height, 'n');
    document.body.style.cursor = 'n-resize';
  } else if (x >= width - 4 && x <= width + o && y >= c && y <= height - c) {
    showResize(this, left, top, width, height, 'e');
    document.body.style.cursor = 'e-resize';
  } else if (x >= c && x <= width - c && y >= height - 4 && y <= height + o) {
    showResize(this, left, top, width, height, 's');
    document.body.style.cursor = 's-resize';
  } else if (x >= -o && x <= 4 && y >= c && y <= height - c) {
    showResize(this, left, top, width, height, 'w');
    document.body.style.cursor = 'w-resize';
  } else if (x <= c && x >= -o && y <= c && y >= -o) {
    showResize(this, left, top, width, height, 'nw');
    document.body.style.cursor = 'nw-resize';
  } else if (x <= width + o && x >= width - c && y <= c && y >= -o) {
    showResize(this, left, top, width, height, 'ne');
    document.body.style.cursor = 'ne-resize';
  } else if (x <= c && x >= -o && y <= height + o && y >= height - c) {
    showResize(this, left, top, width, height, 'sw');
    document.body.style.cursor = 'sw-resize';
  } else if (x <= width + o && x >= width - c && y <= height + o && y >= height - c) {
    showResize(this, left, top, width, height, 'se');
    document.body.style.cursor = 'se-resize';
  } else {
    removeResize(this);
    document.body.style.cursor = null;
  }
}

function handlePointerEnter(e) {
  const rect = this.getBoundingClientRect();
  const outer = 10;
  $nodeTransform.style.left = `${rect.x - outer}px`;
  $nodeTransform.style.top = `${rect.y - outer}px`;
  $nodeTransform.style.width = `${rect.width + (outer * 2)}px`;
  $nodeTransform.style.height = `${rect.height + (outer * 2)}px`;
  $nodeTransform.visible = true;

  const event = handlePointerMove.bind(this);
  events.get(this).pointerMove = event;
  document.addEventListener('pointermove', event);
}

/**
 * Wire up a transform node handler in the connectedCallback
 * @param element Element
 * @param value Function returning tooltip value.
 */
export function wireTransformNode(element: UiNodeBase, config: Config) {
  const resizable = config.resizable || false;
  const moveable = config.moveable || false;
  const minWidth = config.minWidth || 2;
  const minHeight = config.minHeight || 2;
  const maxWidth = config.maxWidth || 2;
  const maxHeight = config.maxHeight || 2;

  if (!$nodeTransform) {
    $nodeTransform = document.createElement('ui-node-transform') as UiNodeTransform;
    document.body.appendChild($nodeTransform);
  }

  const event = handlePointerEnter.bind(element);
  events.set(element, { pointerEvent: event });
  element.addEventListener('pointerenter', event);
}

function showResize($node: HTMLElement, x: number, y: number, width: number, height: number, edge: string) {
  if (nodeTransformEdge === '') {
    $nodeTransform.edge = edge;
  }
  if (nodeTransformEdge !== edge) {
    $nodeTransform.edge = edge;
    console.log('edge', edge);
    const pointerDown = handlePointerDown.bind($node);
    events.get($node).pointerDown = pointerDown;
    const pointerUp = handlePointerUp.bind($node);
    events.get($node).pointerUp = pointerUp;
    document.addEventListener('pointerdown', pointerDown);
    document.addEventListener('pointerup', pointerUp);
    nodeTransformEdge = edge;
    return;
  }
}

let cacheWidth;
let cacheHeight;
function handlePointerDown(e) {
  const { left, top, width, height } = this.getBoundingClientRect();
  const x = e.x - left;
  const y = e.y - top;;
  startX = x;
  startY = y;
  startWidth = width;
  startHeight = height;
  cacheWidth = this.width;
  cacheHeight = this.height;
  $nodeTransform.isResizing = true;
  updateSize(this, x, y);
}

function handlePointerUp(e) {
  console.log('foo')
  $nodeTransform.isResizing = false;
}

function updateSize($node, x: number, y: number) {
  switch ($nodeTransform.edge) {
    case 'nw':

      break;
    case 'n':

      break;
    case 'ne':

      break;
    case 'e':
      const offsetX = (startWidth - 1) - startX;
      const diff = (x - startX) - offsetX;
      const nWidth = startWidth + diff;
      $nodeTransform.style.width = `${nWidth + 20}px`;
      console.log(x - startX);
      $node.width = cacheWidth + Math.floor((x - startX) / 20);
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
  //const nWidth = startWidth + (x - startX);
  //const nHeight = startHeight - startY - y;
  //nodeResize.style.width = `${nWidth + 20}px`;
  //nodeResize.style.height = `${nHeight + 20}px`;
}

function removeResize($node: HTMLElement) {
  console.log('remove');
  $nodeTransform.visible = false;
  nodeTransformEdge = '';
  const { pointerDown, pointerUp } = events.get($node);
  document.removeEventListener('pointerdown', pointerDown);
  document.removeEventListener('pointerup', pointerUp);
}

/**
 * Remove transform node handler
 * @param element Element
 */
export function unwireTransformNode(element: HTMLElement | SVGElement) {
  element.removeEventListener('mouseleave', events.get(element));
  events.delete(element);
}
