import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Variables to track the mouse position and panel's position
let isDragging = false;
let offsetX, offsetY;

export function setupPanelHandler(panel) {
    document.addEventListener('mousedown', (event) => onMouseDown(panel, event));
    document.addEventListener('mousemove', (event) => onMouseMove(panel, event));
    document.addEventListener('mouseup', (event) => onMouseUp(panel, event));
}

function onMouseDown(panel, event) {
    // Prevent dragging if clicking on a link
    if (event.target.tagName === 'A') {
        return;
    }
    
    isDragging = true;
    
    offsetX = event.clientX - panel.getBoundingClientRect().left;
    offsetY = event.clientY - panel.getBoundingClientRect().top;
    
    panel.style.cursor = 'grabbing';
}

function onMouseMove(panel, event) {
    if (isDragging) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // Calculate new position based on mouse movement
        let newX = mouseX - offsetX;
        let newY = mouseY - offsetY;

        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = panel.offsetWidth;
        const panelHeight = panel.offsetHeight;

        // Add bound to the panel to stay within the browser window
        newX = Math.max(0, Math.min(windowWidth - panelWidth, newX));
        newY = Math.max(0, Math.min(windowHeight - panelHeight, newY));
        
        panel.style.left = `${newX}px`;
        panel.style.top = `${newY}px`;
    }
}
function onMouseUp(panel, event) {
    isDragging = false;
    
    panel.style.cursor = 'pointer';
}
