
import { useState } from 'react';
import ThreeDFamilyTree from './ThreeDFamilyTree';
import { type Person, corleoneFamily, findRelationship } from '../utils/familyTreeLogic';

const HeroFamilyTree = () => {
    // Selection State
    const [selectedFirst, setSelectedFirst] = useState<Person | null>(null);
    const [selectedSecond, setSelectedSecond] = useState<Person | null>(null);
    const [relationshipText, setRelationshipText] = useState<string>('');

    // Hover State
    const [hoveredNode, setHoveredNode] = useState<Person | null>(null);

    // Initial Instruction
    const [statusMessage, setStatusMessage] = useState('Select a family member to start.');

    // Edit Mode (Modal Toggle)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // --- Cursor Tracking for Tooltip ---
    // (If we wanted the tooltip to follow the mouse. For now, we can perhaps just lock it to a corner or simple absolute pos)
    // Actually, following the mouse is nicer for "hover over fruit".
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        // Only update if hovered to save renders? Or always.
        if (hoveredNode) {
            // Offset slightly so it doesn't block click
            setCursorPos({ x: e.nativeEvent.offsetX + 20, y: e.nativeEvent.offsetY + 20 });
        }
    };

    // --- Interaction Logic ---
    const handleNodeClick = (node: Person) => {
        if (!selectedFirst) {
            // First selection
            setSelectedFirst(node);
            setStatusMessage(`Selected: ${node.name}. Now select another.`);
            setRelationshipText('');
        } else if (!selectedSecond) {
            // Second selection (if different)
            if (node.id === selectedFirst.id) {
                // Deselect if same
                setSelectedFirst(null);
                setStatusMessage('Select a family member to start.');
                return;
            }
            setSelectedSecond(node);

            // Calculate Relationship
            const result = findRelationship(selectedFirst.id, node.id, corleoneFamily);
            setRelationshipText(result);
            setStatusMessage('Relationship found!');
        } else {
            // Third click: Reset and start new
            setSelectedFirst(node);
            setSelectedSecond(null);
            setRelationshipText('');
            setStatusMessage(`Selected: ${node.name}. Now select another.`);
        }
    };

    const resetSelection = () => {
        setSelectedFirst(null);
        setSelectedSecond(null);
        setRelationshipText('');
        setStatusMessage('Select a family member to start.');
    }

    return (
        <div
            className="relative w-full h-[500px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800"
            onMouseMove={handleMouseMove}
        >
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0">
                <ThreeDFamilyTree
                    onNodeClick={handleNodeClick}
                    onNodeHover={setHoveredNode}
                />
            </div>

            {/* UI Overlay: Top Left Panel */}
            <div className="absolute top-4 left-4 z-10 w-80 bg-black/80 backdrop-blur-md border border-gray-700/50 p-4 rounded-xl shadow-lg">
                <h2 className="text-white font-bold text-lg mb-1 tracking-tight">Family Tree Visualizer</h2>
                <p className="text-gray-400 text-xs mb-3">Interactive 3D Graph</p>

                {/* Status Box */}
                <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-700 mb-3">
                    <p className="text-cyan-400 text-sm font-semibold mb-1">
                        {statusMessage}
                    </p>

                    {/* Active Selections */}
                    <div className="flex gap-2 mt-2">
                        {selectedFirst && (
                            <span className="px-2 py-1 bg-indigo-900/50 border border-indigo-500/30 rounded text-xs text-indigo-200">
                                1: {selectedFirst.name}
                            </span>
                        )}
                        {selectedSecond && (
                            <span className="px-2 py-1 bg-purple-900/50 border border-purple-500/30 rounded text-xs text-purple-200">
                                2: {selectedSecond.name}
                            </span>
                        )}
                    </div>
                </div>

                {/* Relationship Result */}
                {relationshipText && (
                    <div className="mt-2 p-3 bg-gradient-to-r from-emerald-900/40 to-teal-900/40 border border-emerald-500/30 rounded-lg animate-in fade-in slide-in-from-top-2">
                        <p className="text-emerald-300 font-bold text-sm text-center">
                            {relationshipText}
                        </p>
                    </div>
                )}

                {/* Reset Button (only if active) */}
                {(selectedFirst || selectedSecond) && (
                    <button
                        onClick={resetSelection}
                        className="mt-3 w-full py-1.5 text-xs text-gray-500 hover:text-white border border-transparent hover:border-gray-600 rounded transition-colors"
                    >
                        Reset Selection
                    </button>
                )}
            </div>

            {/* Hover Tooltip (Follows Cursor Logic or Fixed if simple) */}
            {hoveredNode && (
                <div
                    className="absolute z-20 pointer-events-none bg-gray-900/90 border border-gray-600 px-3 py-2 rounded shadow-xl text-white text-xs"
                    style={{
                        left: cursorPos.x,
                        top: cursorPos.y,
                        // Prevent going off screen logic processing is complex, so simple offset for now
                    }}
                >
                    <p className="font-bold text-sm text-yellow-500">{hoveredNode.name}</p>
                    <p className="opacity-80">Generation: {hoveredNode.generation}</p>
                    {hoveredNode.spouse && (
                        <p className="text-pink-300 mt-1">❤️ Spouse: {hoveredNode.spouse}</p>
                    )}
                </div>
            )}

            {/* Edit Mode Button (Bottom Left) */}
            <div className="absolute bottom-4 left-4 z-10">
                <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-sm font-medium rounded-lg border border-gray-600 transition-all shadow-lg hover:shadow-cyan-500/20"
                >
                    <span>✏️ Create My Own Family</span>
                </button>
            </div>

            {/* Edit Modal (UI Toggle Only) */}
            {isEditModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-gray-900 border border-gray-700 w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
                        <button
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-white"
                        >
                            ✕
                        </button>
                        <h3 className="text-xl font-bold text-white mb-2">Create Custom Family</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Reset the current tree and start building your own.
                        </p>

                        <div className="bg-gray-950 rounded border border-gray-800 p-8 text-center text-gray-600 text-sm border-dashed">
                            Form inputs will go here in future steps.
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-gray-300 text-sm hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    alert("Custom Tree Builder functionality coming soon!");
                                    setIsEditModalOpen(false);
                                }}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium shadow-lg shadow-cyan-900/50"
                            >
                                Start New Tree
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HeroFamilyTree;
