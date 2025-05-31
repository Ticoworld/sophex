'use client';

import { motion } from 'framer-motion';
import XPBadge from '../ui/XPBadge'; // Assuming this path is correct
import { FaBolt, FaCrown, FaShieldAlt } from 'react-icons/fa';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei'; // Import useGLTF for GLB models
import { Group } from 'three';
import { useRef, Suspense } from 'react'; // Import Suspense for GLB loading

// Define the type for GLTF results, specifically for the scene object
type GLTFResult = {
  scene: Group;
};

// Updated NFTItems to point to specific GLB files
const NFTItems = [
  {
    id: 1,
    name: 'Sophex Explorer',
    utility: '+20% XP Boost',
    rarity: 'Common',
    icon: <FaShieldAlt className="text-orange-400" />,
    image: '/assets/NFT.glb', // Assuming this is your first GLB
  },
  {
    id: 2,
    name: 'Sophex Pioneer',
    utility: 'Early Quest Access',
    rarity: 'Rare',
    icon: <FaBolt className="text-orange-400" />,
    image: '/assets/nft1.glb', // Pointing to nft1.glb
  },
  {
    id: 3,
    name: 'Sophex Master',
    utility: '+50% XP Boost & Exclusive Quests',
    rarity: 'Legendary',
    icon: <FaCrown className="text-orange-400" />,
    image: '/assets/nft2.glb', // Pointing to nft2.glb
  },
];

// Component for 3D NFT preview using GLB
type NFTPreview3DProps = {
  src: string; // Path to the GLB file
  scale?: [number, number, number];
  rotationSpeed?: number;
};

function NFTPreview3D({
  src,
  scale = [1.8, 1.8, 1.8], // Increased default scale for card size
  rotationSpeed = 0.005,
}: NFTPreview3DProps) {
  // Load the GLB model using useGLTF
  const gltf = useGLTF(src) as unknown as GLTFResult;
  const groupRef = useRef<Group>(null);

  // Rotate the model on each frame
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += rotationSpeed; // Gentle rotation around Y-axis
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Render the loaded GLB scene */}
      <primitive object={gltf.scene} />
    </group>
  );
}

export default function NFTShowcase() {
  return (
    <section className="py-20 relative">
      {/* Decorative sphere */}
      <div className="absolute -top-40 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Utility-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">NFTs</span>
          </h2>
          <p className="text-xl text-neutral-300">
            More than just art - our NFTs unlock real advantages in the Sophex ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {NFTItems.map((nft, index) => (
            <motion.div
              key={nft.id}
              className="bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-2xl p-6 border border-neutral-700 overflow-hidden group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              {/* 3D Card Effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative">
                {/* 3D NFT Preview Canvas */}
                <div className="w-full h-64 mb-6 rounded-xl overflow-hidden group-hover:shadow-lg group-hover:shadow-orange-500/20 transition-all">
                  <Canvas camera={{ position: [0, 0, 3], fov: 60 }}> {/* Adjusted camera for smaller canvas */}
                    {/* Lighting for the individual NFT preview - Increased and added more */}
                    <ambientLight intensity={1.5} /> {/* Increased ambient light for overall brightness */}
                    <directionalLight position={[2, 2, 2]} intensity={2.0} /> {/* Main light, increased intensity */}
                    <directionalLight position={[-2, -2, -2]} intensity={1.0} /> {/* Fill light, increased intensity */}
                    <directionalLight position={[0, 3, -1]} intensity={0.8} color="#FFFFFF" /> {/* New light from top-back for more highlights */}


                    {/* Suspense for loading the GLB model */}
                    <Suspense fallback={null}>
                      <NFTPreview3D src={nft.image} /> {/* Use the new 3D preview component */}
                    </Suspense>

                    {/* OrbitControls for interaction within the card */}
                    <OrbitControls
                      enableZoom={false}
                      enablePan={false}
                      // Allow slight vertical rotation but prevent flipping
                      minPolarAngle={Math.PI / 2 - 0.3}
                      maxPolarAngle={Math.PI / 2 + 0.3}
                      autoRotate
                      autoRotateSpeed={0.5} // Slightly faster auto-rotation for cards
                    />
                  </Canvas>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{nft.name}</h3>
                  <XPBadge>{nft.rarity}</XPBadge>
                </div>

                <p className="text-orange-400 mb-4 flex items-center">
                  <FaBolt className="mr-2" /> {nft.utility}
                </p>

                <div className="flex justify-between items-center mt-6">
                  <span className="text-neutral-400">#{String(nft.id).padStart(3, '0')}</span>
                  <button className="bg-orange-500/10 text-orange-500 px-4 py-2 rounded-lg hover:bg-orange-500/20 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="max-w-2xl mx-auto mt-16 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-2xl p-8 border border-orange-500/20 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -z-10"></div>

          <h3 className="text-2xl font-bold mb-4 flex items-center text-orange-400">
            <FaBolt className="mr-2" /> NFT Benefits
          </h3>
          <ul className="space-y-3">
            {[
              'XP boosts for faster reward accumulation',
              'Early access to exclusive quests and campaigns',
              'Special privileges in community governance',
              'Increased conversion rates for fiat payouts',
            ].map((benefit, i) => (
              <li key={i} className="flex items-start text-neutral-300">
                <span className="text-orange-500 mr-2">•</span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

// Preload all GLB files used in NFTItems
useGLTF.preload('/assets/NFT.glb');
useGLTF.preload('/assets/nft1.glb');
useGLTF.preload('/assets/nft2.glb');
