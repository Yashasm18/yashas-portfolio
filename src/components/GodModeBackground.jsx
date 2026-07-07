import React, { useEffect, useRef } from "react";

const GodModeBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      if (!canvas.parentElement) return;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resize);
    
    // Also observe parent size changes
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }
    resize();

    // 3D Particles
    const numParticles = window.innerWidth > 768 ? 150 : 75;
    const particles = [];
    const focalLength = canvas.width;
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 3,
        y: (Math.random() - 0.5) * height * 3,
        z: Math.random() * width * 2,
        color: `hsl(${250 + Math.random() * 80}, 100%, 70%)` // Purple to Pink
      });
    }

    let time = 0;

    const draw = () => {
      // Clear with dark transparent trail for motion blur
      ctx.fillStyle = "rgba(3, 0, 10, 0.3)";
      ctx.fillRect(0, 0, width, height);
      
      time += 0.05;
      
      // Draw God Mode Core Aura
      const cx = width / 2;
      const cy = height / 2;
      const pulse = Math.sin(time) * 0.2 + 0.8;
      
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, height * 0.8 * pulse);
      gradient.addColorStop(0, "rgba(120, 40, 255, 0.2)");
      gradient.addColorStop(0.5, "rgba(40, 10, 150, 0.05)");
      gradient.addColorStop(1, "transparent");
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Base speed
      const speed = 2.5;

      // Project and draw particles
      const projected = [];

      particles.forEach((p) => {
        // Move towards camera
        p.z -= speed;
        
        // Add subtle rotation
        const angle = 0.002;
        const nx = p.x * Math.cos(angle) - p.y * Math.sin(angle);
        const ny = p.x * Math.sin(angle) + p.y * Math.cos(angle);
        p.x = nx;
        p.y = ny;

        // Reset if behind camera
        if (p.z <= 0) {
          p.x = (Math.random() - 0.5) * width * 3;
          p.y = (Math.random() - 0.5) * height * 3;
          p.z = width * 2;
        }

        // 3D Projection
        const scale = focalLength / p.z;
        const px = p.x * scale + cx;
        const py = p.y * scale + cy;
        
        projected.push({ px, py, scale, p });

        const size = Math.max(0.5, scale * 1.5);
        const opacity = Math.min(1, Math.max(0, 1 - (p.z / (width * 2))));

        // Draw particle
        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      });

      // Draw 3D connecting lines — batched into single path for performance
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(180, 100, 255, 0.3)";
      ctx.globalAlpha = 1;
      ctx.beginPath();
      const distThresholdSq = 300 * 300; // compare squared to avoid sqrt
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          
          const dx = p1.p.x - p2.p.x;
          const dy = p1.p.y - p2.p.y;
          const dz = p1.p.z - p2.p.z;
          const dist3dSq = dx * dx + dy * dy + dz * dz;

          if (dist3dSq < distThresholdSq) {
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
          }
        }
      }
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }} 
    />
  );
};

export default GodModeBackground;
