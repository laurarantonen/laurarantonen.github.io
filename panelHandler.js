let currentlyDragging = null;
let isDragging = false;
let offsetX = 0, offsetY = 0;

export function setupPanelHandler(panel) {
    panel.style.position = 'absolute';
    
    panel.addEventListener('mousedown', (event) => onMouseDown(panel, event));
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

function onMouseDown(panel, event) {
    // Prevent any text selection or other default browser behaviors while dragging
    event.preventDefault();
    
    if (!currentlyDragging && !isClickableElement(event.target)) {
        currentlyDragging = panel;
            isDragging = true;
            offsetX = event.clientX - panel.offsetLeft;
            offsetY = event.clientY - panel.offsetTop;
            
            document.body.style.cursor = 'grabbing';
    }
}

function onMouseMove(event) {
    if (currentlyDragging && isDragging) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        let newX = mouseX - offsetX;
        let newY = mouseY - offsetY;

        // Get the window & panel dimensions
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const panelWidth = currentlyDragging.offsetWidth;
        const panelHeight = currentlyDragging.offsetHeight;
        
        newX = Math.max(0, Math.min(windowWidth - panelWidth, newX));
        newY = Math.max(0, Math.min(windowHeight - panelHeight, newY));
        
        currentlyDragging.style.left = `${newX}px`;
        currentlyDragging.style.top = `${newY}px`;
    }
}

function onMouseUp() {
    isDragging = false;
    currentlyDragging = null;

    // Reset cursor to default after dragging
    document.body.style.cursor = 'default';
}

// Function to check if the element is clickable (e.g., links, buttons)
function isClickableElement(element) {
    return element.tagName === 'A' || element.tagName === 'BUTTON' || element.hasAttribute('role') && element.getAttribute('role') === 'button';
}
