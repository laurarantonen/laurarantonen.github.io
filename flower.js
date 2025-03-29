import * as THREE from 'three';
import { createGradientTexture } from './scene.js';
import { petalModels, getLeafModel } from './meshLoader.js';

function getPointOnCurve(curve, t) {
    const point = curve.getPoint(t);
    const tangent = curve.getTangent(t);
    const normal = new THREE.Vector3(-tangent.y, tangent.x, 0).normalize();
    return { point, tangent, normal };
}

export function getRandomPetalColors() {
    const colors = [
        { color1: '#FF69B4', color2: '#FF1493' },
        { color1: '#FFF7CC', color2: '#FF69B4' },
        { color1: '#9370DB', color2: '#4B0082' },
        { color1: '#DDA0DD', color2: '#800080' },
        { color1: '#87CEEB', color2: '#000080' },
        { color1: '#709BFF', color2: '#00008B' },
        { color1: '#98FB98', color2: '#006400' },
        { color1: '#90EE90', color2: '#228B22' },
        { color1: '#FFD700', color2: '#FFA500' },
        { color1: '#FFA07A', color2: '#FF4500' },
        { color1: '#FFDAB9', color2: '#FFA07A' },
        { color1: '#FFFFFF', color2: '#DEB887' },
        { color1: '#00CED1', color2: '#008B8B' },
        { color1: '#E0FFFF', color2: '#20B2AA' },
        { color1: '#E6E6FA', color2: '#9370DB' },
        { color1: '#B0E0E6', color2: '#4169E1' }
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

export function getRandomPetalShape() {
    if (!petalModels.model1 || !petalModels.model2 || !petalModels.model3) {
        petalModels.currentModel = petalModels.model1;
        return petalModels.currentModel;
    }

    if (!petalModels.currentModel) {
        petalModels.currentModel = petalModels.model1;
    } else if (petalModels.currentModel === petalModels.model1) {
        petalModels.currentModel = petalModels.model2;
    } else if (petalModels.currentModel === petalModels.model2) {
        petalModels.currentModel = petalModels.model3;
    } else {
        petalModels.currentModel = petalModels.model1;
    }
    return petalModels.currentModel;
}

export function createPetals(params) {
    const petalsGroup = new THREE.Group();
    const gradientTexture = createGradientTexture(params.gradientColor1, params.gradientColor2);
    const petalMaterial = new THREE.MeshStandardMaterial({ 
        map: gradientTexture,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.0
    });

    const layers = [
        { count: params.layer1Count, scale: 0.3, height: 0.8, rotation: 0, yOffset: 0.15 },
        { count: params.layer2Count, scale: 0.4, height: 1.0, rotation: 45, yOffset: 0.0 },
        { count: params.layer3Count, scale: 0.5, height: 1.2, rotation: 0, yOffset: -0.15 }
    ];

    const modelToUse = petalModels.currentModel;
    
    layers.forEach(layer => {
        if (layer.count > 0) {
            for (let i = 0; i < layer.count; i++) {
                const petalMesh = modelToUse.clone();
                petalMesh.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        child.material = petalMaterial;
                    }
                });
                
                petalMesh.position.set(0, params.stemLength + layer.yOffset, 0);
                petalMesh.rotation.y = (i / layer.count) * Math.PI * 2 + layer.rotation;
                petalMesh.scale.set(layer.scale, layer.scale, layer.scale);
                petalsGroup.add(petalMesh);
            }
        }
    });

    return petalsGroup;
}

export function createStem(params) {
    const stemLength = params.stemLength || 4;
    const numBends = params.stemBends !== undefined ? params.stemBends : 2;
    const controlPoints = [new THREE.Vector3(0, 0, 0)];

    if (numBends === 0) {
        controlPoints.push(new THREE.Vector3(0, stemLength, 0));
    } else {
        for (let i = 1; i <= numBends; i++) {
            const height = (stemLength * i) / (numBends + 1);
            const bendAmount = 0.2 * Math.sin(i * Math.PI / 2);
            controlPoints.push(new THREE.Vector3(bendAmount, height, 0));
        }
        controlPoints.push(new THREE.Vector3(0, stemLength, 0));
    }
    
    const stemCurve = new THREE.CatmullRomCurve3(controlPoints);
    const stemGeometry = new THREE.TubeGeometry(stemCurve, 20, 0.06, 8, false);
    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.8,
        metalness: 0.1
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    return { stem, stemCurve };
}

export function createLeaves(params, stemCurve) {
    const leavesGroup = new THREE.Group();
    const numLeaves = params.numLeaves || 0;
    
    if (!stemCurve || numLeaves === 0) return leavesGroup;

    const leafGradientTexture = createGradientTexture('#228B22', '#002400');
    const leafModel = getLeafModel();
    if (!leafModel) return leavesGroup;

    const leafMaterial = new THREE.MeshStandardMaterial({
        map: leafGradientTexture,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.0
    });

    for (let i = 0; i < numLeaves; i++) {
        const leafMesh = leafModel.clone();
        leafMesh.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material = leafMaterial;
            }
        });

        const t = (i + 0.5) / (numLeaves + 1);
        const { point } = getPointOnCurve(stemCurve, t);

        const leafGroup = new THREE.Group();
        leafGroup.position.copy(point);

        const rotationAngle = i * (Math.PI / 4);
        leafMesh.position.set(0, 0, 0);
        leafMesh.rotation.set(-Math.PI / 6, rotationAngle, 0);

        const baseScale = 0.3;
        const variation = 0.15;
        const randomScale = baseScale + (Math.random() * 2 - 1) * variation;
        leafMesh.scale.set(randomScale, randomScale, randomScale);

        leafGroup.add(leafMesh);
        leavesGroup.add(leafGroup);
    }

    return leavesGroup;
}

export function createFlower(params = {}) {
    const flowerGroup = new THREE.Group();
    flowerGroup.rotation.y = Math.PI;
    flowerGroup.position.y = -3;

    const { stem, stemCurve } = createStem(params);
    flowerGroup.add(stem);

    const petalsGroup = createPetals(params);
    flowerGroup.add(petalsGroup);

    if (params.updateLeaves) {
        const leavesGroup = createLeaves(params, stemCurve);
        flowerGroup.add(leavesGroup);
    }

    return flowerGroup;
} 