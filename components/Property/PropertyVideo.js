'use client';

import ReactPlayer from 'react-player';

function normalizeYoutubeUrl(url) {
  if (!url) return null;
  if (url.includes("youtube.com/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/watch?v=${id}`;
  }
  if (url.includes("youtube.com/embed/")) {
    const id = url.split("/embed/")[1].split("?")[0];
    return `https://www.youtube.com/watch?v=${id}`;
  }
  return url;
}

export default function PropertyVideo({ url }) {
  const normalizedUrl = normalizeYoutubeUrl(url);
  if (!normalizedUrl) return null;

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div style={{ position: 'relative', paddingTop: '56.25%' }}>
        <ReactPlayer
          url={normalizedUrl}
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
