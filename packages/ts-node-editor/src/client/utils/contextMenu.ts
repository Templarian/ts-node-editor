function handleContextMenu() {
    console.log('create menu')
}

/**
 * 
 * @param element Attach to a part in connectedCallback
 * @param options Ex: [{ label, value }, null]
 */
export function wireContextMenu(element: HTMLElement, options: () => {}) {
    element.addEventListener('contextmenu', handleContextMenu);
}

export function unwireContextMenu($part: HTMLElement) {
    
}
