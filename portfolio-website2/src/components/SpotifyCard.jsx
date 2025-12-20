import React from 'react';

const SpotifyCard = () => {
  return (
    <div className="bg-slate-900 rounded-3xl p-8 h-[300px] md:h-[380px] group">
      <div className="h-full w-full rounded-2xl overflow-hidden bg-black shadow-inner">
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/playlist/4Bc9li5NNkfiIsYS3hP3yl?utm_source=generator&theme=0"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Spotify Playlist"
        />
      </div>
    </div>
  );
};

export default SpotifyCard;