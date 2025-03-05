import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Cube geometry
    const cube = new THREE.BoxGeometry(1, 1, 1);

    // Outline creation
    const edges = new THREE.EdgesGeometry(cube); // Extract edges of the geometry
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1 }); // Black outline
    const outline = new THREE.LineSegments(edges, lineMaterial); // Render the edges as line segments
    
    const group = new THREE.Group();
    group.add(outline);
    group.position.y = 2;
    
    /* Temp room objects */

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(5, 5);
    const floorMaterial = new THREE.MeshLambertMaterial({ color: 0xc0c0c0 });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -.5; 
    scene.add(floor);

    // Walls
    function createWall(x, y, z, width, height, depth, color) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        const material = new THREE.MeshStandardMaterial({ color: color});
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x, y, z);
        scene.add(wall);
        return wall;
    }

    // Create walls around the room
    createWall(0, 1.5, -2.5, 5, 4, 0.2, 0xaaaaaa); // Back wall
    createWall(-2.5, 1.5, 0, 0.2, 4, 5, 0xbbbbbb); // Left wall
    
    scene.add(group);

    // Light sources
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft global light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);
    
    return { scene, group };
}