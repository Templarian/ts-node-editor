import UiMenu from '../ui/menu/menu';
import UiMenuItem from '../ui/menuItem/menuItem';
import UiMenuSeperator from '../ui/menuSeperator/menuSeperator';

function handleContextMenu(e: any) {
    if (e.currentTarget !== e.target) {
        return;
    }
    e.preventDefault();
    const $menu = document.createElement('ui-menu') as UiMenu;
    $menu.options = [{
        type: UiMenuItem,
        label: 'testing',
        key: 0
    }, {
        type: UiMenuSeperator,
        key: 1
    }];
    $menu.style.setProperty('--ui-menu-x', `${e.pageX}`);
    $menu.style.setProperty('--ui-menu-y', `${e.pageY}`);
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
export function wireContextMenu(element: HTMLElement, options: () => {}) {
    element.addEventListener('contextmenu', handleContextMenu);
}

export function unwireContextMenu(element: HTMLElement) {
    
}
