import { useState, Suspense, useEffect, useRef } from 'react';
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
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Tree State
    const [familyData, setFamilyData] = useState<Person>(corleoneFamily);

    // Selection State
    const [selectedFirst, setSelectedFirst] = useState<Person | null>(null);
    const [selectedSecond, setSelectedSecond] = useState<Person | null>(null);
    const [relationshipText, setRelationshipText] = useState<string>('');

    // Hover & Sticky Info State
    const [hoveredNode, setHoveredNode] = useState<Person | null>(null);
    const [pinnedNode, setPinnedNode] = useState<Person | null>(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [pinnedPos, setPinnedPos] = useState({ x: 0, y: 0 });

    // Initial Instruction
    const [statusMessage, setStatusMessage] = useState('Select a family member to start.');

    // Edit Mode
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [wizardStep, setWizardStep] = useState(1);
    const [g1Name, setG1Name] = useState('Vito Corleone');
    const [g1Spouse, setG1Spouse] = useState('Carmela');
    const [g2Children, setG2Children] = useState<any[]>([{ id: '2', name: 'Michael', spouse: 'Kay', children: [{ name: 'Anthony', greatGrandChildren: '' }, { name: 'Mary', greatGrandChildren: '' }] }]);

    // Auth State
    const [user, setUser] = useState<User | null>(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTree, setIsLoadingTree] = useState(false);
    const [isCustomTree, setIsCustomTree] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

    useEffect(() => {
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
            }
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => setUser(currentUser));
        return () => unsubscribe();
    }, []);

    // Auto-load saved tree on login
    useEffect(() => {
        if (user && !isReadOnly) {
            // Automatically load user's saved tree when they log in
            const autoLoadTree = async () => {
                try {
                    const docRef = doc(db, "users", user.uid, "trees", "default");
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setFamilyData(docSnap.data().treeData as Person);
                        setIsCustomTree(true);
                        setStatusMessage('Your saved tree has been loaded.');
                        resetSelection();
                    }
                } catch (error) {
                    console.error("Error auto-loading tree:", error);
                }
            };
            autoLoadTree();
        }
    }, [user, isReadOnly]);

    // --- FULL SCREEN LOGIC ---
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch((err: any) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
            setIsFullScreen(true);
        } else {
            document.exitFullscreen();
            setIsFullScreen(false);
        }
    };

    useEffect(() => {
        const handleFSChange = () => setIsFullScreen(!!document.fullscreenElement);
        document.addEventListener('fullscreenchange', handleFSChange);
        return () => document.removeEventListener('fullscreenchange', handleFSChange);
    }, []);

    // Logic Functions
    const handleSaveTree = async () => {
        if (!user) { setAuthModalOpen(true); return; }
        setIsSaving(true); setStatusMessage('Saving tree...');
        try {
            await setDoc(doc(db, "users", user.uid, "trees", "default"), { treeData: familyData, updatedAt: new Date() });
            setStatusMessage('Tree saved successfully!');
        } catch (error) { setStatusMessage('Error saving tree.'); } finally { setIsSaving(false); }
    };

    const handleLoadTree = async () => {
        if (!user) { setAuthModalOpen(true); return; }
        setIsLoadingTree(true); setStatusMessage('Loading your tree...');
        try {
            const docRef = doc(db, "users", user.uid, "trees", "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) { setFamilyData(docSnap.data().treeData as Person); setIsCustomTree(true); setStatusMessage('Tree loaded!'); resetSelection(); }
            else { setStatusMessage('No saved tree found.'); }
        } catch (error) { setStatusMessage('Error loading tree.'); } finally { setIsLoadingTree(false); }
    };

    const handleShareLink = () => {
        try {
            const baseUrl = window.location.origin + window.location.pathname;
            const dataStr = JSON.stringify(familyData);
            const encoded = btoa(unescape(encodeURIComponent(dataStr)));
            const shareUrl = `${baseUrl}#tree=${encoded}`;
            navigator.clipboard.writeText(shareUrl); setStatusMessage('Share link copied to clipboard!');
        } catch (e) { setStatusMessage('Failed to generate share link.'); }
    };

    const handleEditTree = () => {
        setG1Name(familyData.name); setG1Spouse(familyData.spouse || '');
        if (familyData.children) {
            const mappedChildren = familyData.children.map((child, idx) => ({
                id: child.id || `c2-${idx}`, name: child.name, spouse: child.spouse || '',
                children: child.children ? child.children.map(gc => ({ name: gc.name, greatGrandChildren: gc.children ? gc.children.map(ggc => ggc.name).join(', ') : '' })) : []
            }));
            setG2Children(mappedChildren);
        } else { setG2Children([]); }
        setWizardStep(1); setIsEditModalOpen(true);
    };

    const startCustomTree = () => {
        const newTree: Person = {
            id: 'root', name: g1Name, spouse: g1Spouse, generation: 1,
            children: g2Children.map((c, idx) => ({
                id: `c2-${idx}`, name: c.name, spouse: c.spouse, generation: 2,
                children: c.children.map((gc: any, gidx: number) => ({
                    id: `c3-${idx}-${gidx}`, name: gc.name, generation: 3,
                    children: gc.greatGrandChildren.split(',').filter((n: string) => n.trim()).map((ggc: string, ggidx: number) => ({ id: `c4-${idx}-${gidx}-${ggidx}`, name: ggc.trim(), generation: 4, children: [] }))
                }))
            }))
        };
        setFamilyData(newTree); setIsCustomTree(true); setIsEditModalOpen(false); resetSelection();
    };

    const resetSelection = () => { setSelectedFirst(null); setSelectedSecond(null); setPinnedNode(null); setRelationshipText(''); setStatusMessage('Select a family member to start.'); };
    const handleMouseMove = (e: React.MouseEvent) => { const rect = e.currentTarget.getBoundingClientRect(); setCursorPos({ x: e.clientX - rect.left + 20, y: e.clientY - rect.top + 20 }); };

    const handleNodeClick = (node: Person | null, e?: any) => {
        if (!node) { setPinnedNode(null); setHoveredNode(null); return; }
        if (e?.nativeEvent) { const pos = { x: e.nativeEvent.offsetX + 20, y: e.nativeEvent.offsetY + 20 }; setPinnedPos(pos); setCursorPos(pos); }
        if (pinnedNode?.id === node.id) setPinnedNode(null); else setPinnedNode(node);
        if (!selectedFirst) { setSelectedFirst(node); setStatusMessage(`Selected: ${node.name}. Now select another.`); setRelationshipText(''); }
        else if (!selectedSecond) {
            if (node.id === selectedFirst.id) { setSelectedFirst(null); setPinnedNode(null); setStatusMessage('Select a family member to start.'); return; }
            setSelectedSecond(node); const result = findRelationship(selectedFirst.id, node.id, familyData); setRelationshipText(result); setStatusMessage('Relationship found!');
        } else { setSelectedFirst(node); setSelectedSecond(null); setRelationshipText(''); setStatusMessage(`Selected: ${node.name}. Now select another.`); }
    };

    return (
        <div ref={containerRef} className="relative w-full h-full bg-black overflow-hidden group/hero" onMouseMove={handleMouseMove}>

            {/* 1. THE 3D SCENE */}
            <div className="absolute inset-0 z-0">
                <SimpleErrorBoundary>
                    <Suspense fallback={<LoadingSpinner />}>
                        <ThreeDFamilyTree familyData={familyData} onNodeClick={handleNodeClick} onNodeHover={setHoveredNode} />
                    </Suspense>
                </SimpleErrorBoundary>
            </div>

            {/* 2. THE UI OVERLAY */}
            <div className="relative z-10 w-full h-full pointer-events-none">

                {/* TOP LEFT CONTROLS */}
                <div className="pointer-events-auto absolute top-12 left-8 w-full max-w-xs space-y-2">
                    <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-3 border-b border-white/10 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}>
                            <div><h2 className="text-white font-bold text-sm">Family Tree Visualizer</h2><p className="text-[10px] text-gray-500 uppercase tracking-widest">Interactive Hologram</p></div>
                            <motion.div animate={{ rotate: isPanelCollapsed ? 0 : 180 }} className="text-cyan-400 text-xs">▼</motion.div>
                        </div>
                        <motion.div initial={false} animate={{ height: isPanelCollapsed ? 0 : 'auto', opacity: isPanelCollapsed ? 0 : 1 }} className="overflow-hidden">
                            <div className="bg-cyan-900/30 p-2 border-b border-white/10 min-h-[40px] flex flex-col items-center justify-center">
                                {relationshipText ? <p className="text-white text-[11px] font-bold text-center leading-tight">"{relationshipText}"</p> : <p className="text-cyan-400 text-[10px] font-medium text-center uppercase tracking-tight">{statusMessage}</p>}
                            </div>
                            <div className="grid grid-cols-2 divide-x divide-white/10 border-b border-white/10">
                                {user ? (
                                    <button onClick={() => signOut(auth)} className="p-2 text-[10px] text-red-400 hover:bg-white/5 font-bold uppercase truncate">
                                        LOGOUT ({user.displayName || user.email?.split('@')[0]})
                                    </button>
                                ) : (
                                    <button onClick={() => setAuthModalOpen(true)} className="p-2 text-[10px] text-cyan-400 hover:bg-white/5 font-bold">LOGIN / SIGNUP</button>
                                )}
                                <button onClick={handleLoadTree} disabled={isLoadingTree} className="p-2 text-[10px] text-cyan-400 hover:bg-white/5 font-bold" title="Reload your saved tree">{isLoadingTree ? 'LOADING...' : 'RELOAD'}</button>
                            </div>
                            <div className="grid grid-cols-2 gap-px bg-white/10">
                                <button onClick={handleSaveTree} disabled={isSaving} className="bg-black/80 p-2 text-[10px] text-green-400 hover:bg-white/5 font-bold">{isSaving ? 'SAVING...' : 'SAVE'}</button>
                                <button onClick={resetSelection} className="bg-black/80 p-2 text-[10px] text-blue-400 hover:bg-white/5 font-bold">RESET</button>
                            </div>
                            <button onClick={handleShareLink} className="w-full p-2 bg-purple-900/50 text-purple-300 text-[10px] font-bold border-t border-white/10 hover:bg-purple-900/70">SHARE TREE LINK</button>
                        </motion.div>
                    </div>
                </div>

                {/* BOTTOM RIGHT CONTROLS */}
                <div className="pointer-events-auto absolute bottom-8 right-8 flex gap-4 items-end z-50">

                    {/* FULL SCREEN BUTTON - TEXT VERSION */}
                    <button
                        onClick={toggleFullScreen}
                        className="bg-black/80 text-cyan-400 px-4 py-2 border border-white/20 rounded flex items-center justify-center hover:bg-white/10 transition-colors shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                    >
                        <span className="text-sm font-bold tracking-widest uppercase">
                            {isFullScreen ? 'EXIT FULL SCREEN' : 'FULL SCREEN'}
                        </span>
                    </button>

                    {(isCustomTree || user) && !isReadOnly && (
                        <button onClick={handleEditTree} className="bg-black/80 text-white px-4 py-2 border border-white/20 rounded font-bold text-sm flex items-center gap-2 hover:bg-white/10 transition-colors">
                            EDIT TREE <span>✏️</span>
                        </button>
                    )}
                    {!isReadOnly && (
                        <button onClick={() => { setWizardStep(1); setIsEditModalOpen(true); }} className="bg-white text-black px-4 py-2 rounded font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                            CREATE NEW <span>🌳</span>
                        </button>
                    )}
                </div>
            </div>

            {(hoveredNode || pinnedNode) && (
                <div className="absolute z-20 pointer-events-none bg-black/95 backdrop-blur-md border border-white/20 p-4 rounded-xl shadow-2xl min-w-[200px]" style={{ left: hoveredNode ? cursorPos.x : pinnedPos.x, top: hoveredNode ? cursorPos.y : pinnedPos.y }}>
                    <div className="mb-2"><p className="font-black text-lg text-white">{(hoveredNode || pinnedNode)?.name}</p></div>
                    {(hoveredNode || pinnedNode)?.spouse && <div className="mt-2 text-xs text-pink-400 flex items-center gap-1"><span>❤️ Married to</span><span className="font-bold">{(hoveredNode || pinnedNode)?.spouse}</span></div>}
                    {(hoveredNode || pinnedNode)?.children && (hoveredNode || pinnedNode)!.children!.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-white/10"><p className="text-[10px] text-gray-500 uppercase font-black mb-2 tracking-widest">Children</p><ul className="space-y-1">{(hoveredNode || pinnedNode)!.children!.map((child: any) => (<li key={child.id} className="text-xs text-blue-300 flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500" />{child.name}</li>))}</ul></div>
                    )}
                </div>
            )}

            <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={(u) => setUser(u)} />

            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-lg p-6">
                    <div className="bg-neutral-900 border border-white/10 w-full max-w-lg rounded-none p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-1 bg-cyan-500 transition-all duration-500" style={{ width: `${(wizardStep / 4) * 100}%` }} />
                        <button onClick={() => setIsEditModalOpen(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white text-xl">✕</button>
                        <div className="mb-8 mt-12">
                            <p className="text-cyan-500 text-xs font-black uppercase tracking-widest mb-2">Step {wizardStep} of 4</p>
                            <h3 className="text-3xl font-black text-white">{wizardStep === 1 ? "The Grandparents" : wizardStep === 2 ? "The Children" : wizardStep === 3 ? "The Grandchildren" : "The Great-Grandchildren"}</h3>
                        </div>
                        {wizardStep === 1 && (
                            <div className="space-y-4">
                                <label className="block text-gray-400 text-sm font-bold">Start with the head of the family</label>
                                <input className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-white focus:border-cyan-500 outline-none transition-all" value={g1Name} onChange={(e) => setG1Name(e.target.value)} placeholder="Head Name (e.g. Vito)" />
                                <input className="w-full bg-white/5 border border-white/10 rounded-none px-4 py-4 text-white focus:border-cyan-500 outline-none transition-all" value={g1Spouse} onChange={(e) => setG1Spouse(e.target.value)} placeholder="Spouse Name (e.g. Carmela)" />
                                <button onClick={() => setWizardStep(2)} className="w-full mt-4 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black rounded-none transition-all">NEXT STEP</button>
                            </div>
                        )}
                        {wizardStep === 2 && (
                            <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                                {g2Children.map((child, idx) => (
                                    <div key={idx} className="p-4 bg-white/5 rounded-none border border-white/5 space-y-3">
                                        <input placeholder="Child Name" className="w-full bg-black/40 border border-white/10 rounded-none px-3 py-2 text-white text-sm" value={child.name} onChange={(e) => { const newC = [...g2Children]; newC[idx].name = e.target.value; setG2Children(newC); }} />
                                        <input placeholder="Spouse Name (Optional)" className="w-full bg-black/40 border border-white/10 rounded-none px-3 py-2 text-white text-sm" value={child.spouse} onChange={(e) => { const newC = [...g2Children]; newC[idx].spouse = e.target.value; setG2Children(newC); }} />
                                    </div>
                                ))}
                                <button onClick={() => setG2Children([...g2Children, { id: Date.now().toString(), name: '', spouse: '', children: [] }])} className="text-cyan-400 text-sm font-bold hover:underline">+ Add Another Child</button>
                                <div className="flex gap-4 pt-4"><button onClick={() => setWizardStep(1)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-none border border-white/10">BACK</button><button onClick={() => setWizardStep(3)} className="flex-1 py-4 bg-cyan-600 text-white font-black rounded-none">NEXT</button></div>
                            </div>
                        )}
                        {wizardStep === 3 && (
                            <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                                <p className="text-gray-400 text-sm">Add grandchildren for each child.</p>
                                {g2Children.map((child, idx) => (
                                    <div key={idx} className="space-y-2 p-4 bg-white/5 border border-white/10">
                                        <label className="text-white text-xs font-bold uppercase">{child.name || `Child ${idx + 1}`}'s Kids</label>
                                        <textarea placeholder="Comma separated names (e.g. Mike, Ashley)" className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white text-sm min-h-[80px]" value={child.children.map((c: any) => c.name).join(', ')} onChange={(e) => { const names = e.target.value.split(',').map((n: string) => n.trim()); const newC = [...g2Children]; newC[idx].children = names.map((name: string) => { const existing = child.children.find((gc: any) => gc.name === name); return existing || { name, greatGrandChildren: '' }; }); setG2Children(newC); }} />
                                    </div>
                                ))}
                                <div className="flex gap-4 pt-6"><button onClick={() => setWizardStep(2)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-none border border-white/10">BACK</button><button onClick={() => setWizardStep(4)} className="flex-1 py-4 bg-cyan-600 text-white font-black rounded-none">NEXT</button></div>
                            </div>
                        )}
                        {wizardStep === 4 && (
                            <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2">
                                <p className="text-gray-400 text-sm">Now add great-grandchildren for each grandchild.</p>
                                {g2Children.flatMap((child, cIdx) => child.children.filter((gc: any) => gc.name).map((gc: any, gcIdx: number) => (
                                    <div key={`${cIdx}-${gcIdx}`} className="space-y-2 p-4 bg-white/5 border border-white/10">
                                        <label className="text-cyan-400 text-[10px] font-bold uppercase tracking-tighter">{child.name}'s child: <span className="text-white text-xs">{gc.name}</span>'s Kids</label>
                                        <input placeholder="Comma separated (e.g. Baby Mario, Peach)" className="w-full bg-black/40 border border-white/10 rounded-none px-4 py-3 text-white text-sm" value={gc.greatGrandChildren} onChange={(e) => { const newC = [...g2Children]; newC[cIdx].children[gcIdx].greatGrandChildren = e.target.value; setG2Children(newC); }} />
                                    </div>
                                )))}
                                <div className="flex gap-4 pt-6"><button onClick={() => setWizardStep(3)} className="flex-1 py-4 bg-white/5 text-white font-black rounded-none border border-white/10">BACK</button><button onClick={startCustomTree} className="flex-1 py-4 bg-green-600 text-white font-black rounded-none shadow-[0_0_30px_rgba(22,163,74,0.3)]">BUILD TREE</button></div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hero;