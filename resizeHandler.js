export function setupResizeHandler(camera, frustumSize, renderer){
    window.addEventListener('resize', (event) => onResize(camera, frustumSize, renderer));
}


// Window resize handling
function onResize(camera, frustumSize, renderer) {
    window.addEventListener('resize', () => {
        const aspect = window.innerWidth / window.innerHeight;
        camera.left = -frustumSize * aspect;
        camera.right = frustumSize * aspect;
        camera.top = frustumSize;
        camera.bottom = -frustumSize;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}