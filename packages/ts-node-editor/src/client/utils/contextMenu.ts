function handleContextMenu() {
    
}

/**
 * 
 * @param $part Attach to a part in connectedCallback
 */
export function wireContextMenu($part: HTMLElement, options: () => {}) {
    this.$part.addEventListener('contextmenu', handleContextMenu);
}

export function unwireContextMenu($part: HTMLElement) {

}
