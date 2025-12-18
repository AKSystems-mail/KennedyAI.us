import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { db } from '../firebase'; // Ensure path is correct
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

const RoadmapCard = () => {
  const [ideas, setIdeas] = useState([]);
  const [votedItems, setVotedItems] = useState([]);

  // Load votes from local storage on mount
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('votedItems') || '[]');
    setVotedItems(storedVotes);
  }, []);

  // Real-time listener for Firestore
  useEffect(() => {
    const q = query(collection(db, 'roadmap'), orderBy('votes', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ideasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setIdeas(ideasData);
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async (id) => {
    if (votedItems.includes(id)) return;

    // 1. Optimistic UI update (optional, but feels faster)
    // 2. Update Firestore
    const itemRef = doc(db, 'roadmap', id);
    await updateDoc(itemRef, { votes: increment(1) });

    // 3. Save to local storage
    const newVotedItems = [...votedItems, id];
    setVotedItems(newVotedItems);
    localStorage.setItem('votedItems', JSON.stringify(newVotedItems));
  };

  return (
    <div className="overflow-hidden flex flex-col h-full relative">
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Up Next</h2>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vote for features</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        <AnimatePresence>
          {ideas.map((idea) => {
            const hasVoted = votedItems.includes(idea.id);
            return (
              <motion.div
                layout
                key={idea.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-neutral-800/50 rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors flex gap-4 items-center group"
              >
                {/* Vote Button */}
                <button
                  onClick={() => handleVote(idea.id)}
                  disabled={hasVoted}
                  className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-lg transition-all duration-300 ${
                    hasVoted
                      ? 'bg-green-500/20 text-green-400 cursor-default'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white cursor-pointer'
                  }`}
                >
                  <FaArrowUp className={`w-4 h-4 mb-1 ${hasVoted ? '' : 'group-hover:-translate-y-0.5 transition-transform'}`} />
                  <span className="text-sm font-bold font-mono">{idea.votes}</span>
                </button>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-sm truncate">{idea.title}</h3>
                  <p className="text-gray-400 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                    {idea.pitch}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Fade at bottom for scrolling list */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
};

export default RoadmapCard;