'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Group } from 'three';
import { useRef, Suspense } from 'react';

interface GLTFResult {
  scene: Group;
}

interface NFTModelProps {
  src: string;
  scale?: [number, number, number];
  rotationSpeed?: number;
}

function NFTModel({
  src,
  scale = [2, 2, 2],
  rotationSpeed = 0.005,
}: NFTModelProps) {
  const groupRef = useRef<Group>(null);
  // Load the GLTF model; Suspense will handle the pending state
  const gltf = useGLTF(src) as GLTFResult;

  useFrame(() => {
    if (groupRef.current && gltf?.scene) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  // If the scene isn't ready, Suspense ensures that the fallback is rendered
  if (!gltf?.scene) return null;

  return (
    <group ref={groupRef} scale={scale}>
      <primitive object={gltf.scene} castShadow />
    </group>
  );
}

export default function RotatingNFT() {
  return (
    <div className="w-full h-80 sm:h-[400px] sm:w-[400px]">
      <Canvas shadows camera={{ position: [0, 1, 5], fov: 45 }} gl={{ alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight
          castShadow
          position={[4, 6, 6]}
          intensity={3.5}
          shadow-mapSize={[1024, 1024]}
        />
        <directionalLight position={[-5, 4, -4]} intensity={1.2} />
        <directionalLight position={[0, 2, -5]} intensity={0.5} color="#ADD8E6" />

        <Suspense
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="gray" />
            </mesh>
          }
        >
          <NFTModel src="/assets/nft3.glb" scale={[3.5, 3.5, 3.5]} />
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial transparent opacity={0.15} />
          </mesh>
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2 - 0.2}
          maxPolarAngle={Math.PI / 2 + 0.2}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/assets/nft3.glb');