import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Sparkles, useGLTF, useAnimations, Scroll, useScroll, Image, Trail, Text } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import UI from './UI';
import { useStore } from '../store';

function Robot() {
  const group = useRef();
  const { scene, animations } = useGLTF('/Robot.glb');
  const { actions } = useAnimations(animations, group);
  const scroll = useScroll();

  useEffect(() => {
    if (actions) {
      const actionName = actions['Dance'] ? 'Dance' : (actions['Idle'] ? 'Idle' : Object.keys(actions)[0]);
      if (actionName && actions[actionName]) {
        actions[actionName].play();
      }
    }
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.metalness = 0.9;
        child.material.roughness = 0.1;
      }
    });
  }, [actions, scene]);

  useFrame((state) => {
    if (!group.current) return;
    const offset = scroll.offset;
    const targetPosX = offset < 0.25 ? -offset * 4 : (offset < 0.5 ? -1 + (offset - 0.25) * 4 : -5);
    const targetPosZ = offset < 0.5 ? offset * 3 : -8;
    
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetPosX, 0.05);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetPosZ, 0.05);
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 - 1.5;
    
    const mouseTargetX = (state.pointer.x * Math.PI) / 8;
    const mouseTargetY = (state.pointer.y * Math.PI) / 8;
    const scrollTargetRotY = offset * Math.PI;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseTargetX + scrollTargetRotY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouseTargetY, 0.05);
  });

  return (
    <group ref={group} position={[0, -1.5, 2]} scale={0.7} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

function ExploreButton() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const setDomainSelectorOpen = useStore((state) => state.setDomainSelectorOpen);
  const setDomainWorldPosition = useStore((state) => state.setDomainWorldPosition);
  const isOpen = useStore((state) => state.isDomainSelectorOpen);
  const scroll = useScroll();
  const groupRef = useRef();
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useFrame((state) => {
    if (!ref.current || !groupRef.current) return;
    
    // Scroll animation
    const offset = scroll.offset;
    const targetY = offset > 0.6 ? 0 : -15; // Move into view when scrolled down
    
    // Mouse follow rotation
    const targetRotationX = (state.pointer.y * Math.PI) / 6;
    const targetRotationY = (state.pointer.x * Math.PI) / 6;

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
    groupRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.005;
    
    // Apply mouse rotation to the group smoothly
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);

    // Auto-Dive Logic
    if (offset > 0.80 && !hasAutoOpened && !isOpen) {
       setHasAutoOpened(true);
       const worldPos = new THREE.Vector3();
       ref.current.getWorldPosition(worldPos);
       setDomainWorldPosition(worldPos);
       setDomainSelectorOpen(true);
    }
    
    // Reset trigger if scrolled back up
    if (offset < 0.6 && hasAutoOpened && !isOpen) {
       setHasAutoOpened(false);
    }

    // Hover animation
    ref.current.rotation.y += 0.005;
    ref.current.rotation.x += 0.005;
    const targetScale = hovered ? 1.2 : 1;
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handleClick = (e) => {
    e.stopPropagation();
    const worldPos = new THREE.Vector3();
    ref.current.getWorldPosition(worldPos);
    setDomainWorldPosition(worldPos);
    setDomainSelectorOpen(true);
  };

  return (
    <group ref={groupRef} position={[0, -15, 0]}>
      <mesh 
        ref={ref}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }} 
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'none'; }} 
        onClick={handleClick}
      >
        <octahedronGeometry args={[2, 0]} />
        <meshStandardMaterial color="#ffffff" wireframe={true} emissive="#ffffff" emissiveIntensity={hovered ? 2 : 0.5} />
      </mesh>
      <Text position={[0, -3.5, 0]} fontSize={0.6} color="white" letterSpacing={0.2} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff">
        EXPLORE MY PORTFOLIO
      </Text>
      <Text position={[0, -4.5, 0]} fontSize={0.2} color="gray" letterSpacing={0.1} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZJhjp-Ek-_EeA.woff">
        [ CLICK TO ENTER ]
      </Text>
    </group>
  );
}

function ElegantParticles({ themeColor }) {
  const scroll = useScroll();
  const group = useRef();
  const count = 200;
  const positions = useRef(Array.from({length: count}, () => [
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  ])).current;
  
  const dummy = useRef(new THREE.Object3D()).current;
  const prevOffset = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const offset = scroll.offset;
    const velocity = Math.abs(offset - prevOffset.current) / (delta || 0.016);
    prevOffset.current = offset;
    
    const targetStretch = Math.max(0.1, velocity * 5);
    const stretch = THREE.MathUtils.lerp(dummy.scale.z, targetStretch, 0.1);
    
    for (let i = 0; i < count; i++) {
      dummy.position.set(...positions[i]);
      positions[i][2] += delta * (0.5 + velocity * 20);
      if (positions[i][2] > 5) positions[i][2] = -15;
      
      dummy.scale.set(0.01, 0.01, stretch);
      dummy.updateMatrix();
      group.current.setMatrixAt(i, dummy.matrix);
    }
    group.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={group} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={themeColor} transparent opacity={0.3} />
    </instancedMesh>
  );
}

function MouseTrail({ themeColor }) {
  const mousePointer = useRef();
  useFrame((state) => {
    if (!mousePointer.current) return;
    const x = (state.pointer.x * state.viewport.width) / 2;
    const y = (state.pointer.y * state.viewport.height) / 2;
    mousePointer.current.position.lerp(new THREE.Vector3(x, y, 0), 0.2);
  });

  return (
    <Trail width={0.1} length={10} color={themeColor} attenuation={(t) => t * t}>
      <mesh ref={mousePointer}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0} />
      </mesh>
    </Trail>
  );
}

function CameraRig() {
  const isDomainSelectorOpen = useStore((state) => state.isDomainSelectorOpen);
  const activeDomain = useStore((state) => state.activeDomain);
  const domainWorldPosition = useStore((state) => state.domainWorldPosition);
  
  useFrame((state) => {
    if ((isDomainSelectorOpen || activeDomain) && domainWorldPosition) {
      const targetPos = new THREE.Vector3(
        domainWorldPosition.x,
        domainWorldPosition.y,
        domainWorldPosition.z + 4 // Zoom in but keep some distance
      );
      state.camera.position.lerp(targetPos, 0.05);
    } else {
      state.camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.05);
    }
  });
  return null;
}

export default function Scene({ theme, setTheme, isHacked }) {
  const themeColor = theme === 'cyan' ? '#00ffff' : (theme === 'crimson' ? '#ff003c' : '#ffffff');
  const altColor = theme === 'cyan' ? '#ff00ff' : (theme === 'crimson' ? '#ffaa00' : '#888888');
  const isMobile = window.innerWidth < 768;

  return (
    <>
      <fog attach="fog" args={['#020205', 5, 20]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color={themeColor} />
      <directionalLight position={[-5, -5, -5]} intensity={3} color={altColor} />
      
      <Environment preset="city" />

      <CameraRig />

      <Robot />
      <ExploreButton />
      <ElegantParticles themeColor={themeColor} />
      {!isMobile && <MouseTrail themeColor={themeColor} />}
      
      <Sparkles count={isMobile ? 40 : 100} scale={10} size={1} speed={0.1} opacity={0.5} color={themeColor} />
      
      <Scroll html style={{ width: '100vw' }}>
        <UI theme={theme} setTheme={setTheme} isHacked={isHacked} />
      </Scroll>

      <EffectComposer disableNormalPass multisampling={isMobile ? 0 : 4}>
        <Bloom luminanceThreshold={0.5} mipmapBlur={!isMobile} intensity={isHacked ? 3.0 : 0.8} />
        {isHacked && <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.01, 0.01]} />}
        {!isMobile && <Noise opacity={0.02} />}
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
