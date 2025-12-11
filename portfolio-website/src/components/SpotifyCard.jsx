import React, { useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import './SpotifyCard.css';

const SpotifyCard = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 h-full flex flex-col justify-between text-white">
      <div className="flex items-center gap-4">
        <img
          src="https://picsum.photos/seed/music/200"
          alt="Album Art"
          className="w-16 h-16 rounded-lg"
        />
        <div className="overflow-hidden flex-1">
          <div className="marquee">
            <p className="text-lg font-bold whitespace-nowrap">Song Title That Is Quite Long and Needs to Scroll</p>
          </div>
          <p className="text-sm text-gray-400">Artist Name</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-end gap-1 h-8">
            {isPlaying && (
                <>
                    <span className="sound-bar style-1"></span>
                    <span className="sound-bar style-2"></span>
                    <span className="sound-bar style-3"></span>
                    <span className="sound-bar style-4"></span>
                </>
            )}
        </div>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="bg-white/10 text-white rounded-full p-3 hover:bg-white/20 transition-colors"
        >
          {isPlaying ? <FaPause className="w-5 h-5" /> : <FaPlay className="w-5 h-5 pl-1" />}
        </button>
      </div>
    </div>
  );
};

export default SpotifyCard;