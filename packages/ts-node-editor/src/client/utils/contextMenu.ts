import UiMenu from '../ui/menu/menu';

function handleContextMenu(e: any, options: () => any[], handler: (item: any) => void) {
    if (e.currentTarget !== e.target) {
        return;
    }
    e.preventDefault();
    const $menu = document.createElement('ui-menu') as UiMenu;
    $menu.style.setProperty('--ui-menu-x', `${e.pageX}`);
    $menu.style.setProperty('--ui-menu-y', `${e.pageY}`);
    $menu.options = options();
    const handleMouseDown = (e2: any) => {
        if (e2.target.dataset.active === 'true') {
            return;
        }
        $menu.remove();
        document.removeEventListener('mousedown', handleMouseDown);
    };
    $menu.addEventListener('select', (e2: any) => {
        const { item } = e2.detail;
        handler(item);
        $menu.remove();
        document.removeEventListener('mousedown', handleMouseDown);
    });
    $menu.dataset.active = 'true';
    document.body.appendChild($menu);
    document.addEventListener('mousedown', handleMouseDown);
}

/**
 * 
 * @param element Attach to a part in connectedCallback
 * @param options Ex: [{ label, value }, null]
 * @param handler Ex: (item) => { }
 */
export function wireContextMenu(element: HTMLElement, options: () => any[], handler: (item: any) => void) {
    element.addEventListener('contextmenu', function (e) {
        handleContextMenu(e, options, handler);
    });
}

export function unwireContextMenu(element: HTMLElement) {
    
}
