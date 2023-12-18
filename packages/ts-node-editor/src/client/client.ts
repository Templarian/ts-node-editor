import './element/button/button';
import './element/comment/comment';
import './element/header/header';
import './element/icon/icon.js';
import './element/menu/menu';
import './element/nodeContainer/nodeContainer';
import './element/nodeHandle/nodeHandle';
import './element/nodeConnection/nodeConnection';
import './element/seperator/seperator';
import './element/tooltip/tooltip';

import UiIcon from './element/icon/icon.js';

const icons = {
    script: 'M20 1H5V2H4V15H6V3H15V19H13V18H12V17H1V20H2V21H16V20H17V3H19V5H21V2H20'
};

// Dom Functions
function addScript(filename) {
    const scriptMenu = document.getElementById('scriptMenu');
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(filename));
    button.setAttribute('title', `${filename}`);
    scriptMenu.appendChild(button);
}
function addNode(node) {

}
// Init
async function init() {
    const scripts = await fetch('api/script');

}
init();
const drags = document.querySelectorAll('[data-drag]');
let clientX, clientY, pX, pY, parents;
function handler(e) {
    if (clientX && clientY) {
        const x = Math.floor((e.clientX - clientX) / 20);
        const y = Math.floor((e.clientY - clientY) / 20);
        if (pX + x >= 0) {
            parents.style.setProperty('--node-x', pX + x);
        }
        if (pY + y >= 0) {
            parents.style.setProperty('--node-y', pY + y);
        }
    }
}
function handleUp(e) {
    clientX = null;
    clientY = null;
    document.removeEventListener('pointermove', handler);
    parents.style.setProperty('user-select', null);
    parents.classList.remove('drag');
}
drags.forEach(drag => {
    drag.addEventListener('pointerdown', (e: PointerEvent) => {
        clientX = e.clientX;
        clientY = e.clientY;
        const currentTarget = e.currentTarget as Element;
        parents = currentTarget.parentNode.parentNode;
        parents.style.setProperty('user-select', 'none');
        parents.classList.add('drag');
        pX = parseInt(parents.style.getPropertyValue('--node-x'), 10);
        pY = parseInt(parents.style.getPropertyValue('--node-y'), 10);
        document.addEventListener('pointermove', handler);
        document.addEventListener('pointerup', handleUp);
    });
});
/*
let showMenu = false;
document.getElementById('select').addEventListener('mousedown', (e) => {
    document.getElementById('menu').classList.toggle('show', !showMenu);
    showMenu = !showMenu;
});
*/
let debugMode = true;
document.getElementById('debug').addEventListener('click', (e) => {
    const icon = document.getElementById('debugCheck') as UiIcon;
    icon.name = debugMode ? 'checkbox-blank' : 'checkbox-marked';
    debugMode = !debugMode;
});
document.getElementById('newScript').addEventListener('click', async () => {
    const foo = await fetch("api/node/1", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        }
    });
});
const grid = document.getElementById('grid');
const gridHover = document.getElementById('gridHover');
const gridMenu = document.getElementById('gridMenu');
const gridRect = grid.getBoundingClientRect();
let gridOpen = false;
function updateHover(e) {
    const gridSize = 20;
    if (e.target.classList.contains('grid')) {
        const x = Math.floor((e.clientX - gridRect.left) / gridSize);
        const y = Math.floor((e.clientY - gridRect.top) / gridSize);
        gridHover.style.setProperty('--node-x', `${x}`);
        gridHover.style.setProperty('--node-y', `${y}`);
        gridHover.classList.remove('hide');
    } else {
        gridHover.classList.add('hide');
    }
}
grid.addEventListener('contextmenu', async (e) => {
    updateHover(e);
    // Ignore
    const target = e.target as Element;
    if (!target.classList.contains('grid')) {
        return;
    }
    // Other
    gridOpen = true;
    const menuX = Math.floor(e.clientX);
    const menuY = Math.floor(e.clientY);
    gridMenu.style.setProperty('--menu-x', `${menuX}`);
    gridMenu.style.setProperty('--menu-y', `${menuY}`);
    gridMenu.classList.add('open');
    gridHover.classList.add('open');
    e.preventDefault();
    // Fetch
    const items = await (await fetch('api/nodes')).json();
    (items as any).forEach((item) => {
        console.log(item);
    })
    function clickOff() {
        gridOpen = false;
        gridMenu.classList.remove('open');
        gridHover.classList.remove('open');
        document.removeEventListener('pointerdown', clickOff);
        document.body.removeEventListener('pointerleave', clickOff);
    }
    document.addEventListener('pointerdown', clickOff);
    document.body.addEventListener('pointerleave', clickOff);
});
grid.addEventListener('pointermove', (e) => {
    if (!gridOpen) {
        updateHover(e);
    }
});
grid.addEventListener('pointerdown', (e) => {
    updateHover(e);
});
