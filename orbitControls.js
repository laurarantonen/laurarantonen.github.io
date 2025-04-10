import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/controls/OrbitControls.js';

export function setupOrbitControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    
    // Configure orbit controls
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 12;
    controls.maxPolarAngle = Math.PI / 2;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.3;
    
    return controls;
} 