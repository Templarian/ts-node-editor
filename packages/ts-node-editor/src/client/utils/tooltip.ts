import UiTooltip from './../ui/tooltip/tooltip';

let cacheTooltip: UiTooltip;
let cacheHandlePointerEnter: EventListenerOrEventListenerObject;

/**
 * Wire up a tooltip in the connectedCallback
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
        cacheTooltip.sourceWidth = rect.width;
        cacheTooltip.sourceHeight = rect.height;
        cacheTooltip.style.setProperty('--ui-tooltip-x', `${rect.left}px`);
        cacheTooltip.style.setProperty('--ui-tooltip-y', `${rect.bottom + 6}px`);
        cacheTooltip.text = value();
        document.body.appendChild(cacheTooltip);
        element.addEventListener('pointerleave', handlePointerLeave);
    }

    element.addEventListener('mouseenter', cacheHandlePointerEnter);
}

/**
 * Unwire a tooltip if it exists.
 * @param element Element
 */
export function unwireTooltip(element: HTMLElement | SVGElement) {
    if (cacheHandlePointerEnter) {
        element.removeEventListener('mouseleave', cacheHandlePointerEnter);
    }
}
