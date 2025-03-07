import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { enableScrollZoom } from './zoom.js';
import { createCamera, frustumSize } from './camera.js';
import { setupClickHandler } from './clickHandler.js';
import { setupResizeHandler } from './resizeHandler.js';
import { setupPanelHandler } from './panelHandler.js';

// Main init 
function init () {
    const { scene, group } = createScene();
    const renderer = createRenderer();
    const camera = createCamera();
    
    scene.add(camera);

    // Enable scroll zooming with minZoom and maxZoom values
    const disableZoom = enableScrollZoom(camera, 0.5, 2);

    // Init click handler for test cube
    setupClickHandler(group.children[0], camera);
    
    // Init window resize handler
    setupResizeHandler(camera, frustumSize, renderer);
    
    // Init panel handler for UI, if one exists
    const defaultPanel = document.getElementById('defaultPanel');
    if (defaultPanel){
        setupPanelHandler(defaultPanel);   
    }
    const secondPanel = document.getElementById('secondPanel');
    if (secondPanel){
        setupPanelHandler(secondPanel);
    }

    animate(scene, group, camera, renderer)
}

function animate(scene, group, camera, renderer) {
    requestAnimationFrame(() => animate(scene, group, camera, renderer));

    const time = performance.now() * 0.002; // Time-based movement
    
    if (group) {
        //group.rotation.x += 0.01;  // Rotating cube around the X-axis
        group.rotation.y += 0.01;  // Rotating cube around the Y-axis
        group.position.y = 0.8 + Math.sin(time) * 0.2; // Float effect
    }
   
    renderer.render(scene, camera);
}

init();