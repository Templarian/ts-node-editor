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
const del = document.getElementById('delete');
del.addEventListener('click', (e) => {
    console.log('delete');
    e.preventDefault();
});
let showMenu = false;
document.getElementById('select').addEventListener('mousedown', (e) => {
    document.getElementById('menu').classList.toggle('show', !showMenu);
    showMenu = !showMenu;
});
let debugMode = true;
document.getElementById('debug').addEventListener('click', (e) => {
    document.getElementById('check').setAttribute('d', debugMode
        ? 'M7 8V9H9V8H10V7H11V6H12V5H13V4H14V3H16V5H15V6H14V7H13V8H12V9H11V10H10V11H9V12H7V11H6V10H5V9H4V7H6V8H7M1 1H2V0H14V1H15V2H3V3H2V13H3V14H13V13H14V8H15V7H16V14H15V15H14V16H2V15H1V14H0V2H1V1Z'
        : 'M1 1H2V0H14V1H15V2H16V14H15V15H14V16H2V15H1V14H0V2H1V1M13 13H14V3H13V2H3V3H2V13H3V14H13V13Z'
    );
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
    const x = Math.floor((e.clientX - gridRect.left) / 20);
    const y = Math.floor((e.clientY - gridRect.top) / 20);
    gridHover.style.setProperty('--node-x', `${x}`);
    gridHover.style.setProperty('--node-y', `${y}`);
}
grid.addEventListener('contextmenu', (e) => {
    updateHover(e);
    // Other
    gridOpen = true;
    const menuX = Math.floor(e.clientX);
    const menuY = Math.floor(e.clientY);
    gridMenu.style.setProperty('--menu-x', `${menuX}`);
    gridMenu.style.setProperty('--menu-y', `${menuY}`);
    gridMenu.classList.add('open');
    gridHover.classList.add('open');
    e.preventDefault();
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
grid.addEventListener('pointerenter', () => {
    console.log('enter');
});
grid.addEventListener('pointerleave', () => {
    console.log('leave');
});
grid.addEventListener('pointermove', (e) => {
    if (!gridOpen) {
        updateHover(e);
    }
});
grid.addEventListener('pointerdown', (e) => {
    updateHover(e);
});