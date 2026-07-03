import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function Robot(props) {
  const groupRef = useRef();
  const headRef = useRef();
  const leftEyeRef = useRef();
  const rightEyeRef = useRef();
  const bodyRef = useRef();

  // Smooth mouse tracking
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  // Materials
  const materials = useMemo(() => {
    return {
      whiteGloss: new THREE.MeshPhysicalMaterial({
        color: '#ffffff',
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.5,
        metalness: 0.8,
      }),
      eyeGlow: new THREE.MeshStandardMaterial({
        color: '#b05cff',
        emissive: '#b05cff',
        emissiveIntensity: 2,
        toneMapped: false,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: '#00e5ff',
        emissive: '#00e5ff',
        emissiveIntensity: 0.5,
      })
    };
  }, []);

  useFrame((state) => {
    // 1. Calculate target rotation based on mouse
    // pointer is normalized between -1 and 1
    const x = (state.pointer.x * Math.PI) / 4; // Look left/right
    const y = (state.pointer.y * Math.PI) / 6; // Look up/down

    targetRotation.current.x = x;
    targetRotation.current.y = y;

    // 2. Smoothly rotate the head
    if (headRef.current) {
      headRef.current.rotation.y += (targetRotation.current.x - headRef.current.rotation.y) * 0.1;
      headRef.current.rotation.x += (-targetRotation.current.y - headRef.current.rotation.x) * 0.1;
      
      // Add a slight tilt to the head based on x movement for cuteness/realism
      headRef.current.rotation.z = -headRef.current.rotation.y * 0.2;
    }

    // 3. Very subtle body rotation
    if (bodyRef.current) {
      bodyRef.current.rotation.y += (targetRotation.current.x * 0.3 - bodyRef.current.rotation.y) * 0.05;
    }

    // 4. Subtle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      
      {/* --- BODY --- */}
      <group ref={bodyRef} position={[0, -1.5, 0]}>
        {/* Torso */}
        <RoundedBox args={[2.2, 3, 1.5]} radius={0.4} smoothness={4} material={materials.whiteGloss} />
        
        {/* Chest Plate / Screen */}
        <Box args={[1.6, 1.2, 0.1]} position={[0, 0.5, 0.76]} material={materials.darkMetal} />
        <Box args={[1.4, 0.2, 0.1]} position={[0, -0.4, 0.76]} material={materials.accent} />

        {/* Shoulders */}
        <Sphere args={[0.6, 32, 32]} position={[-1.3, 1, 0]} material={materials.darkMetal} />
        <Sphere args={[0.6, 32, 32]} position={[1.3, 1, 0]} material={materials.darkMetal} />
        
        {/* Arms (Upper) */}
        <Cylinder args={[0.3, 0.3, 1.5]} position={[-1.6, 0, 0]} rotation={[0, 0, 0.2]} material={materials.whiteGloss} />
        <Cylinder args={[0.3, 0.3, 1.5]} position={[1.6, 0, 0]} rotation={[0, 0, -0.2]} material={materials.whiteGloss} />

        {/* Neck connector */}
        <Cylinder args={[0.3, 0.4, 0.5]} position={[0, 1.6, 0]} material={materials.darkMetal} />
      </group>

      {/* --- HEAD --- */}
      <group ref={headRef} position={[0, 0.5, 0]}>
        {/* Main Head Shape (Rounded Box) */}
        <RoundedBox args={[2.4, 2, 2.2]} radius={0.5} smoothness={4} material={materials.whiteGloss} />
        
        {/* Face Screen / Visor */}
        <RoundedBox args={[2.1, 1.2, 0.2]} radius={0.2} smoothness={4} position={[0, 0.1, 1.05]} material={materials.darkMetal} />

        {/* Eyes (Glowing Spheres inside the visor) */}
        <group position={[0, 0.1, 1.15]}>
          {/* Left Eye */}
          <Sphere ref={leftEyeRef} args={[0.2, 32, 32]} position={[-0.5, 0, 0]} material={materials.eyeGlow} />
          {/* Right Eye */}
          <Sphere ref={rightEyeRef} args={[0.2, 32, 32]} position={[0.5, 0, 0]} material={materials.eyeGlow} />
        </group>

        {/* Ears / Antennas */}
        <Cylinder args={[0.2, 0.2, 0.4]} position={[-1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.accent} />
        <Cylinder args={[0.2, 0.2, 0.4]} position={[1.25, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={materials.accent} />
      </group>

    </group>
  );
}
