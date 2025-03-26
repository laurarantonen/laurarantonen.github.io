import * as THREE from 'three';

function createGradientTexture(color1, color2) {
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

// Petal shape generation functions
function getRoundPetalShape() {
    const shape = new THREE.Shape();
    const width = Math.random() * 0.4 + 0.3;
    const height = Math.random() * 0.5 + 1.0;
    
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(width, height * 0.3, width, height * 0.5);
    shape.quadraticCurveTo(width, height * 0.7, 0, height);
    shape.quadraticCurveTo(-width, height * 0.7, -width, height * 0.5);
    shape.quadraticCurveTo(-width, height * 0.3, 0, 0);
    
    return shape;
}

function getDiamondPetalShape() {
    const shape = new THREE.Shape();
    const width = Math.random() * 0.4 + 0.3;
    const height = Math.random() * 0.5 + 1.0;
    
    shape.moveTo(0, 0);
    shape.lineTo(width, height * 0.5);
    shape.lineTo(0, height);
    shape.lineTo(-width, height * 0.5);
    shape.lineTo(0, 0);
    
    return shape;
}

function getHeartPetalShape() {
    const shape = new THREE.Shape();
    const width = Math.random() * 0.4 + 0.3;
    const height = Math.random() * 0.5 + 1.0;
    
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(width * 0.5, height * 0.3, width, height * 0.5);
    shape.quadraticCurveTo(width * 0.5, height * 0.7, 0, height);
    shape.quadraticCurveTo(-width * 0.5, height * 0.7, -width, height * 0.5);
    shape.quadraticCurveTo(-width * 0.5, height * 0.3, 0, 0);
    
    return shape;
}

function getNaturalPetalShape() {
    const shape = new THREE.Shape();
    const width = Math.random() * 0.4 + 0.3;
    const height = Math.random() * 0.5 + 1.0;
    
    const curves = Array(4).fill().map(() => Math.random() * 0.2 + 0.7);
    const heightVars = Array(4).fill().map(() => Math.random() * 0.2 - 0.1);
    
    shape.moveTo(0, 0);
    shape.quadraticCurveTo(
        width * curves[0], 
        height * 0.3 + heightVars[0],
        width, 
        height * 0.5 + 0.3
    );
    shape.quadraticCurveTo(
        width * curves[1], 
        height * 0.7 + heightVars[1],
        0, 
        height + 0.5
    );
    shape.quadraticCurveTo(
        -width * curves[2], 
        height * 0.7 + heightVars[2],
        -width, 
        height * 0.5 + 0.3
    );
    shape.quadraticCurveTo(
        -width * curves[3], 
        height * 0.3 + heightVars[3],
        0, 
        0
    );
    
    return shape;
}

function getRandomPetalShape() {
    const shapeTypes = [
        getRoundPetalShape,
        getDiamondPetalShape,
        getHeartPetalShape,
        getNaturalPetalShape
    ];
    
    return shapeTypes[Math.floor(Math.random() * shapeTypes.length)]();
}

function getRandomPetalColors() {
    const colors = [
        // Pink variations
        { color1: '#FF69B4', color2: '#FF1493' },
        { color1: '#FFF7CC', color2: '#FF69B4' },
        
        // Purple variations
        { color1: '#9370DB', color2: '#4B0082' },
        { color1: '#DDA0DD', color2: '#800080' },
        
        // Blue variations
        { color1: '#87CEEB', color2: '#000080' },
        { color1: '#709BFF', color2: '#00008B' },
        
        // Green variations
        { color1: '#98FB98', color2: '#006400' },
        { color1: '#90EE90', color2: '#228B22' },
        
        // Yellow/Orange variations
        { color1: '#FFD700', color2: '#FFA500' },
        { color1: '#FFA07A', color2: '#FF4500' },
        
        // Peach variations
        { color1: '#FFDAB9', color2: '#FFA07A' },
        { color1: '#FFFFFF', color2: '#DEB887' },
        
        // Cyan variations
        { color1: '#00CED1', color2: '#008B8B' },
        { color1: '#E0FFFF', color2: '#20B2AA' },
        
        // Lavender variations
        { color1: '#E6E6FA', color2: '#9370DB' },
        { color1: '#B0E0E6', color2: '#4169E1' }
    ];

    return colors[Math.floor(Math.random() * colors.length)];
}

// Scene creation
export function createScene() {
    const scene = new THREE.Scene();
    
    // Add lights to scene
    const { ambientLight, mainLight, fillLight, backLight } = createLights();
    scene.add(ambientLight);
    scene.add(mainLight);
    scene.add(fillLight);
    scene.add(backLight);
    
    return scene;
}

// Flower creation
export function createFlower(params = {}) {
    const flowerGroup = new THREE.Group();
    flowerGroup.rotation.y = Math.PI;
    flowerGroup.position.y = -3;
    
    const gradientTexture = createGradientTexture(params.gradientColor1, params.gradientColor2);
    const petalMaterial = new THREE.MeshStandardMaterial({ 
        map: gradientTexture,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.0
    });

    const stemLength = params.stemLength || 4;
    const numBends = params.stemBends !== undefined ? params.stemBends : 2;

    const layers = [
        { count: params.layer1Count, scale: 0.6, height: 0.8, rotation: 0, yOffset: 0.075 },
        { count: params.layer2Count, scale: 0.8, height: 1.0, rotation: 45, yOffset: 0.0 },
        { count: params.layer3Count, scale: 1.0, height: 1.2, rotation: 0, yOffset: -0.075 }
    ];

    const petalShape = params.petalShape || getRandomPetalShape();
    const petalGeometry = new THREE.ExtrudeGeometry(petalShape, { 
        depth: Math.random() * 0.01,
        bevelEnabled: false 
    });

    layers.forEach(layer => {
        if (layer.count > 0) {
            for (let i = 0; i < layer.count; i++) {
                const petalMesh = new THREE.Mesh(petalGeometry, petalMaterial);
                petalMesh.position.set(0, stemLength + layer.yOffset, 0);
                petalMesh.rotation.z = (i / layer.count) * Math.PI * 2 + layer.rotation;
                petalMesh.rotation.x = Math.PI / 2;
                petalMesh.scale.set(layer.scale, layer.scale, layer.scale);
                flowerGroup.add(petalMesh);
            }
        }
    });

    // Create the stem
    let stemGeometry;
    if (numBends === 0) {
        // Straight cylinder for 0 bends
        stemGeometry = new THREE.CylinderGeometry(0.075, 0.075, stemLength, 8);
    } else {
        const controlPoints = [new THREE.Vector3(0, 0, 0)];
        
        for (let i = 1; i <= numBends; i++) {
            const height = (stemLength * i) / (numBends + 1);
            const bendAmount = 0.2 * Math.sin(i * Math.PI / 2); // Alternating bends
            controlPoints.push(new THREE.Vector3(bendAmount, height, 0));
        }
        
        controlPoints.push(new THREE.Vector3(0, stemLength, 0));
        
        const stemCurve = new THREE.CatmullRomCurve3(controlPoints);
        stemGeometry = new THREE.TubeGeometry(
            stemCurve,
            20, // segments
            0.075, // radius
            8, // radius segments
            false // closed
        );
    }

    const stemMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x228B22,
        roughness: 0.8,
        metalness: 0.1
    });
    
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);

    if (numBends === 0) {
        stem.position.y = stemLength / 2; // Center the straight cylinder
    }
    flowerGroup.add(stem);

    return flowerGroup;
}

export function createLights() {
    // Ambient light for overall scene illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    
    // Main directional light (sun-like)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(5, 5, 5);
    
    // Secondary directional light for fill
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-5, 3, -5);
    
    // Back light for rim lighting
    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(0, 5, -5);
    
    return { ambientLight, mainLight, fillLight, backLight };
}

export { getRandomPetalShape };
export { getRandomPetalColors };