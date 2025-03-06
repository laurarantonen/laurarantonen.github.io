import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

let glowing = false;

export function setupClickHandler(outline, camera) {
    window.addEventListener('click', (event) => onMouseClick(event, outline, camera), false);
}

function onMouseClick(event, outline, camera) {
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();

    // Convert mouse position to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    
    // If outline was clicked
    const intersects = raycaster.intersectObject(outline);

    if (intersects.length > 0) {
        // Get a random color
        const randomColor = Math.random() * 0xffffff;
        outline.material.color.set(randomColor);
    }
}
