
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Genogram } from '../services/GenogramService';
import { GenogramService } from '../services/GenogramService';
// No react-icons imports - using emojis
import { format } from 'date-fns';

interface GenogramManagerProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    currentGenogramId: string | null;
    onSelectGenogram: (genogram: Genogram) => void;
}

export const GenogramManager = ({
    isOpen,
    onClose,
    userId,
    currentGenogramId,
    onSelectGenogram
}: GenogramManagerProps) => {
    const [genograms, setGenograms] = useState<Genogram[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'list' | 'create' | 'confirmDelete'>('list');
    const [newGeneogramName, setNewGenogramName] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const fetchGenograms = async () => {
        setLoading(true);
        const data = await GenogramService.getUserGenograms(userId);
        setGenograms(data);
        setLoading(false);
    };

    // Fetch genograms when modal opens
    useEffect(() => {
        if (isOpen && userId) {
            fetchGenograms();
        }
    }, [isOpen, userId]);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!newGeneogramName.trim()) return;

        // Create with a blank root node instead of Corleone data
        const blankRoot = {
            id: 'root-' + Date.now(),
            name: 'New Person',
            gender: 'unknown',
            status: 'living',
            generation: 1
        };

        const result = await GenogramService.createGenogram(
            userId,
            newGeneogramName,
            blankRoot as any, // Use type casting to match Person interface
            [] // No relationships initially
        );

        if (result.success && result.id) {
            // Fetch fresh list
            await fetchGenograms();

            // Select the new genogram
            const newGenogram = await GenogramService.getGenogram(result.id);
            if (newGenogram) {
                onSelectGenogram(newGenogram);
                onClose();
            }
        } else {
            console.error("Failed to create genogram:", result.error);
            setError("Could not create tree. Please check permissions.");
        }
        setCreating(false);
        // Only clear and switch view if successful? User might want to retry.
        if (result.success) {
            setNewGenogramName('');
            setViewMode('list');
        }
    };

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingId(id);
        setViewMode('confirmDelete');
    };

    const confirmDelete = async () => {
        if (!deletingId) return;
        setCreating(true); // Reuse creating state for loading indicator
        await GenogramService.deleteGenogram(deletingId);
        await fetchGenograms();
        setCreating(false);
        setDeletingId(null);
        setViewMode('list');
    };

    if (!isOpen) return null;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-neutral-900 border border-cyan-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/40">
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                            My <span className="text-cyan-400">Genograms</span>
                        </h2>
                        <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">Manage your family trees</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {viewMode === 'list' ? (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-white font-bold text-sm uppercase tracking-wider">Created Genograms ({genograms.length})</h3>
                                <button
                                    onClick={() => setViewMode('create')}
                                    className="text-cyan-400 hover:text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors hover:underline"
                                >
                                    ➕ Create New
                                </button>
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-12">
                                    <div className="w-8 h-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-500 animate-spin"></div>
                                </div>
                            ) : genograms.length === 0 ? (
                                <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                                    <span className="text-4xl mx-auto mb-4 block">📂</span>
                                    <p className="text-gray-400 font-medium">No genograms found</p>
                                    <p className="text-gray-600 text-xs mt-1">Create your first family tree to get started</p>
                                    <button
                                        onClick={() => setViewMode('create')}
                                        className="mt-4 text-cyan-400 text-xs font-bold uppercase tracking-widest hover:text-cyan-300 hover:underline"
                                    >
                                        Create New
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {genograms.map((g) => (
                                        <div
                                            key={g.id}
                                            onClick={() => {
                                                onSelectGenogram(g);
                                                onClose();
                                            }}
                                            className={`
                                                relative group cursor-pointer border rounded-xl p-4 transition-all duration-300
                                                ${currentGenogramId === g.id
                                                    ? 'bg-cyan-900/20 border-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                                    : 'bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10'}
                                            `}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className={`font-bold text-lg mb-1 ${currentGenogramId === g.id ? 'text-cyan-400' : 'text-white'}`}>
                                                        {g.name}
                                                    </h4>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                                                        Edited: {g.updatedAt?.seconds ? format(new Date(g.updatedAt.seconds * 1000), 'MMM d, yyyy') : 'Just now'}
                                                    </p>
                                                </div>
                                                {currentGenogramId === g.id && (
                                                    <span className="bg-cyan-500 text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">
                                                        Active
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                                    <span className="w-2 h-2 rounded-full bg-cyan-500/50"></span>
                                                    {countNodes(g.familyData)} Members
                                                </span>
                                                <button
                                                    onClick={(e) => handleDeleteClick(g.id!, e)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors border border-white/5 hover:border-red-500/30"
                                                    title="Delete Genogram"
                                                >
                                                    <span className="text-sm">🗑️</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : viewMode === 'confirmDelete' ? (
                        <div className="flex flex-col items-center justify-center h-full py-12 relative">
                            {/* Close X Button */}
                            <button
                                onClick={() => {
                                    setDeletingId(null);
                                    setViewMode('list');
                                }}
                                className="absolute top-0 right-0 w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
                            >
                                ✕
                            </button>

                            {/* Trash Icon in Red Circle */}
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mb-6 border-2 border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                                <span className="text-3xl">🗑️</span>
                            </div>

                            {/* Centered Text */}
                            <h3 className="text-xl font-bold text-white mb-2 text-center">Delete Genogram?</h3>
                            <p className="text-gray-400 text-sm mb-8 text-center max-w-xs">
                                Are you sure you want to delete <span className="text-white font-bold">"{genograms.find(g => g.id === deletingId)?.name}"</span>?
                                <br />
                                This action <span className="text-red-400 underline">cannot be undone</span>.
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3 w-full max-w-xs">
                                <button
                                    onClick={() => {
                                        setDeletingId(null);
                                        setViewMode('list');
                                    }}
                                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                                >
                                    ❌ Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={creating}
                                    className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-lg font-bold text-sm transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    🗑️ {creating ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full justify-center max-w-sm mx-auto">
                            <h3 className="text-xl font-bold text-white mb-6 text-center">Name Your New Tree</h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    {error && (
                                        <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-xs p-3 mb-4 rounded-none">
                                            {error}
                                        </div>
                                    )}
                                    <label className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-1 block">Genogram Name</label>
                                    <input
                                        type="text"
                                        value={newGeneogramName}
                                        onChange={(e) => setNewGenogramName(e.target.value)}
                                        placeholder="e.g. Smith Family Tree"
                                        className="w-full bg-black/50 border border-white/20 rounded-none px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setViewMode('list')}
                                        className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg font-bold text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!newGeneogramName.trim() || creating}
                                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2"
                                    >
                                        {creating ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : 'Create Tree'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// Helper helper to count nodes for stats
const countNodes = (node: any): number => {
    let count = 1;
    if (node.children && node.children.length > 0) {
        node.children.forEach((child: any) => {
            count += countNodes(child);
        });
    }
    return count;
};
