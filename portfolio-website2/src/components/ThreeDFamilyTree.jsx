/* eslint-disable react/no-unknown-property */
import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Sphere, Text, Sparkles, Ring } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { corleoneFamily } from '../utils/familyTreeLogic';

// 1. Load the Model & Apply Matrix Look
const HologramTree = (props) => {
  const { scene } = useGLTF('/tree.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: "cyan",
          emissive: "cyan",
          emissiveIntensity: 2,
          wireframe: true,
          transparent: true,
          opacity: 0.8
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
};

// 2. Family Node Logic
const FamilyNode = ({ node, onClick, onHover, index, totalInGen }) => {
  // Calculate Position based on Generation
  const position = useMemo(() => {
    let y = 0;
    let radius = 2;

    // Gen 1 (Roots)
    if (node.generation === 1) {
      y = -1.5;
      radius = 1.5;
    }
    // Gen 2 (Trunk)
    else if (node.generation === 2) {
      y = 0.5;
      radius = 2.5;
    }
    // Gen 3 (Branches)
    else {
      y = 3;
      radius = 3.5;
    }

    // Distribute in a circle
    const angle = (index / totalInGen) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    return [x, y, z];
  }, [node.generation, index, totalInGen]);

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group position={position}>
        {/* Text Label */}
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="black"
        >
          {node.name.split(' ')[0]}
        </Text>

        {/* Glowing Sphere */}
        <Sphere
          args={[0.3, 32, 32]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(node);
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(node);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            onHover(null);
            document.body.style.cursor = 'auto';
          }}
        >
          <meshStandardMaterial
            color={node.generation === 1 ? "#ffd700" : node.generation === 2 ? "#ff00ff" : "#00ffff"}
            emissive={node.generation === 1 ? "#ffd700" : node.generation === 2 ? "#ff00ff" : "#00ffff"}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </Sphere>
      </group>
    </Float>
  );
};

// Flatten tree for easier rendering loop
const flattenTree = (person, list = []) => {
  list.push(person);
  if (person.children) {
    person.children.forEach(child => flattenTree(child, list));
  }
  return list;
};

const ThreeDFamilyTree = ({ onNodeClick, onNodeHover }) => {
  const flatList = useMemo(() => flattenTree(corleoneFamily), []);

  // Group by generation for spacing logic
  const genCounts = {};
  flatList.forEach(p => {
    genCounts[p.generation] = (genCounts[p.generation] || 0) + 1;
  });
  const genIndices = {}; // To track index within generation

  return (
    <div style={{ width: '100%', height: '100%', background: '#050505' }}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 1.5]} // Cap pixel ratio for performance
        gl={{ powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
      >
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* The Matrix Tree */}
        <HologramTree position={[0, -2, 0]} scale={[1, 1, 1]} />
        {/* Note: Scale might need adjustment depending on the GLB. Assuming standard size or large. */}
        {/* If tree is huge, scale down. If small, scale up. 0.01 is common for massive exports. */}
        {/* I'll use scale=1 initially, user said "Center at [0, -2, 0]". I'll guess scale. */}

        {/* 🌟 EFFECT: Floating Particles (Like the reference image dust) */}
        <Sparkles
          count={200}
          scale={[10, 10, 10]}
          size={4}
          speed={0.4}
          opacity={0.6}
          color="#00ffff"
        />

        {/* 🌟 EFFECT: Glowing Ground Ring */}
        <group position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <Ring args={[3, 3.2, 64]}>
            <meshBasicMaterial color="#00ffff" transparent opacity={0.5} side={THREE.DoubleSide} />
          </Ring>
          <Ring args={[0, 3, 64]}>
            <meshBasicMaterial color="#000000" transparent opacity={0.8} />
          </Ring>
        </group>

        {/* Family Nodes */}
        {flatList.map((node) => {
          const idx = genIndices[node.generation] || 0;
          genIndices[node.generation] = idx + 1;
          const total = genCounts[node.generation];

          return (
            <FamilyNode
              key={node.id}
              node={node}
              index={idx}
              totalInGen={total}
              onClick={onNodeClick}
              onHover={onNodeHover}
            />
          );
        })}

        {/* Controls & Shine */}
        <OrbitControls minDistance={4} maxDistance={20} enablePan={false} maxPolarAngle={Math.PI / 1.8} />
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default ThreeDFamilyTree;