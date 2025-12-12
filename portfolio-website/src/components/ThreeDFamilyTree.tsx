import React from 'react';
import { Canvas } from '@react-three/fiber';

// --- Minimal Sanity Check Component ---
// No DREI, No Logic, Just a Cube.

const ThreeDFamilyTree = () => {
    return (
        <div style={{ width: '100%', height: '100%', background: '#222', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
            {/* Debug Overlay */}
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 100, color: 'lime', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '10px' }}>
                React 18 / R3F Rendering Test
            </div>

            <Canvas camera={{ position: [0, 0, 5] }}>
                <color attach="background" args={['#222']} />

                {/* Basic Light */}
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} />

                {/* The Red Cube */}
                <mesh rotation={[0.5, 0.5, 0]}>
                    <boxGeometry args={[2, 2, 2]} />
                    <meshStandardMaterial color="red" />
                </mesh>
            </Canvas>
        </div>
    );
};

export default ThreeDFamilyTree;
