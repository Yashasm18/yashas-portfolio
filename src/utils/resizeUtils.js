const handleResize = (
  renderer,
  camera,
  canvasDiv,
  character
) => {
  if (canvasDiv.current) {
    const rect = canvasDiv.current.getBoundingClientRect();
    const container = { width: rect.width, height: rect.height };
    const aspect = container.width / container.height;
    
    // Update camera
    camera.aspect = aspect;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Update character position if needed on resize
    if (character) {
      if (window.innerWidth <= 1024) {
        // Reset specific rotations/positions for mobile view
        character.rotation.x = 0;
        character.rotation.y = 0;
      }
    }
  }
};

export default handleResize;
