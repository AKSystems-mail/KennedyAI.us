
import { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import ThreeDFamilyTree from './ThreeDFamilyTree.jsx';
import SimpleErrorBoundary from './SimpleErrorBoundary';
import { type Person, corleoneFamily, findRelationship } from '../utils/familyTreeLogic';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import AuthModal from './AuthModal';

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center h-full text-cyan-500">
        <div className="w-8 h-8 set-spin rounded-full border-4 border-cyan-500/30 border-t-cyan-500 mb-2 animate-spin"></div>
        <p className="text-xs tracking-widest uppercase opacity-70">Loading Hologram...</p>
    </div>
);

const Hero = () => {
    // Tree State
    const [familyData, setFamilyData] = useState<Person>(corleoneFamily);

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
    const [wizardStep, setWizardStep] = useState(1);

    // Wizard Form State
    const [g1Name, setG1Name] = useState('Vito Corleone');
    const [g1Spouse, setG1Spouse] = useState('Carmela');
    // Using a separate interface for the wizard form data to handle string vs array differences
    interface WizardGrandChild {
        name: string;
        greatGrandChildren: string; // Comma separated
    }
    interface WizardChild {
        id: string;
        name: string;
        spouse: string;
        children: WizardGrandChild[];
    }
    const [g2Children, setG2Children] = useState<WizardChild[]>([{ id: '2', name: 'Michael', spouse: 'Kay', children: [{ name: 'Anthony', greatGrandChildren: '' }, { name: 'Mary', greatGrandChildren: '' }] }]);

    // --- Auth & Persistence State ---
    const [user, setUser] = useState<User | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTree, setIsLoadingTree] = useState(false);
    const [isCustomTree, setIsCustomTree] = useState(false);

    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);
    const [isReadOnly, setIsReadOnly] = useState(false);

    useEffect(() => {
        // Check for shared tree in URL hash
        const hash = window.location.hash;
        if (hash.startsWith('#tree=')) {
            try {
                const encodedData = hash.substring(6);
                const decodedData = JSON.parse(decodeURIComponent(escape(atob(encodedData))));
                setFamilyData(decodedData);
                setIsReadOnly(true);
                setIsCustomTree(true);
                setStatusMessage('Viewing Shared Tree (Read Only)');
            } catch (e) {
                console.error("Failed to parse shared tree:", e);
                setStatusMessage('Invalid shared tree link.');
            }
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const handleSaveTree = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        setIsSaving(true);
        setStatusMessage('Saving tree...');
        try {
            await setDoc(doc(db, "users", user.uid, "trees", "default"), {
                treeData: familyData,
                updatedAt: new Date()
            });
            setStatusMessage('Tree saved successfully!');
        } catch (error) {
            console.error("Error saving tree:", error);
            setStatusMessage('Error saving tree.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLoadTree = async () => {
        if (!user) {
            setAuthModalOpen(true);
            return;
        }
        setIsLoadingTree(true);
        setStatusMessage('Loading your tree...');
        try {
            const docRef = doc(db, "users", user.uid, "trees", "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setFamilyData(docSnap.data().treeData as Person);
                setIsCustomTree(true);
                setStatusMessage('Tree loaded!');
                resetSelection();
            } else {
                setStatusMessage('No saved tree found.');
            }
        } catch (error) {
            console.error("Error loading tree:", error);
            setStatusMessage('Error loading tree.');
        } finally {
            setIsLoadingTree(false);
        }
    };

    const handleShareLink = () => {
        try {
            const baseUrl = window.location.origin + window.location.pathname;
            const dataStr = JSON.stringify(familyData);
            const encoded = btoa(unescape(encodeURIComponent(dataStr)));
            const shareUrl = `${baseUrl}#tree=${encoded}`;
            navigator.clipboard.writeText(shareUrl);
            setStatusMessage('Share link copied to clipboard!');
        } catch (e) {
            setStatusMessage('Failed to generate share link.');
        }
    };

    const handleEditTree = () => {
        // Reverse map current tree to wizard state
        setG1Name(familyData.name);
        setG1Spouse(familyData.spouse || '');

        if (familyData.children) {
            const mappedChildren = familyData.children.map((child, idx) => ({
                id: child.id || `c2-${idx}`,
                name: child.name,
                spouse: child.spouse || '',
                children: child.children ? child.children.map(gc => ({
                    name: gc.name,
                    greatGrandChildren: gc.children ? gc.children.map(ggc => ggc.name).join(', ') : ''
                })) : []
            }));
            setG2Children(mappedChildren);
        } else {
            setG2Children([]);
        }

        setWizardStep(1);
        setIsEditModalOpen(true);
    };

    // --- Cursor Tracking for Tooltip ---
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        setCursorPos({ x: e.nativeEvent.offsetX + 20, y: e.nativeEvent.offsetY + 20 });
    };

    // --- Interaction Logic ---
    const handleNodeClick = (node: Person) => {
        if (!selectedFirst) {
            setSelectedFirst(node);
            setStatusMessage(`Selected: ${node.name}. Now select another.`);
            setRelationshipText('');
        } else if (!selectedSecond) {
            if (node.id === selectedFirst.id) {
                setSelectedFirst(null);
                setStatusMessage('Select a family member to start.');
                return;
            }
            setSelectedSecond(node);
            const result = findRelationship(selectedFirst.id, node.id, familyData);
            setRelationshipText(result);
            setStatusMessage('Relationship found!');
        } else {
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

    const startCustomTree = () => {
        const newTree: Person = {
            id: 'root',
            name: g1Name,
            spouse: g1Spouse,
            generation: 1,
            children: g2Children.map((c, idx) => ({
                id: `c2-${idx}`,
                name: c.name,
                spouse: c.spouse,
                generation: 2,
                children: c.children.map((gc, gidx) => ({
                    id: `c3-${idx}-${gidx}`,
                    name: gc.name,
                    generation: 3,
                    children: gc.greatGrandChildren.split(',').filter(n => n.trim()).map((ggc, ggidx) => ({
                        id: `c4-${idx}-${gidx}-${ggidx}`,
                        name: ggc.trim(),
                        generation: 4,
                        children: []
                    }))
                }))
            }))
        };
        setFamilyData(newTree);
        setIsCustomTree(true);
        setIsEditModalOpen(false);
        resetSelection();
    };

    return (
        <div
            className="relative w-full h-[600px] bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
            onMouseMove={handleMouseMove}
        >
            {/* 3D Scene Layer */}
            <div className="absolute inset-0 z-0">
                <SimpleErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <ThreeDFamilyTree
                            familyData={familyData}
                            onNodeClick={handleNodeClick}
                            onNodeHover={setHoveredNode}
                        />
                    </Suspense>
                </SimpleErrorBoundary>
            </div>

            {/* UI Overlay: Top Left Panel */}
            <motion.div
                initial={false}
                animate={{ height: isPanelCollapsed ? '64px' : 'auto' }}
                className="absolute top-4 left-4 z-10 w-80 bg-black/70 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl overflow-hidden"
            >
                <div
                    className="p-5 cursor-pointer flex justify-between items-center group transition-colors hover:bg-white/5"
                    onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
                >
                    <div className="px-2">
                        <h2 className="text-white font-bold text-xl mb-1 tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Family Tree Visualizer</h2>
                        <p className="text-gray-400 text-xs uppercase tracking-widest">Interactive Hologram</p>
                    </div>
                    <motion.span
                        animate={{ rotate: isPanelCollapsed ? 0 : 180 }}
                        className="text-cyan-400 mr-2"
                    >
                        ▼
                    </motion.span>
                </div>

                <motion.div
                    initial={false}
                    animate={{ opacity: isPanelCollapsed ? 0 : 1, y: isPanelCollapsed ? -20 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-5 pt-0"
                >
                    {/* Status Box */}
                    <div className="bg-white/5 rounded-none p-4 border border-white/10 mb-4 mx-2">
                        <p className="text-cyan-400 text-sm font-medium mb-2">
                            {statusMessage}
                        </p>

                        {/* Active Selections */}
                        <div className="flex flex-col gap-2">
                            {selectedFirst && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-none text-xs text-cyan-200">
                                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                                    1: {selectedFirst.name}
                                </div>
                            )}
                            {selectedSecond && (
                                <div className="flex items-center gap-2 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-none text-xs text-purple-200">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                    2: {selectedSecond.name}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Relationship Result */}
                    {relationshipText && (
                        <div className="px-2">
                            <div className="p-4 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-none animate-in zoom-in-95 duration-300">
                                <p className="text-white font-semibold text-sm text-center leading-relaxed">
                                    "{relationshipText}"
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reset Button */}
                    {(selectedFirst || selectedSecond) && (
                        <div className="px-2 mt-4">
                            <button
                                onClick={resetSelection}
                                className="w-full py-2 text-xs font-bold text-gray-400 hover:text-white border border-white/5 hover:border-white/20 rounded-none transition-all"
                            >
                                RESET SELECTION
                            </button>
                        </div>
                    )}

                    {/* Auth / Persistence Controls */}
                    <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
                        {user ? (
                            <div className="flex bg-white/5 p-2 rounded-none items-center justify-between mb-2">
                                <span className="text-xs text-gray-400 truncate max-w-[120px]">{user.displayName || user.email}</span>
                                <button onClick={() => signOut(auth)} className="text-[10px] text-red-400 hover:text-red-300 font-bold">LOGOUT</button>
                            </div>
                        ) : !isReadOnly && (
                            <button onClick={() => setAuthModalOpen(true)} className="w-full py-2 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-none border border-white/5 hover:border-cyan-500/30 transition-all mb-2">
                                LOGIN / SIGNUP
                            </button>
                        )}

                        {!isReadOnly && (
                            <div className="flex gap-2 mb-2">
                                <button onClick={handleSaveTree} disabled={isSaving} className="flex-1 py-2 bg-green-900/30 hover:bg-green-500/40 border border-green-500/30 text-green-400 text-xs font-bold rounded-none transition-all">
                                    {isSaving ? 'SAVING...' : 'SAVE'}
                                </button>
                                <button onClick={handleLoadTree} disabled={isLoadingTree} className="flex-1 py-2 bg-blue-900/30 hover:bg-blue-500/40 border border-blue-500/30 text-blue-400 text-xs font-bold rounded-none transition-all">
                                    {isLoadingTree ? 'LOADING...' : 'LOAD'}
                                </button>
                            </div>
                        )}

                        <div className="flex gap-2">
                            <button onClick={handleShareLink} className="w-full py-2 bg-purple-900/30 hover:bg-purple-500/40 border border-purple-500/30 text-purple-400 text-xs font-bold rounded-none transition-all">
                                SHARE
                            </button>
                        </div>

                        {isReadOnly && (
                            <button
                                onClick={() => {
                                    window.location.hash = '';
                                    window.location.reload();
                                }}
                                className="w-full mt-2 py-2 bg-orange-900/30 hover:bg-orange-500/40 border border-orange-500/30 text-orange-400 text-[10px] font-bold rounded-none transition-all"
                            >
                                EXIT SHARED VIEW
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Hover Tooltip: Family Dynamics */}
            {hoveredNode && (
                <div
                    className="absolute z-20 pointer-events-none bg-black/90 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl min-w-[200px]"
                    style={{ left: cursorPos.x, top: cursorPos.y }}
                >
                    <div className="mb-2">
                        <p className="font-black text-lg text-white">{hoveredNode.name}</p>
                    </div>

                    {hoveredNode.spouse && (
                        <div className="mt-2 text-xs text-pink-400 flex items-center gap-1">
                            <span>❤️ Married to</span>
                            <span className="font-bold">{hoveredNode.spouse}</span>
                        </div>
                    )}

                    {hoveredNode.children && hoveredNode.children.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                            <p className="text-[10px] text-gray-500 uppercase font-black mb-2">Children</p>
                            <motion.ul
                                initial="hidden"
                                animate="visible"
                                variants={{
                                    visible: { transition: { staggerChildren: 0.1 } }
                                }}
                                className="space-y-1"
                            >
                                {hoveredNode.children.map((child: any) => (
                                    <motion.li
                                        key={child.id}
                                        variants={{
                                            hidden: { opacity: 0, x: -10 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                        className="text-xs text-blue-300 flex items-center gap-2"
                                    >
                                        <span className="w-1 h-1 rounded-full bg-blue-500" />
                                        {child.name}
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </div>
                    )}
                </div>
            )}




            {/* Edit Mode Button */}
            {/* Bottom Controls */}
            {!isReadOnly && (
                <div className="absolute bottom-6 right-6 z-10 flex gap-4">
                    {(isCustomTree || user) && (
                        <button
                            onClick={handleEditTree}
                            className="group flex items-center gap-3 px-6 py-3 bg-gray-800 text-white border border-white/20 text-sm font-black rounded-none transition-all hover:bg-gray-700 shadow-xl"
                        >
                            <span>EDIT TREE</span>
                            <span className="text-lg">✏️</span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setWizardStep(1);
                            setG1Name('');
                            setG1Spouse('');
                            setG2Children([{ id: Date.now().toString(), name: '', spouse: '', children: [] }]);
                            setIsEditModalOpen(true);
                        }}
                        className="group flex items-center gap-3 px-6 py-3 bg-white text-black text-sm font-black rounded-none transition-all hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                        <span>CREATE NEW</span>
                        <span className="text-lg group-hover:rotate-12 transition-transform">🌳</span>
                    </button>
                </div>
            )}

            <AuthModal
                isOpen={authModalOpen}
                onClose={() => setAuthModalOpen(false)}
                onSuccess={(user) => {
                    setUser(user);
                    setStatusMessage(`Welcome ${user.displayName || 'back'}!`);
                }}
            />

            {/* Edit Modal / Wizard */}
            {
                isEditModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-6">
                        <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-none p-8 shadow-2xl relative overflow-hidden">
                            {/* Progress Bar */}
                            <div className="absolute top-0 left-0 h-1 bg-cyan-500 transition-all duration-500" style={{ width: `${(wizardStep / 4) * 100}%` }} />

                            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white text-xl">✕</button>

                            <div className="mb-8">
                                <p className="text-cyan-500 text-xs font-black uppercase tracking-widest mb-2">Step {wizardStep} of 4</p>
                                <h3 className="text-3xl font-black text-white">
                                    {wizardStep === 1 ? "The Grandparents" : wizardStep === 2 ? "The Children" : wizardStep === 3 ? "The Grandchildren" : "The Great-Grandchildren"}
                                </h3>
                            </div>

                            {wizardStep === 1 && (
                                <div className="space-y-4">
                                    <label className="block text-gray-400 text-sm font-bold">Start with the head of the family</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-white focus:border-cyan-500 outline-none transition-all"
                                        value={g1Name}
                                        onChange={(e) => setG1Name(e.target.value)}
                                        placeholder="Head Name (e.g. Vito)"
                                    />
                                    <input
                                        className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-white focus:border-cyan-500 outline-none transition-all"
                                        value={g1Spouse}
                                        onChange={(e) => setG1Spouse(e.target.value)}
                                        placeholder="Spouse Name (e.g. Carmela)"
                                    />
                                    <button onClick={() => setWizardStep(2)} className="w-full mt-4 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-none transition-all">NEXT STEP</button>
                                </div>
                            )}

                            {wizardStep === 2 && (
                                <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                                    {g2Children.map((child, idx) => (
                                        <div key={idx} className="p-4 bg-white/5 rounded-none border border-white/5 space-y-3">
                                            <input
                                                placeholder="Child Name"
                                                className="w-full bg-black/40 border border-white/10 rounded-none px-3 py-2 text-white text-sm"
                                                value={child.name}
                                                onChange={(e) => {
                                                    const newC = [...g2Children];
                                                    newC[idx].name = e.target.value;
                                                    setG2Children(newC);
                                                }}
                                            />
                                            <input
                                                placeholder="Spouse Name (Optional)"
                                                className="w-full bg-black/40 border border-white/10 rounded-none px-3 py-2 text-white text-sm"
                                                value={child.spouse}
                                                onChange={(e) => {
                                                    const newC = [...g2Children];
                                                    newC[idx].spouse = e.target.value;
                                                    setG2Children(newC);
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => setG2Children([...g2Children, { id: Date.now().toString(), name: '', spouse: '', children: [] }])}
                                        className="text-cyan-400 text-sm font-bold hover:underline"
                                    >
                                        + Add Another Child
                                    </button>
                                    <div className="flex gap-4 pt-4">
                                        <button onClick={() => setWizardStep(1)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-none border border-white/10">BACK</button>
                                        <button onClick={() => setWizardStep(3)} className="flex-1 py-4 bg-cyan-600 text-white font-black rounded-none">NEXT</button>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 3 && (
                                <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                                    <p className="text-gray-400 text-sm">Add grandchildren for each child.</p>
                                    {g2Children.map((child, idx) => (
                                        <div key={idx} className="space-y-2 p-4 bg-white/5 border border-white/10">
                                            <label className="text-white text-xs font-bold uppercase">{child.name || `Child ${idx + 1}`}'s Kids</label>
                                            <textarea
                                                placeholder="Comma separated names (e.g. Mike, Ashley)"
                                                className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white text-sm min-h-[80px]"
                                                value={child.children.map(c => c.name).join(', ')}
                                                onChange={(e) => {
                                                    const names = e.target.value.split(',').map(n => n.trim());
                                                    const newC = [...g2Children];
                                                    // Map existing or new names to the WizardGrandChild structure
                                                    newC[idx].children = names.map(name => {
                                                        const existing = child.children.find(gc => gc.name === name);
                                                        return existing || { name, greatGrandChildren: '' };
                                                    });
                                                    setG2Children(newC);
                                                }}
                                            />
                                        </div>
                                    ))}
                                    <div className="flex gap-4 pt-6">
                                        <button onClick={() => setWizardStep(2)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-none border border-white/10">BACK</button>
                                        <button onClick={() => setWizardStep(4)} className="flex-1 py-4 bg-cyan-600 text-white font-black rounded-none">NEXT</button>
                                    </div>
                                </div>
                            )}

                            {wizardStep === 4 && (
                                <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                                    <p className="text-gray-400 text-sm">Now add great-grandchildren for each grandchild.</p>
                                    {g2Children.flatMap((child, cIdx) =>
                                        child.children.filter(gc => gc.name).map((gc, gcIdx) => (
                                            <div key={`${cIdx}-${gcIdx}`} className="space-y-2 p-4 bg-white/5 border border-white/10">
                                                <label className="text-cyan-400 text-[10px] font-bold uppercase tracking-tighter">
                                                    {child.name}'s child: <span className="text-white text-xs">{gc.name}</span>'s Kids
                                                </label>
                                                <input
                                                    placeholder="Comma separated (e.g. Baby Mario, Peach)"
                                                    className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white text-sm"
                                                    value={gc.greatGrandChildren}
                                                    onChange={(e) => {
                                                        const newC = [...g2Children];
                                                        newC[cIdx].children[gcIdx].greatGrandChildren = e.target.value;
                                                        setG2Children(newC);
                                                    }}
                                                />
                                            </div>
                                        ))
                                    )}
                                    <div className="flex gap-4 pt-6">
                                        <button onClick={() => setWizardStep(3)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-none border border-white/10">BACK</button>
                                        <button onClick={startCustomTree} className="flex-1 py-4 bg-green-600 text-white font-black rounded-none shadow-[0_0_30px_rgba(22,163,74,0.3)]">BUILD TREE</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Hero;
