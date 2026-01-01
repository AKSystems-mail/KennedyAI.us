import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { db } from '../firebase'; // Ensure path is correct
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

const RoadmapCard = () => {
  const [ideas, setIdeas] = useState([]);
  const [votedItems, setVotedItems] = useState([]);
  const [error, setError] = useState(null);

  // Load votes from local storage on mount
  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('votedItems') || '[]');
    setVotedItems(storedVotes);
  }, []);

  // Real-time listener for Firestore
  useEffect(() => {
    const q = query(collection(db, 'roadmap'), orderBy('votes', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("RoadmapCard: Snapshot received", snapshot.size, "docs");
      const ideasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("RoadmapCard: ideasData", ideasData);
      setIdeas(ideasData);
      setError(null);
    }, (error) => {
      console.error("RoadmapCard: Firestore error", error);
      console.error("RoadmapCard: Error code", error.code);
      console.error("RoadmapCard: Error message", error.message);
      setError("Failed to load roadmap. Please try again later.");
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

  const seedData = async () => {
    try {
        const sampleIdeas = [
            { title: "AI Joke Generator", pitch: "Generate stand-up bits based on trending topics.", votes: 42 },
            { title: "Family Tree VR", pitch: "Walk through your ancestry in virtual reality.", votes: 15 },
            { title: "Spotify Mood Mixer", pitch: "Create playlists based on your current biometric data.", votes: 88 }
        ];
        
        const { addDoc, collection } = await import('firebase/firestore');
        for (const idea of sampleIdeas) {
            await addDoc(collection(db, 'roadmap'), idea);
        }
        alert("Data seeded!");
    } catch (e) {
        console.error("Error seeding data:", e);
        alert("Error seeding data: " + e.message);
    }
  };

  return (
    <div
      className="bg-transparent rounded-3xl p-8 overflow-hidden flex flex-col h-full relative pt-6"
    >
      <div className="flex flex-col mb-6 space-y-2 pt-4">
        <h2 className="text-2xl font-bold text-white px-4">In Progress...</h2>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider px-4">Vote For The Next Project</span>
        <button onClick={seedData} className="text-[10px] text-gray-700 hover:text-red-500 px-4 text-left">DEBUG: Seed Data</button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
        <AnimatePresence>
          {error ? (
            <div className="text-center py-10">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : ideas.length > 0 ? ideas.map((idea) => {
            const hasVoted = votedItems.includes(idea.id);
            return (
              <motion.div
                layout
                key={idea.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-neutral-800/50 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-colors flex gap-4 items-center group"
              >
                {/* Vote Button */}
                <button
                  onClick={() => handleVote(idea.id)}
                  disabled={hasVoted}
                  className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-xl transition-all duration-300 ${hasVoted
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
          }) : (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No active project ideas found.</p>
              <p className="text-gray-600 text-[10px] mt-2 uppercase tracking-widest">Check back soon for updates!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Fade at bottom for scrolling list */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
};

export default RoadmapCard;