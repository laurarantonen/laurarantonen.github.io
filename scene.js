import * as THREE from 'three';
import { createFlower } from './flower.js';
import { modelLoaded } from './meshLoader.js';

export function createGradientTexture(color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const colors = color1 && color2 ? 
        { color1, color2 } : 
        getRandomPetalColors();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, colors.color1);
    gradient.addColorStop(1, colors.color2);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export function createScene() {
    const scene = new THREE.Scene();
    scene.background = null;
    
    scene.fog = new THREE.FogExp2(0xf0f0f0, 0.065);
    
    const gridHelper = new THREE.GridHelper(50, 50, 0x9c9a9a, 0x9c9a9a);
    gridHelper.position.y = 0;
    scene.add(gridHelper);
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    return scene;
}
