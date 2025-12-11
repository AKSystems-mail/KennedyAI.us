
import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Sphere, Text } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { corleoneFamily, type Person } from '../utils/familyTreeLogic';

// --- Types ---
interface LayoutNode {
    id: string;
    name: string;
    generation: number;
    position: [number, number, number];
    color: string;
    data: Person;
}

interface LayoutLink {
    id: string;
    start: [number, number, number];
    end: [number, number, number];
    color: string;
}

// --- Layout Logic ---
// Hardcoded colors for branches as requested
const BRANCH_COLORS: { [key: string]: string } = {
    'Sonny Corleone': '#ff4444',     // Red
    'Fredo Corleone': '#a855f7',    // Purple
    'Michael Corleone': '#3b82f6',  // Blue
    'Connie Corleone': '#ec4899',   // Pink
    'Vito Corleone': '#eab308'      // Gold/root
};

const DEFAULT_COLOR = '#06b6d4'; // Cyan

const calculateTreeLayout = (root: Person): { nodes: LayoutNode[], links: LayoutLink[] } => {
    const nodes: LayoutNode[] = [];
    const links: LayoutLink[] = [];

    // Helper to traverse
    const traverse = (person: Person, xRange: [number, number], parentPos?: [number, number, number], branchColor?: string) => {
        // 1. Calculate Y based on generation logic
        // Gen 1 = 0, Gen 2 = 4, Gen 3 = 8.
        // data.generation corresponds to 1, 2, 3...
        const y = (person.generation - 1) * 4;

        // 2. Calculate X
        // We position this node in the center of its allocated xRange
        const x = (xRange[0] + xRange[1]) / 2;
        const z = 0; // Keeping 2D for simplicity in 3D space, or could spiral. User said "Spread them out horizontally".

        const position: [number, number, number] = [x, y, z];

        // Determine color
        // If it's a gen 2 node, pick from CONST. If inherited, use branchColor.
        let myColor = branchColor || DEFAULT_COLOR;
        if (person.generation === 1) myColor = BRANCH_COLORS[person.name] || '#ffffff';
        if (person.generation === 2) myColor = BRANCH_COLORS[person.name] || myColor;

        nodes.push({
            id: person.id,
            name: person.name,
            generation: person.generation,
            position,
            color: myColor,
            data: person
        });

        if (parentPos) {
            links.push({
                id: `${person.id}-link`,
                start: parentPos,
                end: position,
                color: 'cyan'
            });
        }

        // 3. Process Children
        if (person.children && person.children.length > 0) {
            const childCount = person.children.length;
            // Split the current xRange into sub-ranges for children
            const width = xRange[1] - xRange[0];
            const chunk = width / childCount;

            person.children.forEach((child, index) => {
                const startX = xRange[0] + (index * chunk);
                const endX = startX + chunk;
                traverse(child, [startX, endX], position, myColor);
            });
        }
    };

    // Initial Range: -10 to 10 wide
    traverse(root, [-12, 12], undefined);

    return { nodes, links };
};

// --- Component ---

interface ThreeDFamilyTreeProps {
    onNodeClick: (node: Person) => void;
    onNodeHover?: (node: Person | null) => void;
}

const FamilyTreeNode: React.FC<{
    node: LayoutNode;
    onClick: (node: Person) => void;
    onHover?: (node: Person | null) => void;
}> = ({ node, onClick, onHover }) => {
    const [hovered, setHover] = React.useState(false);

    return (
        <group position={node.position}>
            {/* Label */}
            <Text
                position={[0, 0.8, 0]}
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
                outlineWidth={0.02}
                outlineColor="black"
            >
                {node.name.split(' ')[0]}
            </Text>

            {/* Node Sphere */}
            <Sphere
                args={[0.5, 16, 16]}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(node.data);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHover(true);
                    onHover?.(node.data);
                }}
                onPointerOut={() => {
                    setHover(false);
                    onHover?.(null);
                }}
            >
                <meshBasicMaterial
                    color={hovered ? '#ffffff' : node.color}
                    wireframe={true}
                />
            </Sphere>

            {/* Inner Glow Sphere (for Bloom) */}
            <Sphere args={[0.45, 16, 16]}>
                <meshBasicMaterial color={node.color} transparent opacity={0.3} />
            </Sphere>
        </group>
    );
};

const ThreeDFamilyTree: React.FC<ThreeDFamilyTreeProps> = ({ onNodeClick, onNodeHover }) => {
    const { nodes, links } = useMemo(() => calculateTreeLayout(corleoneFamily), []);
    console.log("Tree Layout:", { nodes, links }); // Debugging

    return (
        <div style={{ width: '100%', height: '100%', background: '#000000', borderRadius: '12px', overflow: 'hidden' }}>
            <Canvas camera={{ position: [0, 6, 30], fov: 45 }}>
                <color attach="background" args={['#000000']} />

                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxPolarAngle={Math.PI / 1.5}
                    minDistance={5}
                    maxDistance={30}
                />

                {/* Lights - mainly for standard materials if used, but we use Basic. ambient helps Text? */}
                <ambientLight intensity={0.5} />

                {/* Links */}
                {links.map(link => (
                    <Line
                        key={link.id}
                        points={[link.start, link.end]}
                        color="cyan" // Glowing Cyan
                        lineWidth={2}
                        transparent
                        opacity={0.6}
                    />
                ))}

                {/* Nodes */}
                {nodes.map(node => (
                    <FamilyTreeNode
                        key={node.id}
                        node={node}
                        onClick={onNodeClick}
                        onHover={onNodeHover}
                    />
                ))}

                {/* Post Processing */}
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.2}
                        luminanceSmoothing={0.9}
                        height={300}
                        intensity={1.5}
                    />
                </EffectComposer>

                {/* Grid Helper for that digital look (optional but fits the aesthetic) */}
                <gridHelper args={[30, 30, '#1a1a1a', '#111111']} position={[0, -2, 0]} />

            </Canvas>

            {/* Hint UI Overlay */}
            <div className="absolute bottom-4 right-4 pointer-events-none text-white/50 text-xs text-right font-mono">
                <p>LEFT CLICK: Rotate</p>
                <p>SCROLL: Zoom</p>
            </div>
        </div>
    );
};

export default ThreeDFamilyTree;
