import React, { useMemo, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Sphere, Text, Sparkles, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { corleoneFamily } from '../utils/familyTreeLogic';

// Generate a procedural texture for the fruit look
const useFruitTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    // Background
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 512, 512);

    // Noise / Speckles
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const opacity = Math.random() * 0.2;
      const size = Math.random() * 2 + 1;
      context.fillStyle = `rgba(0,0,0,${opacity})`;
      context.beginPath();
      context.arc(x, y, size, 0, Math.PI * 2);
      context.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, []);
};

// 1. Load the Model & Apply Matrix Look
const HologramTree = (props) => {
  const { scene } = useGLTF('/tree.glb');

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        const isFoliage = name.includes('leaf') || name.includes('foliage') || name.includes('leaves');

        const color = isFoliage ? "#00ffff" : "#1e40af";
        const emissive = isFoliage ? "#00ffff" : "#1e3a8a";

        child.material = new THREE.MeshStandardMaterial({
          color: color,
          emissive: emissive,
          emissiveIntensity: isFoliage ? 0.1 : 0.8,
          wireframe: true,
          transparent: true,
          opacity: isFoliage ? 0.15 : 0.6
        });
      }
    });
  }, [scene]);

  return <primitive object={scene} {...props} />;
};

// 2. Family Node Logic
const FamilyNode = ({ node, onClick, onHover, fruitTexture }) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={node.position}>
        {/* Text Label - Always faces camera */}
        <Billboard
          follow={true}
          lockX={false}
          lockY={false}
          lockZ={false}
          position={[0, node.size + 0.2, 0]}
        >
          <Text
            fontSize={0.2}
            color="white"
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="black"
          >
            {node.name.split(' ')[0]}
          </Text>
        </Billboard>

        {/* Fruit Dot (3D Sphere) */}
        <Sphere
          args={[node.size || 0.25, 64, 64]}
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
          <meshPhysicalMaterial
            map={fruitTexture}
            color={node.color}
            roughness={0}
            metalness={0}
            emissive={node.color}
            emissiveIntensity={4} // Very bright neon center
            bumpMap={fruitTexture}
            bumpScale={0.1}
          />
        </Sphere>
        {/* Radiating Halo Effect */}
        <Sphere args={[node.size * 2.2, 16, 16]}>
          <meshBasicMaterial
            color={node.color}
            transparent={true}
            opacity={0.25}
            depthWrite={false}
          />
        </Sphere>
      </group>
    </Float>
  );
};

// Recursive Layout Logic
const calculateLayout = (root, depth = 0, angleRange = { start: 0, end: Math.PI * 2 }, parentPos = { x: 0, y: 0, z: 0 }, branchColor = null) => {
  let nodes = [];
  // Vibrant Neon Palette
  const colors = ["#00ffff", "#ff00ff", "#39ff14", "#ffff00", "#ff3131", "#1f51ff"];

  // Settings per generation (Reduced sizes for technical network look)
  const config = [
    { y: -1.2, radius: 0, size: 0.12 },    // Gen 1
    { y: 0.5, radius: 1.8, size: 0.10 },   // Gen 2
    { y: 2.2, radius: 3.2, size: 0.08 },   // Gen 3
    { y: 3.5, radius: 4.5, size: 0.06 },   // Gen 4
    { y: 4.5, radius: 5.5, size: 0.04 }    // Gen 5
  ];

  const currentConfig = config[Math.min(depth, config.length - 1)];

  // Determine Color: Gen 1 Gold, Gen 2+ Branch Color
  let myColor = branchColor;
  if (depth === 0) {
    myColor = "#ffd700"; // Gold for Gen 1
  } else if (depth === 1 && !myColor) {
    // Assign branch color if not yet assigned (Gen 2)
    // We need index to pick color, handled in loop below
  }

  // Calculate my position
  let x = 0, z = 0;
  if (depth === 0) {
    x = 0; z = 0.6; // Slight offset z to pop out of trunk
  } else {
    // Center of my angle range
    const myAngle = (angleRange.start + angleRange.end) / 2;
    x = Math.cos(myAngle) * currentConfig.radius;
    z = Math.sin(myAngle) * currentConfig.radius;
  }

  nodes.push({
    ...root,
    position: [x, currentConfig.y, z],
    color: myColor || "#ffffff",
    size: currentConfig.size,
    depth
  });

  // Process Children
  if (root.children && root.children.length > 0) {
    const children = root.children;
    const count = children.length;

    // Divide my angle range among children
    const totalAngle = angleRange.end - angleRange.start;
    const step = totalAngle / count;

    children.forEach((child, i) => {
      let childStart = angleRange.start + (i * step);
      let childEnd = childStart + step;

      // For Gen 1 -> Gen 2, we distribute around full 360 (already passed in as init)
      // For Gen 2+, we constrain to parent's sector so branches don't overlap too much

      // Determine color for child
      let cColor = myColor;
      if (depth === 0) {
        cColor = colors[i % colors.length];
      }

      const childNodes = calculateLayout(
        child,
        depth + 1,
        { start: childStart, end: childEnd },
        { x, y: currentConfig.y, z },
        cColor
      );
      nodes = nodes.concat(childNodes);
    });
  }

  return nodes;
};

const ThreeDFamilyTree = ({ familyData = corleoneFamily, onNodeClick, onNodeHover }) => {
  const layoutNodes = useMemo(() => calculateLayout(familyData), [familyData]);
  const fruitTexture = useFruitTexture();

  return (
    <div style={{ width: '100%', height: '100%', background: '#050505' }}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
      >
        <color attach="background" args={["#02040a"]} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        {/* Main Key Light */}
        <pointLight position={[5, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
        {/* Rim Light (Cool) */}
        <spotLight position={[-10, 5, -5]} angle={0.5} penumbra={1} intensity={2} color="#00ffff" />
        {/* Fill Light (Warm) */}
        <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffd700" />

        <HologramTree position={[0, -2, 0]} scale={[1.2, 1.2, 1.2]} />

        <gridHelper args={[20, 20, "#112233", "#050911"]} position={[0, -2, 0]} />
        <Sparkles count={40} scale={[8, 8, 8]} size={3} speed={0.2} color="#00ffff" opacity={0.5} />

        {layoutNodes.map((node) => (
          <FamilyNode
            key={node.id}
            node={node}
            fruitTexture={fruitTexture}
            onClick={onNodeClick}
            onHover={onNodeHover}
          />
        ))}

        <OrbitControls
          minDistance={5}
          maxDistance={25}
          enablePan={false}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDFamilyTree;