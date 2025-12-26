import { useState, Suspense, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GenogramVis from './GenogramVis.jsx'; // Ensure this imports your new GenogramVis
// @ts-ignore - RelationshipPicker is exported from .jsx file
import { RelationshipPicker } from './GenogramVis.jsx';
// @ts-ignore - EditNodeModal is exported from .jsx file  
import { EditNodeModal } from './GenogramVis.jsx';
import SimpleErrorBoundary from '../components/SimpleErrorBoundary';
import { type Person, corleoneFamily, familyRelationships } from '../utils/genogramLogic';
import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import AuthModal from '../components/AuthModal';
import { FaTimes, FaBars } from 'react-icons/fa';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full text-cyan-500">
        <div className="w-8 h-8 set-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500 mb-2 animate-spin"></div>
        <p className="text-xs tracking-widest uppercase opacity-70">Loading Genogram...</p>
    </div>
);

const GenogramPage = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showLegend, setShowLegend] = useState(true);

    // Data State
    const [familyData, setFamilyData] = useState<Person>(corleoneFamily);
    const [relationships, setRelationships] = useState(familyRelationships);

    // Interaction State
    const [selectedNode, setSelectedNode] = useState<Person | null>(null);
    const [hoveredNode, setHoveredNode] = useState<Person | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [linkingSource, setLinkingSource] = useState<string | null>(null);
    const [relationshipSelector, setRelationshipSelector] = useState<{ sourceId: string; targetId: string } | null>(null);
    const [editingNode, setEditingNode] = useState<Person | null>(null);

    // Auth State
    const [, setUser] = useState<User | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
        return () => unsubscribe();
    }, []);

    // Full Screen Logic
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => console.error(err));
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left + 20, y: e.clientY - rect.top + 20 });
    };

    const handleNodeClick = (node: Person | null) => {
        if (linkingSource && node && node.id !== linkingSource) {
            // Set relationship selector instead of using prompt
            setRelationshipSelector({
                sourceId: linkingSource,
                targetId: node.id
            });
            setLinkingSource(null);
            setSelectedNode(null);
            return;
        }

        if (linkingSource && !node) {
            setLinkingSource(null);
        }

        setSelectedNode(node);
    };

    const handleRelationshipSelect = (type: 'conflict' | 'close' | 'distant' | 'codependent') => {
        if (relationshipSelector) {
            const newRel = {
                from: relationshipSelector.sourceId,
                to: relationshipSelector.targetId,
                type
            };
            // @ts-ignore
            setRelationships(prev => [...prev, newRel]);
            console.log("Relationship Created:", newRel);
        }
        setRelationshipSelector(null);
    };

    const handleRelationshipCancel = () => {
        setRelationshipSelector(null);
    };

    const toggleStatus = (nodeId: string) => {
        const updateNode = (node: Person): Person => {
            if (node.id === nodeId) {
                return { ...node, status: node.status === 'living' ? 'deceased' : 'living' };
            }
            if (node.children) {
                return { ...node, children: node.children.map(updateNode) };
            }
            return node;
        };
        setFamilyData(prev => updateNode(prev));
    };

    const handleEditNode = (node: Person) => {
        setEditingNode(node);
        setSelectedNode(null); // Close the context ring
    };

    const handleEditSave = (updatedNode: Person) => {
        const updateNodeInTree = (root: Person): Person => {
            if (root.id === updatedNode.id) {
                return { ...root, ...updatedNode };
            }
            if (root.children) {
                return { ...root, children: root.children.map(updateNodeInTree) };
            }
            return root;
        };
        setFamilyData(prev => updateNodeInTree(prev));
        setEditingNode(null);
    };

    const handleEditCancel = () => {
        setEditingNode(null);
    };

    // Helper to find nodes by ID
    const findNodeById = (root: Person, id: string): Person | null => {
        if (root.id === id) return root;
        if (root.children) {
            for (const child of root.children) {
                const found = findNodeById(child, id);
                if (found) return found;
            }
        }
        return null;
    };

    const sourceNode = relationshipSelector ? findNodeById(familyData, relationshipSelector.sourceId) : null;
    const targetNode = relationshipSelector ? findNodeById(familyData, relationshipSelector.targetId) : null;

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden group/hero" onMouseMove={handleMouseMove}>

            {/* 1. THE 3D SCENE */}
            <div className="absolute inset-0 z-0">
                <SimpleErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <GenogramVis
                            familyData={familyData}
                            // @ts-ignore - sharing state between components
                            relationships={relationships}
                            onNodeClick={handleNodeClick}
                            onNodeHover={setHoveredNode}
                            selectedNodeId={selectedNode?.id || null}
                            onLinkStart={(id: string) => setLinkingSource(id)}
                            onStatusToggle={toggleStatus}
                            onEditNode={handleEditNode}
                        />
                    </Suspense>
                </SimpleErrorBoundary>
            </div>

            {/* 2. UI OVERLAY */}
            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">

                {/* TOP LEFT: TITLE */}
                <div className="pointer-events-auto absolute top-8 left-8">
                    <h1 className="text-2xl font-black text-white tracking-tighter uppercase">Genogram<span className="text-cyan-400">3D</span></h1>
                    <p className="text-[10px] text-gray-400 tracking-widest uppercase">Interactive Dynamics Visualizer</p>
                </div>

                {/* TOP RIGHT: LEGEND (HUD) */}
                <div className="pointer-events-auto absolute top-8 right-8 flex flex-col items-end gap-2">
                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="bg-black/80 text-cyan-400 w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        {showLegend ? <FaTimes size={16} /> : <FaBars size={16} />}
                    </button>

                    {showLegend && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-3 w-56 shadow-2xl"
                        >
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5">Key</h3>

                            {/* Shapes */}
                            <div className="space-y-1.5 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-cyan-500/20 border border-cyan-400 rounded-sm"></div>
                                    <span className="text-[10px] text-gray-300">Male</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-cyan-500/20 border border-cyan-400 rounded-full"></div>
                                    <span className="text-[10px] text-gray-300">Female</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-cyan-500/20 border border-cyan-400 rotate-45"></div>
                                    <span className="text-[10px] text-gray-300">Unknown / NB</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-gray-700 border border-gray-500 rounded-sm"></div>
                                    <span className="text-[10px] text-gray-300">Deceased</span>
                                </div>
                            </div>

                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5">Relationships</h3>

                            {/* Lines */}
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-0.5 bg-red-500 relative">
                                        <div className="absolute -top-0.5 left-1.5 w-0.5 h-1.5 bg-red-500 rotate-45"></div>
                                    </div>
                                    <span className="text-[10px] text-gray-300">Conflict</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-0.5 bg-green-500 rounded-full"></div>
                                    <span className="text-[10px] text-gray-300">Close</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-1 bg-purple-500 rounded-full border border-black"></div>
                                    <span className="text-[10px] text-gray-300">Codependent</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 border-t border-gray-500 border-dashed"></div>
                                    <span className="text-[10px] text-gray-300">Distant</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* BOTTOM RIGHT: CONTROLS */}
                <div className="pointer-events-auto absolute bottom-8 right-8 flex gap-4 items-end">
                    <button
                        onClick={toggleFullScreen}
                        className="bg-black/80 text-cyan-400 px-3 py-2 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                        <span className="text-[10px] font-bold tracking-widest uppercase">
                            {isFullScreen ? 'EXIT FULL SCREEN' : 'FULL SCREEN'}
                        </span>
                    </button>
                </div>

                {/* LINKING MODE NOTIFICATION */}
                {linkingSource && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-black px-6 py-3 rounded-full font-black uppercase tracking-tighter shadow-[0_0_50px_rgba(34,211,238,0.5)] animate-pulse">
                        Select Target Node
                    </div>
                )}
            </div>

            {/* TOOLTIP */}
            {(hoveredNode || selectedNode) && (
                <div
                    className="absolute z-20 pointer-events-none bg-black/95 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl min-w-[200px]"
                    style={{
                        left: (hoveredNode || selectedNode) ? cursorPos.x : 0,
                        top: (hoveredNode || selectedNode) ? cursorPos.y : 0
                    }}
                >
                    <div className="mb-2">
                        <p className="font-black text-lg text-white">{(hoveredNode || selectedNode)?.name}</p>
                        <p className="text-[10px] text-cyan-400 uppercase tracking-widest">
                            {(hoveredNode || selectedNode)?.gender} • {(hoveredNode || selectedNode)?.status}
                        </p>
                    </div>
                </div>
            )}

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={(u) => setUser(u)} />

            {/* RELATIONSHIP PICKER MODAL */}
            {relationshipSelector && sourceNode && targetNode && (
                <RelationshipPicker
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                    onSelect={handleRelationshipSelect}
                    onCancel={handleRelationshipCancel}
                />
            )}

            {/* EDIT NODE MODAL */}
            {editingNode && (
                <EditNodeModal
                    node={editingNode}
                    onSave={handleEditSave}
                    onCancel={handleEditCancel}
                />
            )}
        </div>
    );
};

export default GenogramPage;