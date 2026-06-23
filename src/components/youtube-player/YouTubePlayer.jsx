"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export default function YouTubePlayer({ videoId, title }) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!videoId) return null;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl">
      {!isPlaying ? (
        <button
          onClick={() => setIsPlaying(true)}
          className="relative h-full w-full"
        >
          <img
            src={thumbnailUrl}
            alt={title || "Video thumbnail"}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105 opacity-60"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition duration-300 group-hover:scale-110 group-hover:bg-red-500">
              <Play size={32} fill="currentColor" className="ml-1" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-lg font-bold text-white text-left line-clamp-1">
              {title || "Assistir Trailer / Gameplay"}
            </h3>
          </div>
        </button>
      ) : (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title || "YouTube video player"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
