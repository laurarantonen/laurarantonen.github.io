import * as THREE from 'three';
import { createFlower, createPetals, createStem, createLeaves, getRandomPetalShape, getRandomPetalColors } from './flower.js';
import { createScene } from './scene.js';
import { setupPanelHandler } from './panelHandler.js';
import { setupOrbitControls } from './orbitControls.js';
import { modelLoaded } from './meshLoader.js';

let scene, camera, renderer, flowerGroup, stemGroup, controls;
let currentPetalShape = null;
let autoRotate = true;

async function init() {
    const loader = document.getElementById('loader');
    
    // Initialize Three.js scene
    scene = createScene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 3, 5);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);
    
    controls = setupOrbitControls(camera, renderer);
    
    try {
        // Wait for both the models to load AND at least a second to pass
        await Promise.all([
            modelLoaded,
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);
        loader.style.display = 'none';
        
        // Init UI elements after loader is hidden
        const mainPanel = document.getElementById('mainPanel');
        const flowerControls = document.getElementById('flowerControls');
        
        if (mainPanel) {
            setupPanelHandler(mainPanel);
            setTimeout(() => {
                mainPanel.classList.add('visible');
                if (flowerControls) {
                    flowerControls.classList.add('visible');
                }
            }, 100);
        }

        const layer1Count = document.getElementById('layer1Count');
        const layer2Count = document.getElementById('layer2Count');
        const layer3Count = document.getElementById('layer3Count');
        const stemLength = document.getElementById('stemLength');
        const stemBends = document.getElementById('stemBends');
        const numLeaves = document.getElementById('numLeaves');
        const gradientColor1 = document.getElementById('gradientColor1');
        const gradientColor2 = document.getElementById('gradientColor2');
        const regenerateBtn = document.getElementById('regenerateBtn');
        const changeShapeBtn = document.getElementById('changeShapeBtn');
        const autoRotateCheckbox = document.getElementById('autoRotate');
        
        document.getElementById('layer1CountValue').textContent = layer1Count.value;
        document.getElementById('layer2CountValue').textContent = layer2Count.value;
        document.getElementById('layer3CountValue').textContent = layer3Count.value;
        document.getElementById('stemLengthValue').textContent = stemLength.value;
        document.getElementById('stemBendsValue').textContent = stemBends.value;
        document.getElementById('numLeavesValue').textContent = numLeaves.value;
        
        currentPetalShape = getRandomPetalShape();
        randomizeColors();
        updateFlower(true, true);
    } catch (error) {
        console.error('Error loading models:', error);
        // Still wait 2 seconds even if there's an error
        await new Promise(resolve => setTimeout(resolve, 2000));
        loader.style.display = 'none';
    }
    
    const layer1Count = document.getElementById('layer1Count');
    const layer2Count = document.getElementById('layer2Count');
    const layer3Count = document.getElementById('layer3Count');
    const stemLength = document.getElementById('stemLength');
    const stemBends = document.getElementById('stemBends');
    const numLeaves = document.getElementById('numLeaves');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor2 = document.getElementById('gradientColor2');
    const regenerateBtn = document.getElementById('regenerateBtn');
    const changeShapeBtn = document.getElementById('changeShapeBtn');
    const autoRotateCheckbox = document.getElementById('autoRotate');
    
    document.getElementById('layer1CountValue').textContent = layer1Count.value;
    document.getElementById('layer2CountValue').textContent = layer2Count.value;
    document.getElementById('layer3CountValue').textContent = layer3Count.value;
    document.getElementById('stemLengthValue').textContent = stemLength.value;
    document.getElementById('stemBendsValue').textContent = stemBends.value;
    document.getElementById('numLeavesValue').textContent = numLeaves.value;
    
    layer1Count.addEventListener('input', () => {
        document.getElementById('layer1CountValue').textContent = layer1Count.value;
        updateFlower(false, false);
    });
    
    layer2Count.addEventListener('input', () => {
        document.getElementById('layer2CountValue').textContent = layer2Count.value;
        updateFlower(false, false);
    });
    
    layer3Count.addEventListener('input', () => {
        document.getElementById('layer3CountValue').textContent = layer3Count.value;
        updateFlower(false, false);
    });
    
    stemLength.addEventListener('input', () => {
        document.getElementById('stemLengthValue').textContent = stemLength.value;
        updateFlower(false, true);
    });
    
    stemBends.addEventListener('input', () => {
        document.getElementById('stemBendsValue').textContent = stemBends.value;
        updateFlower(false, true);
    });
    
    numLeaves.addEventListener('input', () => {
        document.getElementById('numLeavesValue').textContent = numLeaves.value;
        updateFlower(false, true);
    });
    
    gradientColor1.addEventListener('input', () => {
        updateFlower(false, false);
    });
    
    gradientColor2.addEventListener('input', () => {
        updateFlower(false, false);
    });
    
    regenerateBtn.addEventListener('click', () => {
        currentPetalShape = getRandomPetalShape();
        randomizeColors();
        updateFlower(true, true);
    });
    
    changeShapeBtn.addEventListener('click', () => {
        currentPetalShape = getRandomPetalShape();
        updateFlower(false, false);
    });

    autoRotateCheckbox.addEventListener('change', (e) => {
        controls.autoRotate = e.target.checked;
    });
    
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
}

function reCenterCamera() {
    if (flowerGroup) {
        flowerGroup.position.set(0, 0, 0);
        flowerGroup.rotation.set(0, 0, 0);
    }

    camera.position.set(0, 3, 5);
    camera.lookAt(0, 1, 0);

    controls.reset();
    controls.target.set(0, 1, 0);
    controls.update();
}

function randomizeColors() {
    const petalColors = getRandomPetalColors();
    if (petalColors) {
        gradientColor1.value = petalColors.color1;
        gradientColor2.value = petalColors.color2;
    }
}

function updateFlower(regenerate = false, updateLeaves = false) {
    const params = {
        layer1Count: parseInt(layer1Count.value),
        layer2Count: parseInt(layer2Count.value),
        layer3Count: parseInt(layer3Count.value),
        stemLength: parseFloat(stemLength.value),
        stemBends: parseInt(stemBends.value),
        numLeaves: parseInt(numLeaves.value),
        gradientColor1: gradientColor1.value,
        gradientColor2: gradientColor2.value,
        updateLeaves: updateLeaves || regenerate
    };

    if (regenerate) {
        currentPetalShape = getRandomPetalShape();
    }

    if (!flowerGroup) {
        flowerGroup = new THREE.Group();
        flowerGroup.rotation.y = Math.PI;
        flowerGroup.position.y = -3;
        scene.add(flowerGroup);

        stemGroup = new THREE.Group();
        flowerGroup.add(stemGroup);

        const { stem, stemCurve } = createStem(params);
        stemGroup.add(stem);
        const leavesGroup = createLeaves(params, stemCurve);
        stemGroup.add(leavesGroup);

        const petalsGroup = createPetals(params);
        flowerGroup.add(petalsGroup);
    } else {
        if (regenerate) {
            const { stem, stemCurve } = createStem(params);
            const leavesGroup = createLeaves(params, stemCurve);
            const petalsGroup = createPetals(params);
            
            while (stemGroup.children.length > 0) {
                stemGroup.remove(stemGroup.children[0]);
            }
            
            stemGroup.add(stem);
            stemGroup.add(leavesGroup);

            flowerGroup.children.forEach(child => {
                if (child !== stemGroup) {
                    flowerGroup.remove(child);
                }
            });
            flowerGroup.add(petalsGroup);
        } else if (updateLeaves) {
            const { stem, stemCurve } = createStem(params);
            const leavesGroup = createLeaves(params, stemCurve);
            const petalsGroup = createPetals(params);
            
            while (stemGroup.children.length > 0) {
                stemGroup.remove(stemGroup.children[0]);
            }
            
            stemGroup.add(stem);
            stemGroup.add(leavesGroup);

            flowerGroup.children.forEach(child => {
                if (child !== stemGroup) {
                    flowerGroup.remove(child);
                }
            });
            flowerGroup.add(petalsGroup);
        } else {
            const petalsGroup = createPetals(params);
            
            flowerGroup.children.forEach(child => {
                if (child !== stemGroup) {
                    flowerGroup.remove(child);
                }
            });
            
            flowerGroup.add(petalsGroup);
        }
    }
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