import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

const RoadmapDraftingTable = () => {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [votedItems, setVotedItems] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('votedItems') || '[]');
    setVotedItems(storedVotes);

    const q = query(collection(db, 'roadmap'), orderBy('votes', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIdeas(ideasData);
      setError(null);
    }, (err) => {
      console.error("RoadmapDraftingTable: Firestore error", err);
      setError("Failed to load drafting table.");
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async (id: string) => {
    if (votedItems.includes(id)) return;
    const itemRef = doc(db, 'roadmap', id);
    await updateDoc(itemRef, { votes: increment(1) });
    const newVotedItems = [...votedItems, id];
    setVotedItems(newVotedItems);
    localStorage.setItem('votedItems', JSON.stringify(newVotedItems));
  };

  return (
    <div className="w-full bg-[#081b33] py-24 relative overflow-hidden">
      {/* Blueprint Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-brand-accent rounded-full animate-ping" />
              <span className="font-mono text-xs text-brand-accent uppercase tracking-[0.4em] font-bold">R&D_DRAFTING_TABLE</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tighter uppercase">
              Project <span className="text-brand-accent italic underline decoration-white/20">Blueprints</span>
            </h2>
          </div>
          {error ? (
            <p className="text-red-400 font-mono text-xs uppercase">{error}</p>
          ) : (
            <p className="text-gray-400 font-mono text-sm uppercase tracking-widest max-w-xs text-right">
              Vote to prioritize the next module in production.
            </p>
          )}
        </div>

        {/* Horizontal Scroll Container */}
        <div className="flex gap-8 overflow-x-auto pb-12 custom-scrollbar snap-x">
          <AnimatePresence>
            {ideas.map((idea, index) => {
              const hasVoted = votedItems.includes(idea.id);
              return (
                <motion.div
                  key={idea.id}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="min-w-[350px] md:min-w-[450px] bg-black/40 backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between h-[450px] snap-center group hover:border-brand-accent/50 transition-colors"
                >
                  <div>
                    <div className="flex justify-between items-start mb-8">
                      <span className="font-mono text-[10px] text-brand-accent">REF_NO: 00{index + 1}</span>
                      <div className={`w-3 h-3 rounded-full ${hasVoted ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-brand-accent/20'}`} />
                    </div>
                    
                    <h3 className="text-3xl font-display font-bold text-white mb-4 uppercase tracking-tight group-hover:text-brand-accent transition-colors">
                      {idea.title}
                    </h3>
                    <p className="text-gray-500 font-mono text-xs uppercase leading-relaxed">
                      {idea.pitch}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-gray-600 uppercase">Backing_Strength</span>
                        <span className="text-2xl font-display font-black text-white italic">{idea.votes}</span>
                      </div>
                      <div className="h-10 w-[1px] bg-white/10" />
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] font-mono text-gray-600 uppercase">Priority_Level</span>
                        <span className="text-sm font-mono text-brand-accent font-bold">
                          {idea.votes > 50 ? 'HIGH_READY' : 'IN_QUEUE'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleVote(idea.id)}
                      disabled={hasVoted}
                      className={`w-full py-4 border font-display font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                        hasVoted 
                        ? 'bg-green-500/10 border-green-500/50 text-green-500 cursor-default'
                        : 'border-white/20 text-white hover:bg-brand-accent hover:text-black hover:border-brand-accent'
                      }`}
                    >
                      <FaArrowUp className={hasVoted ? 'hidden' : 'group-hover:-translate-y-1 transition-transform'} />
                      {hasVoted ? 'APPROVED_INIT' : 'APPROVE_FOR_PROD'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDraftingTable;
