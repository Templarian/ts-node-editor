import UiMenu from '../ui/menu/menu';

function handleContextMenu(e: any, options: () => any[]) {
    if (e.currentTarget !== e.target) {
        return;
    }
    e.preventDefault();
    const $menu = document.createElement('ui-menu') as UiMenu;
    $menu.style.setProperty('--ui-menu-x', `${e.pageX}`);
    $menu.style.setProperty('--ui-menu-y', `${e.pageY}`);
    $menu.options = options();
    $menu.addEventListener('select', (e: any) => {
        const { item } = e.detail;
    });
    document.body.appendChild($menu);
}

/**
 * 
 * @param element Attach to a part in connectedCallback
 * @param options Ex: [{ label, value }, null]
 */
export function wireContextMenu(element: HTMLElement, options: () => any[]) {
    element.addEventListener('contextmenu', function (e) {
        handleContextMenu(e, options);
    });
}

export function unwireContextMenu(element: HTMLElement) {
    
}
