import React from 'react';

const SpotifyCard = () => {
  return (
    // Removed fixed heights and background colors. Let the BentoGrid column control the width.
    <div className="h-full w-full overflow-hidden rounded-[23px]">
      <iframe
        style={{ borderRadius: '23px' }}
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
  );
};

export default SpotifyCard;