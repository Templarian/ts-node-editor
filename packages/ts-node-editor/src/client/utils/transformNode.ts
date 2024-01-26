import UiNodeTransform from '../ui/nodeTransform/nodeTransform';

// There can only be one...
let $nodeTransform: UiNodeTransform;
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
    updateSize(x, y);
  } else if (x <= -o || y <= -o || x > width + o || y > height + o) {
    removeResize();
    document.removeEventListener('pointermove', handlePointerMove);
    document.body.style.cursor = null;
  } else if (x >= c && x <= width - c && y >= -o && y <= 4) {
    showResize(left, top, width, height, 'n');
    document.body.style.cursor = 'n-resize';
  } else if (x >= width - 4 && x <= width + o && y >= c && y <= height - c) {
    showResize(left, top, width, height, 'e');
    document.body.style.cursor = 'e-resize';
  } else if (x >= c && x <= width - c && y >= height - 4 && y <= height + o) {
    showResize(left, top, width, height, 's');
    document.body.style.cursor = 's-resize';
  } else if (x >= -o && x <= 4 && y >= c && y <= height - c) {
    showResize(left, top, width, height, 'w');
    document.body.style.cursor = 'w-resize';
  } else if (x <= c && x >= -o && y <= c && y >= -o) {
    showResize(left, top, width, height, 'nw');
    document.body.style.cursor = 'nw-resize';
  } else if (x <= width + o && x >= width - c && y <= c && y >= -o) {
    showResize(left, top, width, height, 'ne');
    document.body.style.cursor = 'ne-resize';
  } else if (x <= c && x >= -o && y <= height + o && y >= height - c) {
    showResize(left, top, width, height, 'sw');
    document.body.style.cursor = 'sw-resize';
  } else if (x <= width + o && x >= width - c && y <= height + o && y >= height - c) {
    showResize(left, top, width, height, 'se');
    document.body.style.cursor = 'se-resize';
  } else {
    removeResize();
    document.body.style.cursor = null;
  }
}

function handlePointerEnter(e) {
  const rect = e.target.getBoundingClientRect();
  const outer = 10;
  $nodeTransform.style.left = `${rect.x - outer}px`;
  $nodeTransform.style.top = `${rect.y - outer}px`;
  $nodeTransform.style.width = `${rect.width + (outer * 2)}px`;
  $nodeTransform.style.height = `${rect.height + (outer * 2)}px`;
  document.addEventListener('pointermove', handlePointerMove);
}

function handlePointerDownHandler(e) {

}

function handlePointerUpHandler(e) {

}

/**
 * Wire up a transform node handler in the connectedCallback
 * @param element Element
 * @param value Function returning tooltip value.
 */
export function wireTransformNode(element: HTMLElement | SVGElement, config: Config) {
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

  this.addEventListener('pointerenter', handlePointerEnter);
}

function showResize(x: number, y: number, width: number, height: number, edge: string) {
  if (nodeTransformEdge === '') {
    $nodeTransform.edge = edge;
  }
  if (nodeTransformEdge !== edge) {
    $nodeTransform.edge = edge;
    console.log('edge', edge);
    document.addEventListener('pointerdown', handlePointerDownHandler);
    document.addEventListener('pointerup', handlePointerUpHandler);
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
  updateSize(x, y);
}

function handlePointerUp(e) {
  console.log('foo')
  $nodeTransform.isResizing = false;
}

function updateSize(x: number, y: number) {
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
      this.width = cacheWidth + Math.floor((x - startX) / 20);
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

function removeResize() {
  $nodeTransform.remove();
  nodeTransformEdge = '';
  document.removeEventListener('pointerdown', handlePointerDownHandler);
  document.removeEventListener('pointerup', handlePointerUpHandler);
}

/**
 * Remove transform node handler
 * @param element Element
 */
export function unwireTransformNode(element: HTMLElement | SVGElement) {
  element.removeEventListener('mouseleave', handlePointerEnter);
}
