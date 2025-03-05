import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee); // Light gray background

// Set up the camera 
const aspectRatio = window.innerWidth / window.innerHeight;
const cameraWidth = 10; 
const cameraHeight = cameraWidth / aspectRatio;

// Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.OrthographicCamera(
    -cameraWidth, // left
    cameraWidth,  // right
    cameraHeight, // top
    -cameraHeight, // bottom
    0.1,          // near plane
    1000          // far plane
);

// Position the camera
camera.position.set(10, 10, 10); 
camera.lookAt(new THREE.Vector3(0, 0, 0)); 

scene.add(camera);

// Cube geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Outline
const edges = new THREE.EdgesGeometry(geometry); // Extract edges of the geometry
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }); // Black outline
const outline = new THREE.LineSegments(edges, lineMaterial); // Render the edges as line segments
scene.add(outline);


function animate() {
    requestAnimationFrame(animate);
    outline.rotation.x += 0.01; 
    outline.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();