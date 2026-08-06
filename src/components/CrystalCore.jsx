import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

const ACCENT = "#c2a4ff";
const ACCENT_DIM = "#6f5ba8";

function Shard({ radius, speed, scale, offset }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    ref.current.position.set(
      Math.cos(t) * radius,
      Math.sin(t * 0.6) * radius * 0.4,
      Math.sin(t) * radius
    );
    ref.current.rotation.x = t;
    ref.current.rotation.y = t * 0.7;
  });
  return (
    <mesh ref={ref} scale={scale}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={ACCENT}
        emissive={ACCENT}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
}

function Core({ mouse }) {
  const group = useRef();
  const wireframe = useRef();

  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.15;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      mouse.current.y * 0.3,
      0.05
    );
    group.current.rotation.z = THREE.MathUtils.lerp(
      group.current.rotation.z,
      -mouse.current.x * 0.2,
      0.05
    );
    wireframe.current.rotation.y -= delta * 0.08;
  });

  const shards = useMemo(
    () => [
      { radius: 2.6, speed: 0.35, scale: 0.22, offset: 0 },
      { radius: 3.1, speed: -0.25, scale: 0.16, offset: 2 },
      { radius: 2.2, speed: 0.5, scale: 0.12, offset: 4 },
      { radius: 3.4, speed: -0.3, scale: 0.18, offset: 1 },
    ],
    []
  );

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshPhysicalMaterial
            color={ACCENT_DIM}
            emissive={ACCENT}
            emissiveIntensity={0.35}
            roughness={0.15}
            metalness={0.8}
            clearcoat={1}
            transmission={0.15}
          />
        </mesh>
        <mesh ref={wireframe} scale={1.55}>
          <icosahedronGeometry args={[1.4, 1]} />
          <meshBasicMaterial color={ACCENT} wireframe transparent opacity={0.35} />
        </mesh>
      </Float>
      {shards.map((s, i) => (
        <Shard key={i} {...s} />
      ))}
    </group>
  );
}

const CrystalCore = () => {
  const mouse = useRef({ x: 0, y: 0 });

  const handlePointerMove = (e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
  };

  return (
    <div
      className="crystal-core-canvas"
      onPointerMove={handlePointerMove}
      style={{ width: "100%", height: "100%" }}
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 8], fov: 35 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color={ACCENT} />
        <pointLight position={[-5, -3, -5]} intensity={0.6} color="#5271ff" />
        <Sparkles count={40} scale={6} size={2} speed={0.3} color={ACCENT} />
        <Core mouse={mouse} />
        <Environment preset="city" environmentIntensity={0.3} />
      </Canvas>
    </div>
  );
};

export default CrystalCore;
