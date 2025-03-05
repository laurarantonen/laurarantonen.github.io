import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export const frustumSize = 7;

export function createCamera() {
    
    // Set up the camera 
    const aspectRatio = window.innerWidth / window.innerHeight;

    const camera = new THREE.OrthographicCamera(
        -frustumSize * aspectRatio, // left
        frustumSize * aspectRatio,  // right
        frustumSize, // top
        -frustumSize, // bottom
        0.1,          // near plane
        1000          // far plane
    );

    // Position the camera
    camera.position.set(10, 10, 10);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    return camera;
}