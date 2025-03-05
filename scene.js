import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Cube geometry
    const geometry = new THREE.BoxGeometry(1, 1, 1);

    // Outline creation
    const edges = new THREE.EdgesGeometry(geometry); // Extract edges of the geometry
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 }); // Black outline
    const outline = new THREE.LineSegments(edges, lineMaterial); // Render the edges as line segments
    
    const group = new THREE.Group();
    group.add(outline);
    
    scene.add(group);
    
    return { scene, group };
}