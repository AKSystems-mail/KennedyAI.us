import { useState, Suspense, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import GenogramVis from './GenogramVis.jsx'; // Ensure this imports your new GenogramVis
// @ts-ignore - RelationshipPicker is exported from .jsx file
import { RelationshipPicker } from './GenogramVis.jsx';
// @ts-ignore - EditNodeModal is exported from .jsx file  
import { EditNodeModal } from './GenogramVis.jsx';
// @ts-ignore
import { AddChildModal } from './GenogramVis.jsx';
import SimpleErrorBoundary from '../components/SimpleErrorBoundary';
import { type Person, corleoneFamily, familyRelationships, findRelationship } from '../utils/genogramLogic';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
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

    // Add Child Modal State
    const [addChildModalOpen, setAddChildModalOpen] = useState(false);
    const [pendingParentId, setPendingParentId] = useState<string | null>(null);
    const [potentialParents, setPotentialParents] = useState<Person[]>([]);

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

    const handleManualSave = async (data = familyData, rels = relationships) => {
        if (!currentGenogram) return;
        setIsSaving(true);
        const result = await GenogramService.updateGenogram(currentGenogram.id!, {
            familyData: data,
            relationships: rels
        });
        if (result.success) {
            setHasUnsavedChanges(false);
        }
        setIsSaving(false);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            // Reset to default fictional tree (Godfather 4 generations)
            setFamilyData(corleoneFamily);
            setRelationships(familyRelationships);
            setCurrentGenogram(null);
            setHasUnsavedChanges(false);
            setSelectedNode(null);
            setHoveredNode(null);
            setIsReadOnly(false);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const handleDeletePerson = () => {
        if (!selectedNode) return;

        // Prevent deleting if node has children (descendants check)
        // Note: selectedNode from state might be stale or partial, find strict ref
        const nodeToDelete = findNodeById(familyData, selectedNode.id);
        if (!nodeToDelete) return;

        // Check for children or partners with children (essentially any descendants below this node)
        // If it's a partner, we check their own children array.
        // If it's a primary node, check its children array.
        const hasChildren = (nodeToDelete.children && nodeToDelete.children.length > 0);

        // Also check if any partner has children? 
        // Logic: "Child cannot be deleted because A grandchild exists".
        // This usually implies we just check direct children array.
        // If I delete a node, its partners might be left dangling? 
        // Standard logic: You can't delete a node if it anchors others.
        // Let's stick to the user's rule: "no other child created 'above' (descendants) them".
        if (hasChildren) {
            alert("Cannot delete this person because they have children. Delete children first.");
            return;
        }

        const deleteFromTree = (root: Person, idToDelete: string): Person | null => {
            if (root.id === idToDelete) return null; // Root deletion (handled by caller usually)

            // Process children
            if (root.children) {
                root.children = root.children
                    .map(c => deleteFromTree(c, idToDelete))
                    .filter(c => c !== null) as Person[];
            }

            // Process partners - if partner is deleted, remove them from list
            if (root.partners) {
                root.partners = root.partners
                    .map(p => deleteFromTree(p, idToDelete))
                    .filter(p => p !== null) as Person[];
            }

            // Note: If we recursed into a partner and it wasn't deleted, we returned it.
            // If it WAS deleted (returned null), filter removes it.

            return root;
        };

        // Special case: Root deletion
        if (familyData.id === nodeToDelete.id) {
            alert("Cannot delete the root Patriarch/Matriarch. Clear the tree instead.");
            return;
        }

        const nextFamilyData = deleteFromTree({ ...familyData }, nodeToDelete.id);

        if (nextFamilyData) {
            // Remove relationships
            const nextRelationships = relationships.filter(r => r.from !== nodeToDelete.id && r.to !== nodeToDelete.id);

            setFamilyData(nextFamilyData);
            setRelationships(nextRelationships);
            setSelectedNode(null);
            handleManualSave(nextFamilyData, nextRelationships);
        }
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
        const nextData = updateNodeInTree(familyData);
        setFamilyData(nextData);
        setEditingNode(null);
        setHasUnsavedChanges(true);
        handleManualSave(nextData);
    };

    const handleAddChildRequest = (parentId: string) => {
        // 1. Find the node to get its partners
        const parentNode = findNodeById(familyData, parentId);
        if (parentNode) {
            setPendingParentId(parentId);

            // Collect all potential parents including those in 'partners' array 
            // and the one explicitly linked via 'partnerId'
            const parentsMap = new Map<string, Person>();
            parentNode.partners?.forEach(p => parentsMap.set(p.id, p));
            if (parentNode.partnerId) {
                const partnerNode = findNodeById(familyData, parentNode.partnerId);
                if (partnerNode) parentsMap.set(partnerNode.id, partnerNode);
            }

            setPotentialParents(Array.from(parentsMap.values()));
            setAddChildModalOpen(true);
        }
    };

    const handleAddChildConfirm = (details: { secondParentId?: string, childType: 'biological' | 'adopted' | 'foster' }) => {
        if (!pendingParentId) return;

        const { secondParentId, childType } = details;
        const newChildId = crypto.randomUUID();
        const newChild: Person = {
            id: newChildId,
            name: "",
            gender: "unknown",
            status: "living",
            generation: 0,
            parent2Id: secondParentId,
            childType: childType
        };

        const addChildToNode = (root: Person, targetId: string, currentGen: number): Person => {
            const nodeWithGen = { ...root, generation: currentGen };

            // Case A: Adding to the Primary Parent (who is 'root' here)
            if (root.id === targetId) {
                // If it's a PARTNER-ONLY child (e.g. step-child not related to this root directly?)
                // Actually, if we selected "None" or "Joint", we add to this root.
                // If we are strictly adding to a partner, we might need to handle that differently?
                // Option 1 Design: "Joint" -> Add to Primary, link to Partner. "Partner-Only" -> Add to Partner.

                // However, the targetId IS the node we clicked "Add Child" on. 
                // If we selected "None" (Single/Primary Only) -> Add to root.
                // If we selected a Partner (Joint) -> Add to root, set parent2Id.

                // Wait, if the user clicked "Add Child" on the Partner node, targetId is the Partner.
                // Our logic finds partners of the clicked node.

                const updatedChildren = root.children ? [...root.children, { ...newChild, generation: currentGen + 1 }] : [{ ...newChild, generation: currentGen + 1 }];
                return { ...nodeWithGen, children: updatedChildren };
            }

            return {
                ...nodeWithGen,
                children: root.children?.map(child => addChildToNode(child, targetId, currentGen + 1)),
                partners: root.partners?.map(partner => addChildToNode(partner, targetId, currentGen))
            };
        };

        setFamilyData(prev => {
            const next = addChildToNode(prev, pendingParentId, 1);
            const newlyCreated = findNodeById(next, newChildId);
            if (newlyCreated) setEditingNode(newlyCreated);
            handleManualSave(next);
            return next;
        });

        setHasUnsavedChanges(true);
        setAddChildModalOpen(false);
        setPendingParentId(null);
    };

    const handleAddPartner = (nodeId: string) => {
        const newPartnerId = crypto.randomUUID();
        const newPartnerBase: Person = {
            id: newPartnerId,
            name: "",
            gender: "unknown",
            status: "living",
            generation: 0,
            substanceAbuse: false,
            mentalHealth: false,
            physicalIllness: false
        };

        const updateTree = (root: Person, targetId: string, gen: number): Person => {
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

            const updatedPartners = root.partners ? root.partners.map(p => updateTree(p, targetId, gen)) : undefined;

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

        setFamilyData(prev => {
            const next = updateTree(prev, nodeId, 1);
            const newlyCreated = findNodeById(next, newPartnerId);
            if (newlyCreated) setEditingNode(newlyCreated);
            handleManualSave(next);
            return next;
        });
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
                            onAddChild={handleAddChildRequest}
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

                    <div className="flex flex-col gap-2">
                        {!isReadOnly && (
                            user ? (
                                <>
                                    <button
                                        onClick={() => setManagerOpen(true)}
                                        className="bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-400 border border-cyan-500/30 w-36 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        📂 My Trees
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-500/30 w-36 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors"
                                    >
                                        🚪 Logout
                                    </button>
                                    {currentGenogram && (
                                        <>
                                            <button
                                                onClick={() => handleManualSave()}
                                                disabled={!hasUnsavedChanges || isSaving}
                                                className={`w-36 h-12 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors border
                                                ${hasUnsavedChanges
                                                        ? 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                                        : 'bg-black/50 text-gray-500 border-white/10 cursor-not-allowed'}`}
                                            >
                                                💾 {isSaving ? 'Saving...' : 'Save'}
                                            </button>

                                            <button
                                                onClick={handleDeletePerson}
                                                disabled={!selectedNode || (selectedNode.children && selectedNode.children.length > 0) || selectedNode.id === familyData.id}
                                                className={`w-36 h-10 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider transition-colors border
                                                ${!selectedNode || (selectedNode.children && selectedNode.children.length > 0) || selectedNode.id === familyData.id
                                                        ? 'bg-black/50 text-gray-600 border-white/5 cursor-not-allowed hidden'
                                                        : 'bg-red-900/40 hover:bg-red-800/60 text-red-500 border-red-500/30'}`}
                                            >
                                                🗑️ Delete Person
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const shareData = { familyData, relationships };
                                                    const encoded = btoa(JSON.stringify(shareData));
                                                    const shareUrl = `${window.location.origin}${window.location.pathname}#genogram=${encoded}`;
                                                    navigator.clipboard.writeText(shareUrl);
                                                    alert('Read-only share link copied to clipboard!');
                                                }}
                                                className="bg-purple-900/40 hover:bg-purple-800/60 text-purple-400 border border-purple-500/30 w-36 h-10 text-[10px] font-bold uppercase tracking-wider transition-colors"
                                            >
                                                🔗 Share Link
                                            </button>
                                        </>
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
                onAddChild={handleAddChildRequest}
                onAddPartner={handleAddPartner}
            />

            <AddChildModal
                isOpen={addChildModalOpen}
                onClose={() => setAddChildModalOpen(false)}
                onConfirm={handleAddChildConfirm}
                potentialParents={potentialParents}
            />
        </div>
    );
};

export default GenogramPage;