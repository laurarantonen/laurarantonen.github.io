import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

// Petal models
export let petalModels = {
    model1: null,
    model2: null,
    model3: null,
    currentModel: null
};

// Leaf models
export let leafModels = {
    model1: null,
    currentModel: null
};

// Create a promise for model loading
export const modelLoaded = new Promise((resolve, reject) => {
    let loadedCount = 0;
    const totalModels = 4;

    const onLoad = () => {
        loadedCount++;
        console.log(`Loaded model ${loadedCount} of ${totalModels}`);
        if (loadedCount === totalModels) {
            console.log('All models loaded successfully');
            resolve({ petalModels, leafModels });
        }
    };

    loader.load(
        'meshes/petal_001.glb',
        (gltf) => {
            petalModels.model1 = gltf.scene;
            onLoad();
        },
        undefined,
        (error) => {
            console.error('Error loading petal model 1:', error);
            reject(error);
        }
    );

    loader.load(
        'meshes/petal_002.glb',
        (gltf) => {
            petalModels.model2 = gltf.scene;
            onLoad();
        },
        undefined,
        (error) => {
            console.error('Error loading petal model 2:', error);
            reject(error);
        }
    );

    loader.load(
        'meshes/petal_003.glb',
        (gltf) => {
            petalModels.model3 = gltf.scene;
            onLoad();
        },
        undefined,
        (error) => {
            console.error('Error loading petal model 3:', error);
            reject(error);
        }
    );

    loader.load(
        'meshes/leaf_001.glb',
        (gltf) => {
            leafModels.model1 = gltf.scene;
            onLoad();
        },
        undefined,
        (error) => {
            console.error('Error loading leaf model 1:', error);
            reject(error);
        }
    );
});

export function getLeafModel() {
    return leafModels.model1;
} 