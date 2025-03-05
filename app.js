import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

import { createScene } from './scene.js';
import { createRenderer } from './renderer.js';
import { createCamera } from './camera.js';

// Main init 
function init () {
    const { scene, group } = createScene();
    const renderer = createRenderer();
    const camera = createCamera();

    scene.add(camera);
    
    animate(scene, group, camera, renderer)
}

function animate(scene, group, camera, renderer) {
    requestAnimationFrame(() => animate(scene, group, camera, renderer));
    
    if (group) {
        group.rotation.x += 0.01;  // Rotating cube around the X-axis
        group.rotation.y += 0.01;  // Rotating cube around the Y-axis
    }
   
    renderer.render(scene, camera);
}

init();