import React, { useState, useEffect } from 'react';
import { Reorder, useMotionValue } from 'framer-motion';
import { FaArrowUp } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';

const initialFeatures = [
  { id: 1, title: 'Recipe AI', description: 'Generate recipes from ingredients.', votes: 0, voted: false },
  { id: 2, title: 'Budget Tracker', description: 'Track expenses and manage budgets.', votes: 0, voted: false },
  { id: 3, title: 'Gym Logger', description: 'Log workouts and track progress.', votes: 0, voted: false },
];

const RoadmapCard = () => {
  const [features, setFeatures] = useState(initialFeatures);

  const handleVote = (id) => {
    setFeatures((prevFeatures) => {
      const newFeatures = prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, votes: feature.votes + 1, voted: true } : feature
      );
      return newFeatures.sort((a, b) => b.votes - a.votes);
    });
  };

  return (
    <div className="bg-neutral-900 text-white p-6 rounded-3xl h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Up Next</h2>
      <Reorder.Group axis="y" values={features} onReorder={setFeatures} className="space-y-3">
        {features.map((feature) => (
          <FeatureItem key={feature.id} feature={feature} onVote={handleVote} />
        ))}
      </Reorder.Group>
    </div>
  );
};

const FeatureItem = ({ feature, onVote }) => {
    const y = useMotionValue(0);
    return (
        <Reorder.Item
          value={feature}
          id={feature.id}
          style={{ y }}
          className="bg-neutral-800 p-4 rounded-lg flex justify-between items-center cursor-grab active:cursor-grabbing"
        >
          <div>
            <h3 className="font-bold text-gray-100">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-300">{feature.votes}</span>
            <button
              onClick={() => onVote(feature.id)}
              className="p-2 rounded-full hover:bg-neutral-700 transition-colors"
            >
              <FaArrowUp className={twMerge("w-4 h-4", feature.voted ? "text-green-500" : "text-gray-400")} />
            </button>
          </div>
        </Reorder.Item>
    )
}

export default RoadmapCard;