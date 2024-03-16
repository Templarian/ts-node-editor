import UiMenu from '../ui/menu/menu';

interface Option {
    key: string,
    [key: string]: any
}

type Events = {
    open: ($menu: UiMenu, x: number, y: number) => void;
    select: (item: any) => void;
    close?: (wasItemSelected: boolean) => void;
};

function handleContextMenu(e: any, events: Events) {
    if (e.currentTarget !== e.target) {
        return;
    }
    e.preventDefault();
    const $menu = document.createElement('ui-menu') as UiMenu;
    $menu.style.setProperty('--ui-menu-x', `${e.pageX}`);
    $menu.style.setProperty('--ui-menu-y', `${e.pageY}`);
    $menu.options = [];
    const rect = e.target.getBoundingClientRect();
    events.open(
        $menu,
        e.pageX - rect.x,
        e.pageY - rect.y
    );
    const handleMouseDown = (e2: any) => {
        if (e2.target.dataset.active === 'true') {
            return;
        }
        $menu.remove();
        document.removeEventListener('mousedown', handleMouseDown);
        events.close && events.close(false);
    };
    $menu.addEventListener('select', (e2: any) => {
        const { item } = e2.detail;
        events.select(item);
        $menu.remove();
        document.removeEventListener('mousedown', handleMouseDown);
        events.close && events.close(true);
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
export function wireContextMenu(element: HTMLElement, events: Events) {
    element.addEventListener('contextmenu', function (e) {
        handleContextMenu(e, events);
    });
}

export function unwireContextMenu(element: HTMLElement) {
    
}
