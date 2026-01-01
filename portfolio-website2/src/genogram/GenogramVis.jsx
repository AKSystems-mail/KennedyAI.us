import React, { useMemo, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, useGLTF, Float, Sphere, Box, Octahedron, Text, Sparkles, Billboard, Stars, QuadraticBezierLine, Line } from '@react-three/drei';
import * as THREE from 'three';
import { corleoneFamily, familyRelationships } from '../utils/genogramLogic';

// --- 1. PROCEDURAL WIREFRAME TERRAIN (Unchanged) ---
const WireframeTerrain = () => {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(150, 150, 64, 64);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const dist = Math.sqrt(x * x + y * y);
      let height = 0;
      if (dist > 15) {
        const wave1 = Math.sin(x * 0.1) * Math.cos(y * 0.1);
        const wave2 = Math.sin(x * 0.3 + y * 0.5) * 0.5;
        const blend = Math.min(1, (dist - 15) / 20);
        height = (wave1 + wave2) * 4 * blend;
        height = Math.abs(height);
      }
      pos.setZ(i, height);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <meshBasicMaterial color="#0ea5e9" wireframe={true} transparent={true} opacity={0.3} />
      </mesh>
      <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.05, 0]}>
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};

// --- 2. TEXTURE GENERATOR (Unchanged) ---
const useFruitTexture = () => {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff'; context.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 10000; i++) {
      const x = Math.random() * 512; const y = Math.random() * 512;
      const opacity = Math.random() * 0.2; const size = Math.random() * 2 + 1;
      context.fillStyle = `rgba(0,0,0,${opacity})`; context.beginPath(); context.arc(x, y, size, 0, Math.PI * 2); context.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
};

// --- 3. HOLOGRAM TREE MODEL (Organic Theme) ---
const HologramTree = (props) => {
  const { scene } = useGLTF('/tree.glb');
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();
        const isFoliage = name.includes('leaf') || name.includes('foliage') || name.includes('leaves') || name.includes('canopy');
        const color = isFoliage ? "#90ee90" : "#a67c52"; // Light Green vs Light Brown
        const emissive = isFoliage ? "#32cd32" : "#5c4033"; // Lime Green vs Deep Brown

        child.material = new THREE.MeshStandardMaterial({
          color: color,
          emissive: emissive,
          emissiveIntensity: isFoliage ? 0.2 : 0.8,
          wireframe: true,
          transparent: true,
          opacity: isFoliage ? 0.2 : 0.6
        });
      }
    });
  }, [scene]);
  return <primitive object={scene} {...props} />;
};

// --- 4. GENOGRAM NODE (Resized Shapes & Status-based colors) ---
const FamilyNode = ({ node, onClick, onHover }) => {
  const meshRef = useRef();
  const satelliteRefs = useRef({
    substanceAbuse: null,
    mentalHealth: null,
    physicalIllness: null
  });

  const ShapeComponent = useMemo(() => {
    switch (node.gender) {
      case 'male': return Box;
      case 'female': return Sphere;
      default: return Octahedron;
    }
  }, [node.gender]);

  const isDeceased = node.status === 'deceased';
  const isIndex = node.isIndex === true;

  const baseColor = isDeceased ? "#d1d5db" : (node.color || "#22d3ee");
  const emissiveColor = isDeceased ? "#9ca3af" : baseColor;
  const emissiveInt = isIndex ? 3 : (isDeceased ? 0.1 : 1);

  const baseSize = node.size || 0.25;
  const renderSize = baseSize * 1.5;

  const geometryArgs = useMemo(() => {
    switch (node.gender) {
      case 'male': return [renderSize, renderSize, renderSize];
      case 'female': return [renderSize * 0.6, 16, 16];
      default: return [renderSize * 0.6, 0];
    }
  }, [node.gender, renderSize]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    if (!isDeceased) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.z += 0.005;
    }
    if (isIndex) {
      const scale = 1 + Math.sin(t * 3) * 0.1;
      meshRef.current.scale.setScalar(scale);
    }

    // Animate satellites
    const orbitRadius = renderSize * 1.8;
    const orbitSpeed = 0.8; // Reduced from 1.5 for slower, more elegant motion

    if (satelliteRefs.current.substanceAbuse) {
      const angle = t * orbitSpeed;
      satelliteRefs.current.substanceAbuse.position.x = Math.cos(angle) * orbitRadius;
      satelliteRefs.current.substanceAbuse.position.y = Math.sin(angle) * orbitRadius;
    }

    if (satelliteRefs.current.mentalHealth) {
      const angle = t * orbitSpeed + 2.094; // 120 degrees offset
      satelliteRefs.current.mentalHealth.position.x = Math.cos(angle) * orbitRadius;
      satelliteRefs.current.mentalHealth.position.y = Math.sin(angle) * orbitRadius;
    }

    if (satelliteRefs.current.physicalIllness) {
      const angle = t * orbitSpeed + 4.189; // 240 degrees offset
      satelliteRefs.current.physicalIllness.position.x = Math.cos(angle) * orbitRadius;
      satelliteRefs.current.physicalIllness.position.y = Math.sin(angle) * orbitRadius;
    }
  });

  return (
    <Float
      speed={isDeceased ? 0 : 2}
      rotationIntensity={isDeceased ? 0 : 0.2}
      floatIntensity={isDeceased ? 0 : 0.5}
    >
      <group position={node.position}>
        <Billboard position={[0, renderSize + 0.25, 0]}>
          <Text
            fontSize={0.15}
            color={isDeceased ? "#e5e7eb" : "white"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="black"
          >
            {node.name.split(' ')[0]}
          </Text>
        </Billboard>

        <ShapeComponent
          ref={meshRef}
          args={geometryArgs}
          onClick={(e) => { e.stopPropagation(); onClick(node, e); }}
          onPointerOver={(e) => { e.stopPropagation(); onHover(node); document.body.style.cursor = 'pointer'; }}
          onPointerOut={() => { onHover(null); document.body.style.cursor = 'auto'; }}
        >
          <meshStandardMaterial
            color={baseColor}
            emissive={emissiveColor}
            emissiveIntensity={emissiveInt}
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
            transparent={true}
            opacity={isDeceased ? 0.5 : 0.8}
          />
        </ShapeComponent>

        {!isDeceased && (
          <ShapeComponent args={geometryArgs.map(v => typeof v === 'number' ? v * 0.5 : v)}>
            <meshBasicMaterial color={baseColor} />
          </ShapeComponent>
        )}

        {isDeceased && (
          <ShapeComponent args={geometryArgs.map(v => typeof v === 'number' ? v * 0.4 : v)}>
            <meshBasicMaterial color="#9ca3af" wireframe={true} />
          </ShapeComponent>
        )}

        {/* Attribute Orbital Satellites - Smaller and slower */}
        {node.substanceAbuse && (
          <mesh ref={(el) => (satelliteRefs.current.substanceAbuse = el)}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#ff0000"
              emissive="#ff0000"
              emissiveIntensity={3}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        )}
        {node.mentalHealth && (
          <mesh ref={(el) => (satelliteRefs.current.mentalHealth = el)}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#3b82f6"
              emissive="#3b82f6"
              emissiveIntensity={3}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        )}
        {node.physicalIllness && (
          <mesh ref={(el) => (satelliteRefs.current.physicalIllness = el)}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#f97316"
              emissive="#f97316"
              emissiveIntensity={3}
              transparent={true}
              opacity={0.9}
            />
          </mesh>
        )}
      </group>
    </Float>
  );
};

// --- 5. LAYOUT LOGIC (High Contrast Palette) ---
const calculateLayout = (root, depth = 0, angleRange = { start: 0, end: Math.PI * 2 }, parentPos = { x: 0, y: 0, z: 0 }, branchColor = null) => {
  let nodes = [];
  const colors = ["#ff00ff", "#1f51ff", "#ff4d4d", "#ffffff", "#ffd700"]; // Magenta, Electric Blue, Coral Red, White, Gold

  const config = [
    { y: -1.2, radius: 0, size: 0.18 },     // Gen 1 (Root)
    { y: 0.5, radius: 2.2, size: 0.15 },    // Gen 2 (Children) - Increased radius per user request (< Gen 3)
    { y: 2.2, radius: 2.6, size: 0.12 },    // Gen 3 (Grandchildren)
    { y: 3.5, radius: 3.5, size: 0.09 },    // Gen 4 (Great-Grandchildren)
    { y: 4.5, radius: 4.2, size: 0.06 }     // Gen 5
  ];

  const currentConfig = config[Math.min(depth, config.length - 1)];

  let myColor = branchColor;
  if (depth === 0) { myColor = "#d1d5db"; } // Gray for deceased root ancestor
  else if (depth === 1 && !myColor) { }

  let x = 0, z = 0;
  if (depth === 0) {
    x = 0; z = 0.6;
  } else {
    const myAngle = (angleRange.start + angleRange.end) / 2;
    x = Math.cos(myAngle) * currentConfig.radius;
    z = Math.sin(myAngle) * currentConfig.radius;
  }

  // Push the main node
  nodes.push({
    ...root,
    position: [x, currentConfig.y, z],
    color: myColor || "#ffffff",
    size: currentConfig.size,
    depth
  });

  // Handle Partners (from new partners array)
  if (root.partners && root.partners.length > 0) {
    root.partners.forEach((partner, index) => {
      // Place partner next to the node.
      // Spacing: 0.35 units to the right (x-axis) per partner.
      // "Almost touching"
      const spacing = 0.35;
      const partnerX = x + ((index + 1) * spacing);

      nodes.push({
        ...partner,
        position: [partnerX, currentConfig.y, z],
        color: myColor || "#ffffff",
        size: currentConfig.size,
        depth,
        isPartner: true
      });
    });
  }

  if (root.children && root.children.length > 0) {
    const children = root.children;
    const count = children.length;
    const totalAngle = angleRange.end - angleRange.start;
    const step = totalAngle / count;

    children.forEach((child, i) => {
      let childStart = angleRange.start + (i * step);
      let childEnd = childStart + step;
      let cColor = myColor;
      if (depth === 0) { cColor = colors[i % colors.length]; }

      const childNodes = calculateLayout(child, depth + 1, { start: childStart, end: childEnd }, { x, y: currentConfig.y, z }, cColor);
      nodes = nodes.concat(childNodes);
    });
  }
  return nodes;
};

// --- 6. RELATIONSHIP HELPERS ---
const PulsingLine = ({ start, end, mid, color, lineWidth }) => {
  const lineRef = useRef();
  useFrame((state) => {
    if (lineRef.current) {
      const t = state.clock.getElapsedTime();
      // Stronger pulse for green lines
      const pulse = 1.2 + Math.sin(t * 6) * 0.4;
      lineRef.current.lineWidth = lineWidth * pulse;
    }
  });

  return (
    <QuadraticBezierLine
      ref={lineRef}
      start={start}
      end={end}
      mid={mid}
      color={color}
      lineWidth={lineWidth}
    />
  );
};

const ZigZagLine = ({ start, end, mid, color, lineWidth }) => {
  const points = useMemo(() => {
    // mid is the control point for QuadraticBezier
    const baseCurve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const basePoints = baseCurve.getPoints(50);
    const zigZagPoints = [];

    for (let i = 0; i < basePoints.length; i++) {
      const p = basePoints[i].clone();
      if (i > 0 && i < basePoints.length - 1) {
        // Calculate a perpendicular offset for zig-zag
        const normal = new THREE.Vector3().subVectors(basePoints[i + 1], basePoints[i - 1]).normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const perp = new THREE.Vector3().crossVectors(normal, up).normalize();

        // Offset amount alternates
        const offsetAmount = (i % 2 === 0 ? 0.25 : -0.25);
        p.add(perp.multiplyScalar(offsetAmount));
      }
      zigZagPoints.push(p);
    }
    return zigZagPoints;
  }, [start, end, mid]);

  const lineRef = useRef();
  useFrame((state) => {
    if (lineRef.current) {
      const t = state.clock.getElapsedTime();
      // Red pulsing effect for conflict
      const pulse = 1.5 + Math.sin(t * 8) * 0.5;
      lineRef.current.material.linewidth = lineWidth * pulse * 2; // Line in drei uses material.linewidth
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={lineWidth * 3} // Much thicker for conflict
      transparent
      opacity={0.9}
    />
  );
};

const RelationshipArcs = ({ nodes, relationships }) => {
  return (
    <group>
      {relationships.map((rel, i) => {
        const startNode = nodes.find(n => n.id === rel.from);
        const endNode = nodes.find(n => n.id === rel.to);

        if (!startNode || !endNode) return null;

        let color = 'white';
        let dash = false;
        let width = 1;
        let midPointOffset = 2;

        switch (rel.type) {
          case 'conflict':
            color = '#ef4444';
            midPointOffset = 3;
            break;
          case 'close':
            color = '#22c55e';
            width = 3; // Thicker by default
            midPointOffset = 1.5;
            break;
          case 'distant':
            color = '#9ca3af';
            dash = true;
            width = 2; // Thicker for visibility
            midPointOffset = 4;
            break;
          case 'codependent':
            color = '#a855f7';
            width = 3;
            midPointOffset = 1;
            break;
        }

        const start = new THREE.Vector3(...startNode.position);
        const end = new THREE.Vector3(...endNode.position);
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        mid.y += midPointOffset;

        if (rel.type === 'close') {
          return <PulsingLine key={`${rel.from}-${rel.to}-${i}`} start={start} end={end} mid={mid} color={color} lineWidth={width} />;
        }

        if (rel.type === 'conflict') {
          return <ZigZagLine key={`${rel.from}-${rel.to}-${i}`} start={start} end={end} mid={mid} color={color} lineWidth={width} />;
        }

        return (
          <QuadraticBezierLine
            key={`${rel.from}-${rel.to}-${i}`}
            start={start}
            end={end}
            mid={mid}
            color={color}
            lineWidth={width}
            dashed={dash}
            dashScale={dash ? 2 : 0}
            gapSize={dash ? 1 : 0}
          />
        );
      })}

      {/* MARITAL BARS for partnered nodes */}
      {nodes.filter(n => n.partnerId).map((node) => {
        const partner = nodes.find(p => p.id === node.partnerId);
        if (!partner) return null;
        // Only render once per pair (avoid duplicates)
        if (node.id > partner.id) return null;

        const start = new THREE.Vector3(...node.position);
        const end = new THREE.Vector3(...partner.position);

        return (
          <Line
            key={`marital-${node.id}-${partner.id}`}
            points={[start, end]}
            color="#fbbf24" // Gold/amber for marriage
            lineWidth={3}
            segments
          />
        );
      })}
    </group>
  );
};

// --- 7. NEW: CONTEXT RING COMPONENT (CIRCULAR HOLOGRAPHIC HUD) ---
const ContextRing = ({ node, onLink, onEdit, onStatusToggle, onClose, readOnly }) => {
  if (!node) return null;

  return (
    <Html position={node.position} center distanceFactor={5}>
      <div className="flex flex-col items-center gap-4 pointer-events-auto">
        {/* Circular Holographic HUD */}
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Animated Holographic Rings */}
          <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="#22d3ee" strokeWidth="0.3" strokeDasharray="3,3" opacity="0.4" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="5,5" opacity="0.6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#0ea5e9" strokeWidth="0.8" opacity="0.3" />
          </svg>
          <svg className="absolute inset-0 w-full h-full animate-[spin_15s_linear_infinite_reverse]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="#06b6d4" strokeWidth="0.4" strokeDasharray="2,6" opacity="0.5" />
          </svg>

          {/* Circular Container */}
          <div className="z-10 bg-black/90 backdrop-blur-xl border-2 border-cyan-500 rounded-full w-44 h-44 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.4)] relative">
            {/* Node Name at Center */}
            <div className="text-white font-black text-xs uppercase tracking-tighter mb-4 px-4 text-center">
              {node.name}
            </div>

            {/* Icon Button Grid */}
            {!readOnly && (
              <div className="grid grid-cols-3 gap-3 px-2">
                {/* Link Button */}
                <button
                  onClick={() => onLink(node.id)}
                  className="w-12 h-12 bg-cyan-500/10 hover:bg-cyan-500/30 border-2 border-cyan-500/50 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                  title="Link Node"
                >
                  <span className="text-2xl">🔗</span>
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => onEdit(node)}
                  className="w-12 h-12 bg-purple-500/10 hover:bg-purple-500/30 border-2 border-purple-500/50 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  title="Edit Details"
                >
                  <span className="text-2xl">✏️</span>
                </button>

                {/* Toggle Status Button */}
                <button
                  onClick={() => {
                    onStatusToggle(node.id);
                    onClose();
                  }}
                  className="w-12 h-12 bg-amber-500/10 hover:bg-amber-500/30 border-2 border-amber-500/50 rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  title="Toggle Status"
                >
                  <span className="text-2xl">💀</span>
                </button>
              </div>
            )}

            {/* Close Button - positioned inside the circle */}
            <button
              onClick={onClose}
              className="absolute bottom-2 text-gray-400 hover:text-white text-[9px] uppercase font-bold tracking-widest transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Html>
  );
};

// --- 8. RELATIONSHIP PICKER MODAL ---
const RelationshipPicker = ({ sourceNode, targetNode, onSelect, onCancel, onDelete, existingType }) => {
  if (!sourceNode || !targetNode) return null;

  const relationshipTypes = [
    { type: 'conflict', label: 'Conflict', color: 'red', emoji: '⚔️', bgClass: 'bg-red-500/20 hover:bg-red-500/40 border-red-500', shadowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.4)]' },
    { type: 'close', label: 'Close', color: 'green', emoji: '💚', bgClass: 'bg-green-500/20 hover:bg-green-500/40 border-green-500', shadowClass: 'shadow-[0_0_25px_rgba(34,197,94,0.4)]' },
    { type: 'codependent', label: 'Codependent', color: 'purple', emoji: '🧬', bgClass: 'bg-purple-500/20 hover:bg-purple-500/40 border-purple-500', shadowClass: 'shadow-[0_0_25px_rgba(168,85,247,0.4)]' },
    { type: 'distant', label: 'Distant', color: 'gray', emoji: '☁️', bgClass: 'bg-gray-500/20 hover:bg-gray-500/40 border-gray-500', shadowClass: 'shadow-[0_0_25px_rgba(156,163,175,0.4)]' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-md">
      <div className="bg-black/95 border-2 border-cyan-500 rounded-2xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(34,211,238,0.5)] animate-[fadeIn_0.3s_ease-in-out]">
        {/* Header */}
        <h2 className="text-white font-black text-lg uppercase tracking-tight text-center mb-2">
          {existingType ? 'Update Relationship' : 'Define Relationship'}
        </h2>
        <p className="text-cyan-400 text-sm text-center mb-6">
          How are <span className="font-bold">{sourceNode.name}</span> and <span className="font-bold">{targetNode.name}</span> related?
        </p>

        {/* Relationship Type Buttons (2x2 Grid) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {relationshipTypes.map(({ type, label, emoji, bgClass, shadowClass }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`${bgClass} ${shadowClass} border-2 ${existingType === type ? 'border-white' : 'border-transparent'} rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95`}
            >
              <span className="text-4xl">{emoji}</span>
              <span className="text-white font-bold text-sm uppercase tracking-wide">{label}</span>
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          {onDelete && (
            <button
              onClick={onDelete}
              className="w-full bg-red-900/40 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 font-bold py-3 rounded-xl uppercase tracking-widest transition-all mb-2"
            >
              🗑️ Delete Relationship
            </button>
          )}
          <button
            onClick={onCancel}
            className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white border border-gray-600 rounded-lg py-2 text-xs uppercase font-bold tracking-widest transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
// --- 9. EDIT NODE MODAL COMPONENT ---
const EditNodeModal = ({ node, onSave, onCancel, onAddChild, onAddPartner }) => {
  const [formData, setFormData] = React.useState({
    name: node?.name || '',
    gender: node?.gender || 'unknown',
    dateOfBirth: node?.dateOfBirth || '',
    isIndex: node?.isIndex || false,
    substanceAbuse: node?.substanceAbuse || false,
    mentalHealth: node?.mentalHealth || false,
    physicalIllness: node?.physicalIllness || false,
  });

  if (!node) return null;

  const handleSave = () => {
    onSave({
      ...node,
      ...formData
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/80 backdrop-blur-md">
      <div className="bg-black/95 border-2 border-cyan-500 rounded-2xl p-8 max-w-2xl w-full shadow-[0_0_60px_rgba(34,211,238,0.5)] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <h2 className="text-white font-black text-2xl uppercase tracking-tight text-center mb-6 border-b border-cyan-500/30 pb-4">
          Edit Person Details
        </h2>

        {/* A. IDENTITY SECTION */}
        <div className="mb-8">
          <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-xl">👤</span> Identity
          </h3>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="Enter name..."
            />
          </div>

          {/* Gender Radio Buttons */}
          <div className="mb-4">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-3">Gender</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                className={`${formData.gender === 'male' ? 'bg-blue-500/30 border-blue-500' : 'bg-gray-800/50 border-gray-600'} border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-110`}
              >
                <span className="text-3xl">📦</span>
                <span className="text-white font-bold text-xs uppercase">Male (Cube)</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                className={`${formData.gender === 'female' ? 'bg-pink-500/30 border-pink-500' : 'bg-gray-800/50 border-gray-600'} border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-110`}
              >
                <span className="text-3xl">⚪</span>
                <span className="text-white font-bold text-xs uppercase">Female (Sphere)</span>
              </button>
              <button
                onClick={() => setFormData({ ...formData, gender: 'unknown' })}
                className={`${formData.gender === 'unknown' ? 'bg-purple-500/30 border-purple-500' : 'bg-gray-800/50 border-gray-600'} border-2 rounded-xl p-4 flex flex-col items-center gap-2 transition-all hover:scale-110`}
              >
                <span className="text-3xl">💎</span>
                <span className="text-white font-bold text-xs uppercase">Unknown (Diamond)</span>
              </button>
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Date of Birth / Age</label>
            <input
              type="text"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full bg-gray-900/50 border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:border-cyan-500 focus:outline-none transition-colors"
              placeholder="e.g., 1972 or March 15, 1972"
            />
          </div>
        </div>

        {/* B. ROLE SECTION */}
        <div className="mb-8">
          <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-xl">⭐</span> Role
          </h3>

          {/* Index Person Checkbox */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isIndex}
                onChange={(e) => setFormData({ ...formData, isIndex: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-8 bg-gray-700 rounded-full peer-checked:bg-cyan-500 transition-colors"></div>
              <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
            </div>
            <div>
              <span className="text-white font-bold text-sm">Index Person</span>
              <p className="text-gray-400 text-xs">Applies heartbeat pulse animation to this node</p>
            </div>
          </label>
        </div>

        {/* C. ATTRIBUTES SECTION */}
        <div className="mb-8">
          <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-xl">🏥</span> Attributes
          </h3>

          <div className="space-y-3">
            {/* Substance Abuse */}
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-800/30 transition-colors">
              <input
                type="checkbox"
                checked={formData.substanceAbuse}
                onChange={(e) => setFormData({ ...formData, substanceAbuse: e.target.checked })}
                className="w-5 h-5 bg-gray-700 border-2 border-gray-600 rounded checked:bg-red-500 checked:border-red-500 transition-colors"
              />
              <div>
                <span className="text-white font-semibold text-sm">Substance Abuse</span>
              </div>
            </label>

            {/* Mental Health */}
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-800/30 transition-colors">
              <input
                type="checkbox"
                checked={formData.mentalHealth}
                onChange={(e) => setFormData({ ...formData, mentalHealth: e.target.checked })}
                className="w-5 h-5 bg-gray-700 border-2 border-gray-600 rounded checked:bg-blue-500 checked:border-blue-500 transition-colors"
              />
              <div>
                <span className="text-white font-semibold text-sm">Mental Health</span>
              </div>
            </label>

            {/* Physical Illness */}
            <label className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg hover:bg-gray-800/30 transition-colors">
              <input
                type="checkbox"
                checked={formData.physicalIllness}
                onChange={(e) => setFormData({ ...formData, physicalIllness: e.target.checked })}
                className="w-5 h-5 bg-gray-700 border-2 border-gray-600 rounded checked:bg-red-500 checked:border-red-500 transition-colors"
              />
              <div>
                <span className="text-white font-semibold text-sm">Physical Illness</span>
              </div>
            </label>
          </div>
        </div>

        {/* D. FAMILY ACTIONS SECTION */}
        <div className="mb-8 p-4 bg-cyan-900/10 rounded-xl border border-cyan-500/20">
          <h3 className="text-cyan-400 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-xl">🌳</span> Grow Tree
          </h3>
          <p className="text-gray-400 text-xs mb-4">
            Add a new family member connected to <span className="text-white font-bold">{node.name}</span>.
            Currently supports adding children (next generation).
          </p>
          <button
            onClick={() => {
              if (onAddChild) onAddChild(node.id);
              onCancel(); // Close modal after action
            }}
            className="w-full bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-300 border border-cyan-500/50 font-bold py-3 rounded-lg uppercase tracking-wide transition-all flex items-center justify-center gap-2 mb-3"
          >
            <span>👶</span> Add Child to {node.name}
          </button>
          <button
            onClick={() => {
              if (onAddPartner) onAddPartner(node.id);
              onCancel();
            }}
            className="w-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/50 font-bold py-3 rounded-lg uppercase tracking-wide transition-all flex items-center justify-center gap-2"
          >
            <span>💑</span> Add Partner to {node.name}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-bold py-3 rounded-lg uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]"
          >
            Save Changes
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white border border-gray-600 font-bold py-3 rounded-lg uppercase tracking-wider transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 8. MAIN COMPONENT ---
const GenogramVis = ({
  familyData = corleoneFamily,
  onNodeClick,
  onNodeHover,
  selectedNodeId,
  onLinkStart,
  onStatusToggle,
  onEditNode,
  onAddChild,
  readOnly,
  relationships = familyRelationships
}) => {
  const layoutNodes = useMemo(() => calculateLayout(familyData), [familyData]);
  const fruitTexture = useFruitTexture();

  const selectedNode = useMemo(() =>
    layoutNodes.find(n => n.id === selectedNodeId),
    [layoutNodes, selectedNodeId]
  );

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
        <fog attach="fog" args={['#02040a', 15, 70]} />

        <ambientLight intensity={0.2} />
        <pointLight position={[5, 10, 10]} intensity={1.5} color="#ffffff" castShadow />
        <spotLight position={[-10, 5, -5]} angle={0.5} penumbra={1} intensity={2} color="#00ffff" />
        <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffd700" />

        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
        <WireframeTerrain />
        <HologramTree position={[0, -2, 0]} scale={[1.2, 1.2, 1.2]} />
        <Sparkles count={40} scale={[8, 8, 8]} size={3} speed={0.2} color="#00ffff" opacity={0.5} />

        {/* RENDER RELATIONSHIPS */}
        <RelationshipArcs
          nodes={layoutNodes}
          relationships={relationships}
        />

        {layoutNodes.map((node) => (
          <FamilyNode
            key={node.id}
            node={node}
            fruitTexture={fruitTexture}
            onClick={onNodeClick}
            onHover={onNodeHover}
          />
        ))}

        {/* CONTEXT MENU */}
        {selectedNode && (
          <ContextRing
            node={selectedNode}
            onLink={onLinkStart}
            onEdit={onEditNode}
            onStatusToggle={onStatusToggle}
            onClose={() => onNodeClick(null)}
            readOnly={readOnly}
          />
        )}

        <OrbitControls
          minDistance={5}
          maxDistance={30}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.05}
          autoRotate={!selectedNode}
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
};

export default GenogramVis;

export { RelationshipPicker, EditNodeModal };
