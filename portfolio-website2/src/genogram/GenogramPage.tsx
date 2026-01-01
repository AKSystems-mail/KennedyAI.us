import { useState, Suspense, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GenogramVis from './GenogramVis.jsx'; // Ensure this imports your new GenogramVis
// @ts-ignore - RelationshipPicker is exported from .jsx file
import { RelationshipPicker } from './GenogramVis.jsx';
// @ts-ignore - EditNodeModal is exported from .jsx file  
import { EditNodeModal } from './GenogramVis.jsx';
import SimpleErrorBoundary from '../components/SimpleErrorBoundary';
import { type Person, corleoneFamily, familyRelationships, findRelationship } from '../utils/genogramLogic';
import { auth } from '../firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import AuthModal from '../components/AuthModal';
// No react-icons imports - using emojis
import { GenogramManager } from './GenogramManager';
import type { Genogram } from '../services/GenogramService';
import { GenogramService } from '../services/GenogramService';

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
    const [user, setUser] = useState<User | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);

    // Multi-Genogram State
    const [managerOpen, setManagerOpen] = useState(false);
    const [currentGenogram, setCurrentGenogram] = useState<Genogram | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.startsWith('#genogram=')) {
            try {
                const encoded = hash.split('#genogram=')[1];
                const decoded = JSON.parse(atob(encoded));
                setFamilyData(decoded.familyData);
                setRelationships(decoded.relationships);
                setIsReadOnly(true);
            } catch (e) {
                console.error("Failed to parse shared genogram:", e);
            }
        }
    }, []);

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

    const handleRelationshipSelect = (type: any) => {
        if (relationshipSelector) {
            const index = relationships.findIndex(r =>
                (r.from === relationshipSelector.sourceId && r.to === relationshipSelector.targetId) ||
                (r.from === relationshipSelector.targetId && r.to === relationshipSelector.sourceId)
            );

            if (index !== -1) {
                setRelationships(prev => {
                    const next = [...prev];
                    next[index] = { ...next[index], type };
                    return next;
                });
            } else {
                const newRel = {
                    from: relationshipSelector.sourceId,
                    to: relationshipSelector.targetId,
                    type
                };
                // @ts-ignore
                setRelationships(prev => [...prev, newRel]);
            }
            setHasUnsavedChanges(true);
        }
        setRelationshipSelector(null);
    };

    const handleRelationshipDelete = () => {
        if (relationshipSelector) {
            setRelationships(prev => prev.filter(r =>
                !((r.from === relationshipSelector.sourceId && r.to === relationshipSelector.targetId) ||
                    (r.from === relationshipSelector.targetId && r.to === relationshipSelector.sourceId))
            ));
            setHasUnsavedChanges(true);
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
            return {
                ...node,
                children: node.children?.map(updateNode),
                partners: node.partners?.map(updateNode)
            };
        };
        setFamilyData(prev => updateNode(prev));
        setHasUnsavedChanges(true);
    };

    const handleEditNode = (node: Person) => {
        setEditingNode(node);
        setSelectedNode(null);
    };

    const handleEditSave = (updatedNode: Person) => {
        const updateNodeInTree = (root: Person): Person => {
            if (root.id === updatedNode.id) {
                return { ...root, ...updatedNode };
            }
            return {
                ...root,
                children: root.children?.map(updateNodeInTree),
                partners: root.partners?.map(updateNodeInTree)
            };
        };
        setFamilyData(prev => updateNodeInTree(prev));
        setEditingNode(null);
        setHasUnsavedChanges(true);
    };

    const handleAddChild = (parentId: string) => {
        const newChild: Person = {
            id: crypto.randomUUID(),
            name: "", // Clear name
            gender: "unknown",
            status: "living",
            generation: 0 // Will be corrected by recurse
        };

        const addChildToNode = (root: Person, targetId: string, currentGen: number): Person => {
            // Correct generation logic
            const nodeWithGen = { ...root, generation: currentGen };

            if (root.id === targetId) {
                const updatedChildren = root.children ? [...root.children, { ...newChild, generation: currentGen + 1 }] : [{ ...newChild, generation: currentGen + 1 }];
                return { ...nodeWithGen, children: updatedChildren };
            }

            return {
                ...nodeWithGen,
                children: root.children?.map(child => addChildToNode(child, targetId, currentGen + 1)),
                partners: root.partners?.map(partner => addChildToNode(partner, targetId, currentGen))
            };
        };

        // Assume root is generation 1
        setFamilyData(prev => addChildToNode(prev, parentId, 1));
        setHasUnsavedChanges(true);
        // Automatically open edit for the new child? 
        // We'd need to find it first. For now, let user click it.
    };

    const handleAddPartner = (nodeId: string) => {
        const newPartnerBase: Person = {
            id: crypto.randomUUID(),
            name: "New Partner",
            gender: "unknown",
            status: "living",
            generation: 0 // Will be corrected
        };

        const updateTree = (root: Person, targetId: string, gen: number): Person => {
            // Check current node
            if (root.id === targetId) {
                const partner: Person = {
                    ...newPartnerBase,
                    generation: gen,
                    partnerId: root.id
                };
                return {
                    ...root,
                    generation: gen,
                    partnerId: partner.id,
                    partners: [...(root.partners || []), partner]
                };
            }

            // Recursively check partners (in case we are adding a partner to a partner)
            const updatedPartners = root.partners ? root.partners.map(p => updateTree(p, targetId, gen)) : undefined;

            // Recursively check children
            let updatedChildren = root.children;
            if (root.children) {
                updatedChildren = root.children.map(child => updateTree(child, targetId, gen + 1));
            }

            return {
                ...root,
                generation: gen,
                children: updatedChildren,
                partners: updatedPartners
            };
        };

        setFamilyData(prev => updateTree(prev, nodeId, 1));
        setHasUnsavedChanges(true);
    };

    const handleEditCancel = () => {
        setEditingNode(null);
    };

    const findNodeById = (root: Person, id: string): Person | null => {
        if (root.id === id) return root;
        if (root.children) {
            for (const child of root.children) {
                const found = findNodeById(child, id);
                if (found) return found;
            }
        }
        if (root.partners) {
            for (const partner of root.partners) {
                const found = findNodeById(partner, id);
                if (found) return found;
            }
        }
        return null;
    };

    const getAgeDisplay = (node: Person | null): string | null => {
        if (!node || !node.dateOfBirth) return null;
        const val = node.dateOfBirth.trim();

        // 1. If it's just a 1-3 digit number, assume it is the age
        if (/^\d{1,3}$/.test(val)) {
            return `${val} years old`;
        }

        // 2. If we find a 4-digit year, calculate age
        const yearMatch = val.match(/\b(18|19|20)\d{2}\b/);
        if (yearMatch) {
            const birthYear = parseInt(yearMatch[0]);
            const currentYear = new Date().getFullYear();
            const age = currentYear - birthYear;
            // If deceased, maybe show range? For now, just age.
            return `${age} years old`;
        }

        // 3. Fallback
        return val;
    };

    const sourceNode = relationshipSelector ? findNodeById(familyData, relationshipSelector.sourceId) : null;
    const targetNode = relationshipSelector ? findNodeById(familyData, relationshipSelector.targetId) : null;
    const activeNode = hoveredNode || selectedNode;

    return (
        <div ref={containerRef} className="relative w-full h-screen bg-black overflow-hidden group/hero" onMouseMove={handleMouseMove}>
            <div className="absolute inset-0 z-0">
                <SimpleErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <GenogramVis
                            familyData={familyData}
                            // @ts-ignore
                            relationships={relationships}
                            onNodeClick={handleNodeClick}
                            onNodeHover={setHoveredNode}
                            selectedNodeId={selectedNode?.id || null}
                            onLinkStart={(id: string) => setLinkingSource(id)}
                            onStatusToggle={toggleStatus}
                            onEditNode={handleEditNode}
                            onAddChild={handleAddChild}
                            readOnly={isReadOnly}
                        />
                    </Suspense>
                </SimpleErrorBoundary>
            </div>

            <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                <div className="pointer-events-auto absolute top-8 left-8 flex flex-col gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
                            <span className="text-cyan-400">3D</span>Genogram
                        </h1>
                        <p className="text-lg font-bold text-gray-300 tracking-tight mt-1 min-h-[1.5em]">
                            {linkingSource && hoveredNode ? (
                                <span className="text-cyan-400">
                                    {findRelationship(linkingSource, hoveredNode.id, familyData)}
                                </span>
                            ) : hoveredNode && selectedNode ? (
                                <span className="text-cyan-400">
                                    {findRelationship(selectedNode.id, hoveredNode.id, familyData)}
                                </span>
                            ) : (
                                currentGenogram ? currentGenogram.name : (isReadOnly ? 'Shared Genogram' : 'Family Dynamics')
                            )}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {!isReadOnly && (
                            user ? (
                                <>
                                    <button
                                        onClick={() => setManagerOpen(true)}
                                        className="bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-400 border border-cyan-500/30 w-36 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        📂 My Trees
                                    </button>
                                    {currentGenogram && (
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={async () => {
                                                    if (!currentGenogram) return;
                                                    setIsSaving(true);
                                                    const result = await GenogramService.updateGenogram(currentGenogram.id!, {
                                                        familyData,
                                                        relationships
                                                    });
                                                    if (result.success) {
                                                        setHasUnsavedChanges(false);
                                                    }
                                                    setIsSaving(false);
                                                }}
                                                disabled={!hasUnsavedChanges || isSaving}
                                                className={`w-36 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors border
                                                ${hasUnsavedChanges
                                                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                                        : 'bg-black/50 text-gray-500 border-white/10 cursor-not-allowed'}`}
                                            >
                                                💾 {isSaving ? 'Saving...' : 'Save'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const shareData = { familyData, relationships };
                                                    const encoded = btoa(JSON.stringify(shareData));
                                                    const shareUrl = `${window.location.origin}${window.location.pathname}#genogram=${encoded}`;
                                                    navigator.clipboard.writeText(shareUrl);
                                                    alert('Read-only share link copied to clipboard!');
                                                }}
                                                className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-400 border border-purple-500/30 w-36 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors"
                                            >
                                                Share Link
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => setAuthModalOpen(true)}
                                    className="bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-400 border border-cyan-500/30 w-36 h-12 flex items-center justify-center text-xs font-bold uppercase tracking-wider transition-colors"
                                >
                                    Login to Save
                                </button>
                            )
                        )}
                        {isReadOnly && (
                            <button
                                onClick={() => {
                                    window.location.hash = '';
                                    window.location.reload();
                                }}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 h-12 text-xs font-bold uppercase tracking-wider transition-colors"
                            >
                                Exit Shared View
                            </button>
                        )}
                    </div>
                </div>

                <div className="pointer-events-auto absolute top-8 right-8 flex flex-col items-end gap-2">
                    <button
                        onClick={() => setShowLegend(!showLegend)}
                        className="bg-black/80 text-cyan-400 w-10 h-10 border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                        {showLegend ? '✕' : '☰'}
                    </button>

                    {showLegend && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-black/90 backdrop-blur-md border border-white/20 rounded-xl p-3 w-56 shadow-2xl relative"
                        >
                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5">Key</h3>
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

                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5">Attributes</h3>
                            <div className="space-y-1.5 mb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-[10px] text-gray-300">Substance Abuse</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <span className="text-[10px] text-gray-300">Mental Health</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                    <span className="text-[10px] text-gray-300">Physical Illness</span>
                                </div>
                            </div>

                            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 border-b border-white/10 pb-1.5">Relationships</h3>
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

                {linkingSource && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-black px-6 py-3 rounded-none font-black uppercase tracking-tighter shadow-[0_0_50px_rgba(34,211,238,0.5)] animate-pulse border-2 border-white/20">
                        Select Family Member
                    </div>
                )}
            </div>

            {activeNode && (
                <div
                    className="absolute z-20 pointer-events-none bg-black/95 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl min-w-[200px]"
                    style={{
                        left: cursorPos.x,
                        top: cursorPos.y
                    }}
                >
                    <div className="mb-2">
                        <p className="font-black text-lg text-white">{activeNode.name}</p>
                        <p className="text-[10px] text-cyan-400 uppercase tracking-widest">
                            {activeNode.gender} • {activeNode.status}
                        </p>
                        {activeNode.dateOfBirth && (
                            <p className="text-[10px] text-gray-400 mt-1 font-mono border-t border-white/10 pt-1">
                                {getAgeDisplay(activeNode)}
                            </p>
                        )}
                    </div>
                    {(activeNode.substanceAbuse || activeNode.mentalHealth || activeNode.physicalIllness) && (
                        <div className="mt-2 pt-2 border-t border-white/10 space-y-1">
                            {activeNode.substanceAbuse && (
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                    <span className="text-xs text-gray-300">Substance Abuse</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={(u) => setUser(u)} />

            {user && (
                <GenogramManager
                    isOpen={managerOpen}
                    onClose={() => setManagerOpen(false)}
                    userId={user.uid}
                    currentGenogramId={currentGenogram?.id || null}
                    onSelectGenogram={(propGenogram) => {
                        setCurrentGenogram(propGenogram);
                        setFamilyData(propGenogram.familyData);
                        setRelationships(propGenogram.relationships);
                        setHasUnsavedChanges(false);
                        if (propGenogram.familyData.name === 'New Person') {
                            setEditingNode(propGenogram.familyData);
                        }
                    }}
                />
            )}

            {relationshipSelector && sourceNode && targetNode && (
                <RelationshipPicker
                    sourceNode={sourceNode}
                    targetNode={targetNode}
                    onSelect={handleRelationshipSelect}
                    onCancel={handleRelationshipCancel}
                    onDelete={relationships.some(r =>
                        (r.from === relationshipSelector.sourceId && r.to === relationshipSelector.targetId) ||
                        (r.from === relationshipSelector.targetId && r.to === relationshipSelector.sourceId)
                    ) ? handleRelationshipDelete : undefined}
                    existingType={relationships.find(r =>
                        (r.from === relationshipSelector.sourceId && r.to === relationshipSelector.targetId) ||
                        (r.from === relationshipSelector.targetId && r.to === relationshipSelector.sourceId)
                    )?.type}
                />
            )}

            <EditNodeModal
                node={editingNode}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
                onAddChild={handleAddChild}
                onAddPartner={handleAddPartner}
            />
        </div>
    );
};

export default GenogramPage;