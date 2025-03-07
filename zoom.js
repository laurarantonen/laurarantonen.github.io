export function enableScrollZoom(camera, minZoom = 0.5, maxZoom = 2) {
    let zoomLevel = camera.zoom; // Init zoom level

    // Scroll event listener for zooming
    function onScroll(event) {
        if (event.deltaY < 0) {
            zoomLevel += 0.05;  // Zoom in
        } else if (event.deltaY > 0) {
            zoomLevel -= 0.05;  // Zoom out
        }

        // Clamp
        zoomLevel = Math.max(minZoom, Math.min(maxZoom, zoomLevel));

        camera.zoom = zoomLevel;
        camera.updateProjectionMatrix();
    }
    
    window.addEventListener('wheel', onScroll);
    
    return () => {
        window.removeEventListener('wheel', onScroll);
    };
}
