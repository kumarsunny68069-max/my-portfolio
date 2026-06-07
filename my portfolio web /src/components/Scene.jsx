import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Sparkles, useGLTF, useAnimations, Scroll, useScroll, Image, Text3D, Center, Text, Trail } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import UI from './UI';

function BackgroundText({ themeColor }) {
  const textRef = useRef();
  const scroll = useScroll();

  useFrame((state) => {
    if (!textRef.current) return;
    const offset = scroll.offset;
    textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, offset * 12, 0.05);
    textRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.002;
    textRef.current.rotation.y = (state.pointer.x * Math.PI) / 16;
    textRef.current.rotation.x = -(state.pointer.y * Math.PI) / 16;
  });

  return (
    <group ref={textRef} position={[0, 0, -4]}>
      <Center>
        <Text3D
          font="/font.json"
          size={1.2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          CREATIVE
          <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} roughness={0.2} metalness={0.8} />
        </Text3D>
      </Center>
      <Center position={[0, -1.5, 0]}>
        <Text3D
          font="/font.json"
          size={1.2}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.02}
          bevelOffset={0}
          bevelSegments={5}
        >
          DEVELOPER
          <meshStandardMaterial color={themeColor} emissive={themeColor} emissiveIntensity={0.8} roughness={0.2} metalness={0.8} />
        </Text3D>
      </Center>
    </group>
  );
}

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
        child.material.metalness = 0.8;
        child.material.roughness = 0.2;
      }
    });
  }, [actions, scene]);

  useFrame((state) => {
    if (!group.current) return;
    const offset = scroll.offset;
    const targetPosX = offset < 0.25 ? -offset * 8 : (offset < 0.5 ? -2 + (offset - 0.25) * 8 : -10);
    const targetPosZ = offset < 0.5 ? offset * 5 : -10;
    
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetPosX, 0.05);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, targetPosZ, 0.05);
    group.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 - 1.5;
    
    const mouseTargetX = (state.pointer.x * Math.PI) / 4;
    const mouseTargetY = (state.pointer.y * Math.PI) / 4;
    const scrollTargetRotY = offset * Math.PI * 2;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseTargetX + scrollTargetRotY, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouseTargetY, 0.05);
  });

  return (
    <group ref={group} position={[0, -1.5, 2]} scale={0.6} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

function InteractiveImage({ url, position, scale, title, themeColor }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const textRef = useRef();

  useFrame((state) => {
    if (!ref.current) return;
    const targetScale = hovered ? scale[0] * 1.1 : scale[0];
    const targetZ = hovered ? position[2] + 0.5 : position[2];
    
    ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale * 0.66, 1), 0.1);
    ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, targetZ, 0.1);
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2 + position[0]) * (hovered ? 0.05 : 0.1);

    if (textRef.current) {
      textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, hovered ? position[1] - (scale[1]/2) - 0.5 : position[1] - (scale[1]/2), 0.1);
      textRef.current.material.opacity = THREE.MathUtils.lerp(textRef.current.material.opacity, hovered ? 1 : 0, 0.1);
    }
  });

  return (
    <group>
      <Image 
        ref={ref} 
        url={url} 
        position={position}
        scale={scale}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'none'; }} 
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'none'; }} 
      />
      <Text
        ref={textRef}
        position={[position[0], position[1] - 1.5, position[2]]}
        fontSize={0.4}
        color={themeColor}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
        anchorX="center"
        anchorY="middle"
        material-transparent={true}
        material-opacity={0}
      >
        {title}
      </Text>
    </group>
  );
}

function ProjectsGallery({ themeColor }) {
  const scroll = useScroll();
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;
    const offset = scroll.offset;
    const targetY = offset > 0.6 && offset < 0.9 ? 0 : -15;
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, targetY, 0.05);
    group.current.position.y += Math.sin(state.clock.elapsedTime * 0.5) * 0.005;

    const mouseTargetX = (state.pointer.x * Math.PI) / 8;
    const mouseTargetY = (state.pointer.y * Math.PI) / 8;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, mouseTargetX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -mouseTargetY, 0.05);
  });

  return (
    <group ref={group} position={[0, -15, 0]}>
      <InteractiveImage url="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" position={[-3.5, 1, -2]} scale={[3, 2]} title="NEURAL NET" themeColor={themeColor} />
      <InteractiveImage url="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop" position={[3.5, 0, -3]} scale={[3, 2]} title="CYBER PUNK" themeColor={themeColor} />
      <InteractiveImage url="https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=800&auto=format&fit=crop" position={[0, -2, -1]} scale={[4, 2.5]} title="E-COMMERCE" themeColor={themeColor} />
    </group>
  );
}

function WarpParticles({ themeColor }) {
  const scroll = useScroll();
  const group = useRef();
  const count = 300;
  const positions = useRef(Array.from({length: count}, () => [
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30,
    (Math.random() - 0.5) * 30
  ])).current;
  
  const dummy = useRef(new THREE.Object3D()).current;
  const prevOffset = useRef(0);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    const offset = scroll.offset;
    const velocity = Math.abs(offset - prevOffset.current) / (delta || 0.016);
    prevOffset.current = offset;
    
    // Smooth the velocity so lines don't snap
    const targetStretch = Math.max(0.1, velocity * 15);
    const stretch = THREE.MathUtils.lerp(dummy.scale.z, targetStretch, 0.1);
    
    for (let i = 0; i < count; i++) {
      dummy.position.set(...positions[i]);
      positions[i][2] += delta * (1 + velocity * 50);
      if (positions[i][2] > 10) positions[i][2] = -20;
      
      dummy.scale.set(0.02, 0.02, stretch);
      dummy.updateMatrix();
      group.current.setMatrixAt(i, dummy.matrix);
    }
    group.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={group} args={[null, null, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={themeColor} transparent opacity={0.6} />
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
    <Trail
      width={0.2}
      length={8}
      color={themeColor}
      attenuation={(t) => t * t}
    >
      <mesh ref={mousePointer}>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshBasicMaterial color={themeColor} transparent opacity={0} />
      </mesh>
    </Trail>
  );
}

export default function Scene({ theme, setTheme, isHacked }) {
  const themeColor = theme === 'cyan' ? '#00ffff' : (theme === 'crimson' ? '#ff003c' : '#00ff00');
  const altColor = theme === 'cyan' ? '#ff00ff' : (theme === 'crimson' ? '#ffaa00' : '#005500');

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={3} color={themeColor} />
      <directionalLight position={[-5, -5, -5]} intensity={3} color={altColor} />
      
      <Environment preset="city" />

      <BackgroundText themeColor={themeColor} />
      <Robot />
      <ProjectsGallery themeColor={themeColor} />
      
      <WarpParticles themeColor={themeColor} />
      <MouseTrail themeColor={themeColor} />
      
      <Sparkles count={200} scale={12} size={2} speed={0.2} opacity={0.8} color={themeColor} />
      
      <Scroll html style={{ width: '100vw' }}>
        <UI theme={theme} setTheme={setTheme} isHacked={isHacked} />
      </Scroll>

      <EffectComposer disableNormalPass>
        <Bloom luminanceThreshold={0.3} mipmapBlur intensity={isHacked ? 3.0 : 1.5} />
        {isHacked && <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.01, 0.01]} />}
        {!isHacked && <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.002, 0.002]} />}
        <Noise opacity={0.03} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
}
