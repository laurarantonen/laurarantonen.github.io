import * as THREE from 'three';
import { createScene, createFlower, getRandomPetalShape, getRandomPetalColors } from './scene.js';
import { setupPanelHandler } from './panelHandler.js';
import { setupOrbitControls } from './orbitControls.js';

let scene, camera, renderer, flowerGroup, controls;
let currentPetalShape = null; // For storing the current chosen petal shape
let autoRotate = true; // Control for camera rotation


function init() {
    scene = createScene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 5);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.body.appendChild(renderer.domElement);
    
    controls = setupOrbitControls(camera, renderer);
    
    /*Initialize all UI elements*/

    // Init panel handler for about me panel, if one exists
    const mainPanel = document.getElementById('mainPanel');
    if (mainPanel){
        setupPanelHandler(mainPanel);   
    }

    const layer1Count = document.getElementById('layer1Count');
    const layer2Count = document.getElementById('layer2Count');
    const layer3Count = document.getElementById('layer3Count');
    const stemLength = document.getElementById('stemLength');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor2 = document.getElementById('gradientColor2');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const changeShapeBtn = document.getElementById('changeShapeBtn');
    const autoRotateCheckbox = document.getElementById('autoRotate');
    
    // Initialize display values
    document.getElementById('layer1CountValue').textContent = layer1Count.value;
    document.getElementById('layer2CountValue').textContent = layer2Count.value;
    document.getElementById('layer3CountValue').textContent = layer3Count.value;
    document.getElementById('stemLengthValue').textContent = stemLength.value;
    
    // Initialize petal shape
    currentPetalShape = getRandomPetalShape();
    
    // Create initial flower
    randomizeColors();
    updateFlower();

    layer1Count.addEventListener('input', (e) => {
        document.getElementById('layer1CountValue').textContent = e.target.value;
        updateFlower();
    });
    
    layer2Count.addEventListener('input', (e) => {
        document.getElementById('layer2CountValue').textContent = e.target.value;
        updateFlower();
    });
    
    layer3Count.addEventListener('input', (e) => {
        document.getElementById('layer3CountValue').textContent = e.target.value;
        updateFlower();
    });
    
    stemLength.addEventListener('input', (e) => {
        document.getElementById('stemLengthValue').textContent = e.target.value;
        updateFlower();
    });
    
    gradientColor1.addEventListener('input', updateFlower);
    gradientColor2.addEventListener('input', updateFlower);
    
    regenerateBtn.addEventListener('click', () => {
        currentPetalShape = getRandomPetalShape();
        randomizeColors();
        updateFlower();
    });
    
    changeShapeBtn.addEventListener('click', () => {
        currentPetalShape = getRandomPetalShape();
        updateFlower();
    });

    autoRotateCheckbox.addEventListener('change', (e) => {
        controls.autoRotate = e.target.checked;
    });
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    animate();

    const showFlowerControlsButton = document.createElement('button');
    showFlowerControlsButton.id = 'showFlowerControls';
    showFlowerControlsButton.textContent = 'Show Flower Controls';
    document.body.appendChild(showFlowerControlsButton);

    const flowerControls = document.getElementById('flowerControls');
    const toggleFlowerControls = document.getElementById('toggleFlowerControls');

    toggleFlowerControls.addEventListener('click', () => {
        flowerControls.classList.add('hidden');
        showFlowerControlsButton.classList.add('visible');
    });

    showFlowerControlsButton.addEventListener('click', () => {
        flowerControls.classList.remove('hidden');
        showFlowerControlsButton.classList.remove('visible');
    });

    function randomizeColors() {
        const petalColors = getRandomPetalColors();

        if (petalColors) {
            gradientColor1.value = petalColors.color1;
            gradientColor2.value = petalColors.color2;
        }
    }
}

function reCenterCamera() {
    // Reset flower position and rotation
    if (flowerGroup) {
        flowerGroup.position.set(0, 0, 0);
        flowerGroup.rotation.set(0, 0, 0);
    }

    // Reset camera position
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 1, 0); // Look at the center of the flower

    // Reset orbit controls
    controls.reset();
    controls.target.set(0, 1, 0); // Set the point camera looks at to center of flower
    controls.update();
}

function updateFlower() {
    reCenterCamera();

    // Remove existing flower if it exists
    if (flowerGroup) {
        flowerGroup.traverse((object) => {
            if (object instanceof THREE.Mesh) {
                // Remove existing geometry and materials
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            }
        });
        scene.remove(flowerGroup);
    }
    
    // Create new flower with current chosen parameters
    flowerGroup = createFlower({
        layer1Count: parseInt(document.getElementById('layer1Count').value),
        layer2Count: parseInt(document.getElementById('layer2Count').value),
        layer3Count: parseInt(document.getElementById('layer3Count').value),
        stemLength: parseFloat(document.getElementById('stemLength').value),
        gradientColor1: document.getElementById('gradientColor1').value,
        gradientColor2: document.getElementById('gradientColor2').value,
        petalShape: currentPetalShape
    });
    
    scene.add(flowerGroup);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

init();