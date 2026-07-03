import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Capsule, Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Global mouse tracker for the background canvas (doesn't block HTML clicks)
export const globalMouse = { x: 0, y: 0 };

export default function Avatar(props) {
  const groupRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const lowerBodyRef = useRef();
  const deskRef = useRef();

  useEffect(() => {
    const onMouseMove = (e) => {
      globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({ color: '#f5f5f5', roughness: 0.3, metalness: 0.2 }),
      hair: new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.4, metalness: 0.1 }),
      shirt: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0.1 }),
      pants: new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.9 }),
      eyeWhite: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.2 }),
      pupil: new THREE.MeshStandardMaterial({ color: '#050505', roughness: 0.1 }),
      eyelid: new THREE.MeshStandardMaterial({ color: '#1a0525', roughness: 0.5 }), // Dark purple eyelids
      noseGlow: new THREE.MeshStandardMaterial({ color: '#a970ff', emissive: '#8a40ff', emissiveIntensity: 0.8 }), // Purple nose
      deskWhite: new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1, metalness: 0.1 }),
      deskMetal: new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.5, metalness: 0.8 }),
      screen: new THREE.MeshStandardMaterial({ color: '#ffb3ff', emissive: '#ff66ff', emissiveIntensity: 0.5 })
    };
  }, []);

  useFrame((state, delta) => {
    // 1. Calculate Scroll Section
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const scrollProgress = scrollY / vh;

    // Default target states
    let targetPos = new THREE.Vector3(0, -1.5, 0);
    let targetRot = new THREE.Vector3(0, 0, 0);
    let targetLeftArm = new THREE.Vector3(0, 0, 0.2); // Relaxed
    let targetRightArm = new THREE.Vector3(0, 0, -0.2); // Relaxed
    let targetLowerBody = new THREE.Vector3(0, 0, 0); // Standing
    let deskScale = 0;
    let headLookOffset = 0; // Extra rotation for head

    if (scrollProgress < 0.5) {
      // SECTION 1: HERO
      targetPos.set(0, -1.5, 0);
      targetRot.set(0, -0.2, 0); // Looking slightly right
      deskScale = 0;
    } else if (scrollProgress >= 0.5 && scrollProgress < 1.5) {
      // SECTION 2: ABOUT ME
      targetPos.set(-2, -1.5, 0); // Move left
      targetRot.set(0, 0.3, 0); // Looking slightly right towards text
      deskScale = 0;
    } else if (scrollProgress >= 1.5 && scrollProgress < 2.5) {
      // SECTION 3: SKILLS (Sitting at desk)
      targetPos.set(0, -2, 0); // Center, lower to sit
      targetRot.set(0, Math.PI / 4, 0); // Turned to face desk
      
      // Arms up to type
      targetLeftArm.set(-1.2, 0, 0.5); 
      targetRightArm.set(-1.2, 0, -0.5);
      
      // Legs bent to sit
      targetLowerBody.set(-Math.PI / 2, 0, 0);
      
      deskScale = 1;
      headLookOffset = -Math.PI / 4; // Look back at camera
    } else {
      // SECTION 4: EXPERIENCE / PROJECTS (Hide avatar or move far away)
      targetPos.set(0, -10, 0); // Move offscreen down
      deskScale = 0;
    }

    // 2. Lerp to Targets
    if (groupRef.current) {
      groupRef.current.position.lerp(targetPos, 0.05);
      
      // We use quaternion slerp for smooth multi-axis rotation
      const targetQuat = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRot.x, targetRot.y, targetRot.z));
      groupRef.current.quaternion.slerp(targetQuat, 0.05);
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.x += (targetLeftArm.x - leftArmRef.current.rotation.x) * 0.1;
      leftArmRef.current.rotation.y += (targetLeftArm.y - leftArmRef.current.rotation.y) * 0.1;
      leftArmRef.current.rotation.z += (targetLeftArm.z - leftArmRef.current.rotation.z) * 0.1;
    }

    if (rightArmRef.current) {
      rightArmRef.current.rotation.x += (targetRightArm.x - rightArmRef.current.rotation.x) * 0.1;
      rightArmRef.current.rotation.y += (targetRightArm.y - rightArmRef.current.rotation.y) * 0.1;
      rightArmRef.current.rotation.z += (targetRightArm.z - rightArmRef.current.rotation.z) * 0.1;
    }

    if (lowerBodyRef.current) {
      lowerBodyRef.current.rotation.x += (targetLowerBody.x - lowerBodyRef.current.rotation.x) * 0.1;
    }

    if (deskRef.current) {
      const currentScale = deskRef.current.scale.x;
      const newScale = currentScale + (deskScale - currentScale) * 0.1;
      deskRef.current.scale.set(newScale, newScale, newScale);
    }

    // 3. Mouse Tracking (Head & Eyes)
    // Only track if not hidden
    if (scrollProgress < 2.5) {
      const mouseX = (globalMouse.x * Math.PI) / 4;
      const mouseY = (globalMouse.y * Math.PI) / 6;

      if (headRef.current) {
        const targetHeadY = mouseX + headLookOffset;
        const targetHeadX = -mouseY;
        
        headRef.current.rotation.y += (targetHeadY - headRef.current.rotation.y) * 0.1;
        headRef.current.rotation.x += (targetHeadX - headRef.current.rotation.x) * 0.1;
        headRef.current.rotation.z = -headRef.current.rotation.y * 0.1;
      }
    }

    // 4. Breathing/Typing animation
    if (scrollProgress >= 1.5 && scrollProgress < 2.5) {
      // Typing bounce
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = targetLeftArm.x + Math.sin(state.clock.elapsedTime * 15) * 0.05;
        rightArmRef.current.rotation.x = targetRightArm.x + Math.cos(state.clock.elapsedTime * 15) * 0.05;
      }
    } else {
      // Normal breathing
      if (groupRef.current && scrollProgress < 1.5) {
        groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 1.5) * 0.001; // very subtle
      }
    }
  });

  return (
    <group ref={groupRef} {...props} dispose={null}>
      
      {/* DESK SETUP (Appears during Skills section) */}
      <group ref={deskRef} position={[0, 0.5, 1.5]} scale={0}>
        {/* Table Top */}
        <RoundedBox args={[4, 0.1, 2]} radius={0.05} position={[0, 0, 0]} material={materials.deskWhite} />
        {/* Table Legs */}
        <Cylinder args={[0.05, 0.05, 2.5]} position={[-1.8, -1.25, -0.8]} material={materials.deskWhite} />
        <Cylinder args={[0.05, 0.05, 2.5]} position={[1.8, -1.25, -0.8]} material={materials.deskWhite} />
        <Cylinder args={[0.05, 0.05, 2.5]} position={[-1.8, -1.25, 0.8]} material={materials.deskWhite} />
        <Cylinder args={[0.05, 0.05, 2.5]} position={[1.8, -1.25, 0.8]} material={materials.deskWhite} />
        
        {/* Monitor */}
        <Box args={[0.5, 0.1, 0.4]} position={[0, 0.05, -0.5]} material={materials.deskMetal} /> {/* Stand base */}
        <Box args={[0.1, 0.6, 0.1]} position={[0, 0.35, -0.6]} material={materials.deskMetal} /> {/* Stand arm */}
        <Box args={[2.2, 1.4, 0.1]} position={[0, 0.8, -0.5]} material={materials.deskMetal} /> {/* Screen back */}
        <Box args={[2.1, 1.3, 0.02]} position={[0, 0.8, -0.44]} material={materials.screen} /> {/* Glowing Screen */}
        
        {/* Keyboard */}
        <Box args={[1.2, 0.05, 0.4]} position={[0, 0.08, 0.4]} material={materials.deskMetal} />

        {/* Chair */}
        <Cylinder args={[0.6, 0.6, 0.1]} position={[0, -1, 1.5]} material={materials.deskWhite} /> {/* Seat */}
        <Cylinder args={[0.1, 0.1, 1]} position={[0, -1.5, 1.5]} material={materials.deskMetal} /> {/* Post */}
      </group>

      {/* AVATAR BODY */}
      <group position={[0, 1.2, 0]}>
        {/* Upper Torso */}
        <Capsule args={[0.8, 1.2, 4, 16]} position={[0, -0.2, 0]} material={materials.shirt} />
        
        {/* Neck */}
        <Cylinder args={[0.3, 0.35, 0.5]} position={[0, 0.8, 0]} material={materials.skin} />
        
        {/* Left Arm (Pivot at shoulder) */}
        <group position={[-0.9, 0.2, 0]} ref={leftArmRef}>
          <Capsule args={[0.25, 1, 4, 16]} position={[0, -0.6, 0]} material={materials.shirt} />
          {/* Hand */}
          <Sphere args={[0.22, 16, 16]} position={[0, -1.3, 0]} material={materials.skin} />
        </group>

        {/* Right Arm (Pivot at shoulder) */}
        <group position={[0.9, 0.2, 0]} ref={rightArmRef}>
          <Capsule args={[0.25, 1, 4, 16]} position={[0, -0.6, 0]} material={materials.shirt} />
          {/* Hand */}
          <Sphere args={[0.22, 16, 16]} position={[0, -1.3, 0]} material={materials.skin} />
        </group>

        {/* Lower Body (Pivot at waist for sitting) */}
        <group position={[0, -1, 0]} ref={lowerBodyRef}>
          <Capsule args={[0.75, 0.8, 4, 16]} position={[0, -0.4, 0]} material={materials.pants} />
          {/* Legs */}
          <Capsule args={[0.3, 1.2, 4, 16]} position={[-0.35, -1.2, 0]} material={materials.pants} />
          <Capsule args={[0.3, 1.2, 4, 16]} position={[0.35, -1.2, 0]} material={materials.pants} />
        </group>

        {/* HEAD */}
        <group ref={headRef} position={[0, 1.2, 0]}>
          <Sphere args={[0.7, 32, 32]} scale={[1.15, 1.05, 1.05]} position={[0, 0, 0]} material={materials.skin} />

          {/* Hair */}
          <Sphere args={[0.72, 32, 32]} scale={[1.1, 0.95, 1.05]} position={[0, 0.15, -0.05]} material={materials.hair} />
          <Capsule args={[0.2, 1.3, 4, 16]} position={[0, 0.6, 0.48]} rotation={[0, 0, Math.PI / 2]} material={materials.hair} />
          {/* Sideburns */}
          <Capsule args={[0.1, 0.4, 4, 8]} position={[-0.75, 0.1, 0]} material={materials.hair} />
          <Capsule args={[0.1, 0.4, 4, 8]} position={[0.75, 0.1, 0]} material={materials.hair} />

          {/* Ears */}
          <Sphere args={[0.18, 16, 16]} scale={[0.5, 1, 1]} position={[-0.8, 0, -0.1]} rotation={[0, 0, -0.2]} material={materials.skin} />
          {/* Inner ear details */}
          <Sphere args={[0.08, 16, 16]} position={[-0.85, 0, -0.05]} material={materials.skin} />

          <Sphere args={[0.18, 16, 16]} scale={[0.5, 1, 1]} position={[0.8, 0, -0.1]} rotation={[0, 0, 0.2]} material={materials.skin} />
          <Sphere args={[0.08, 16, 16]} position={[0.85, 0, -0.05]} material={materials.skin} />

          {/* Purple Nose */}
          <Sphere args={[0.12, 32, 32]} position={[0, -0.1, 0.72]} material={materials.noseGlow} />

          {/* Mouth */}
          <Capsule args={[0.015, 0.25, 4, 8]} position={[0, -0.35, 0.68]} rotation={[0, 0, Math.PI / 2]} material={materials.hair} />

          {/* Eyes */}
          <group position={[0, 0.15, 0.65]}>
            <group position={[-0.22, 0, 0]}>
              <Sphere args={[0.14, 16, 16]} scale={[1.2, 0.8, 0.5]} material={materials.eyeWhite} />
              <Sphere args={[0.06, 16, 16]} position={[0, 0, 0.07]} material={materials.pupil} />
              <Sphere args={[0.15, 16, 16]} scale={[1.2, 0.5, 0.6]} position={[0, 0.05, 0.04]} rotation={[0.2, 0, 0]} material={materials.eyelid} />
            </group>

            <group position={[0.22, 0, 0]}>
              <Sphere args={[0.14, 16, 16]} scale={[1.2, 0.8, 0.5]} material={materials.eyeWhite} />
              <Sphere args={[0.06, 16, 16]} position={[0, 0, 0.07]} material={materials.pupil} />
              <Sphere args={[0.15, 16, 16]} scale={[1.2, 0.5, 0.6]} position={[0, 0.05, 0.04]} rotation={[0.2, 0, 0]} material={materials.eyelid} />
            </group>
            
            {/* Thicker eyebrows */}
            <Capsule args={[0.04, 0.3, 4, 8]} position={[-0.25, 0.2, 0.05]} rotation={[0, 0, Math.PI / 2 - 0.1]} material={materials.hair} />
            <Capsule args={[0.04, 0.3, 4, 8]} position={[0.25, 0.2, 0.05]} rotation={[0, 0, Math.PI / 2 + 0.1]} material={materials.hair} />
          </group>
        </group>
      </group>
    </group>
  );
}
