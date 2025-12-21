import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Float, Sphere, Text, Sparkles, Billboard, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { corleoneFamily } from '../utils/familyTreeLogic';

// --- 1. PROCEDURAL WIREFRAME TERRAIN ---
const WireframeTerrain = () => {
  // Generate the geometry once
  const geometry = useMemo(() => {
    // 150x150 size, 64x64 segments creates the "grid" density
    const geo = new THREE.PlaneGeometry(150, 150, 64, 64);
    const pos = geo.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // This maps to Z in world space before rotation

      // Calculate distance from center (0,0)
      const dist = Math.sqrt(x * x + y * y);

      let height = 0;

      // Leave a flat clearing in the center (radius 15) for the tree
      if (dist > 15) {
        // Create rolling hills using Sine/Cosine waves
        // The further out, the higher the mountains (dist * 0.15)
        const wave1 = Math.sin(x * 0.1) * Math.cos(y * 0.1);
        const wave2 = Math.sin(x * 0.3 + y * 0.5) * 0.5;

        // Smooth transition from flat to hilly
        const blend = Math.min(1, (dist - 15) / 20);

        height = (wave1 + wave2) * 4 * blend;

        // Make mountains rise up, not down
        height = Math.abs(height);
      }

      // Set the Z height (which becomes Y up after rotation)
      pos.setZ(i, height);
    }

    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      {/* The Wireframe Mesh */}
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <meshBasicMaterial
          color="#0ea5e9" // Sky Blue / Cyan
          wireframe={true}
          transparent={true}
          opacity={0.3}
        />
      </mesh>

      {/* A second mesh slightly offset to create a "glow" or "floor" effect underneath */}
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

// --- 2. TEXTURE GENERATOR (Existing) ---
const useFruitTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 512, 512);

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

// --- 3. HOLOGRAM TREE MODEL (Existing) ---
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

// --- 4. FAMILY NODE (Existing) ---
const FamilyNode = ({ node, onClick, onHover, fruitTexture }) => {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.2}>
      <group position={node.position}>
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

        <Sphere
          args={[node.size || 0.25, 64, 64]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(node, e);
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
            emissiveIntensity={4}
            bumpMap={fruitTexture}
            bumpScale={0.1}
          />
        </Sphere>
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

// --- 5. LAYOUT LOGIC (Existing) ---
const calculateLayout = (root, depth = 0, angleRange = { start: 0, end: Math.PI * 2 }, parentPos = { x: 0, y: 0, z: 0 }, branchColor = null) => {
  let nodes = [];
  const colors = ["#00ffff", "#ff00ff", "#39ff14", "#ffff00", "#ff3131", "#1f51ff"];

  const config = [
    { y: -1.2, radius: 0, size: 0.12 },    // Gen 1
    { y: 0.5, radius: 1.5, size: 0.10 },   // Gen 2
    { y: 2.2, radius: 2.6, size: 0.08 },   // Gen 3
    { y: 3.5, radius: 3.5, size: 0.06 },   // Gen 4
    { y: 4.5, radius: 4.2, size: 0.04 }    // Gen 5
  ];

  const currentConfig = config[Math.min(depth, config.length - 1)];

  let myColor = branchColor;
  if (depth === 0) {
    myColor = "#ffd700";
  } else if (depth === 1 && !myColor) {
    // Assign branch color
  }

  let x = 0, z = 0;
  if (depth === 0) {
    x = 0; z = 0.6;
  } else {
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

  if (root.children && root.children.length > 0) {
    const children = root.children;
    const count = children.length;
    const totalAngle = angleRange.end - angleRange.start;
    const step = totalAngle / count;

    children.forEach((child, i) => {
      let childStart = angleRange.start + (i * step);
      let childEnd = childStart + step;
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

// --- 6. MAIN COMPONENT ---
const ThreeDFamilyTree = ({ familyData = corleoneFamily, onNodeClick, onNodeHover }) => {
  const layoutNodes = useMemo(() => calculateLayout(familyData), [familyData]);
  const fruitTexture = useFruitTexture();

  return (
    <div style={{ width: '100%', height: '100%', background: '#02040a' }}>
      <Canvas
        camera={{ position: [0, 2, 12], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
        onPointerDown={(e) => {
          if (e.target.parentElement?.tagName === 'CANVAS' || e.intersections.length === 0) {
            onNodeClick(null);
          }
        }}
      >
        <color attach="background" args={["#02040a"]} />

        {/* FOG: Blends the wireframe mountains into the dark background distance */}
        <fog attach="fog" args={['#02040a', 15, 70]} />

        {/* Cinematic Lighting */}
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
        <spotLight position={[-10, 5, -5]} angle={0.5} penumbra={1} intensity={2} color="#00ffff" />
        <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffd700" />

        {/* --- NEW ENVIRONMENT --- */}
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

        {/* The Wireframe Landscape */}
        <WireframeTerrain />

        {/* TREE MODEL */}
        <HologramTree position={[0, -2, 0]} scale={[1.2, 1.2, 1.2]} />

        {/* SPARKLES */}
        <Sparkles count={40} scale={[8, 8, 8]} size={3} speed={0.2} color="#00ffff" opacity={0.5} />

        {/* NODES */}
        {layoutNodes.map((node) => (
          <FamilyNode
            key={node.id}
            node={node}
            fruitTexture={fruitTexture}
            onClick={onNodeClick}
            onHover={onNodeHover}
          />
        ))}

        {/* CONTROLS */}
        <OrbitControls
          minDistance={5}
          maxDistance={30}
          enablePan={false}
          // LOCK CAMERA: Prevents going below the horizon (Math.PI / 2 is 90 degrees)
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDFamilyTree;