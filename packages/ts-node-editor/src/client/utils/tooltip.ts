import UiTooltip from './../element/tooltip/tooltip.js';

let cacheTooltip: UiTooltip;
let cacheHandlePointerEnter: EventListenerOrEventListenerObject;

/**
 * Wire up a tooltip on the connectedCallback
 * @param element Element
 * @param value Function returning tooltip value.
 */
export function wireTooltip(element: HTMLElement | SVGElement, value: () => string) {
    function handlePointerLeave() {
        cacheTooltip.remove();
    }

    cacheHandlePointerEnter = function (e) {
        if (cacheTooltip) {
            cacheTooltip.remove();
        }
        cacheTooltip = document.createElement('ui-tooltip') as UiTooltip;
        const rect = element.getBoundingClientRect();
        cacheTooltip.style.setProperty('--ui-tooltip-x', `${rect.left}px`);
        cacheTooltip.style.setProperty('--ui-tooltip-y', `${rect.bottom}px`);
        cacheTooltip.text = value();
        document.body.appendChild(cacheTooltip);
        element.addEventListener('pointerleave', handlePointerLeave);
    }

    element.addEventListener('mouseenter', cacheHandlePointerEnter);
}

export function unwireTooltip(element: HTMLElement | SVGElement) {
    if (cacheHandlePointerEnter) {
        element.removeEventListener('mouseleave', cacheHandlePointerEnter);
    }
}
