'use client';

import ReactPlayer from 'react-player';

export default function PropertyVideo({ url }) {
  if (!url) return null;
  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0 }}
          controls
          playing={false}
          light={false}
          config={{
            youtube: { playerVars: { modestbranding: 1 } },
          }}
        />
      </div>
    </div>
  );
}
