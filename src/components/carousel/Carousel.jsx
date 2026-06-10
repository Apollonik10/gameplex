"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GameCard from "../game-card/GameCard";

export default function Carousel({ title, games }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!games || games.length === 0) return null;

  return (
    <div className="relative px-6 md:px-16 mb-12">
      <h2 className="text-xl md:text-2xl font-semibold text-zinc-200 mb-4 hover:text-white cursor-pointer transition-colors inline-block">
        {title}
      </h2>

      <div className="group relative">
        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-[-40px] top-0 bottom-0 z-40 hidden items-center justify-center w-10 bg-zinc-950/50 text-white opacity-0 transition group-hover:opacity-100 md:flex"
        >
          <ChevronLeft size={40} />
        </button>

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>

        <button
          onClick={scrollNext}
          className="absolute right-[-40px] top-0 bottom-0 z-40 hidden items-center justify-center w-10 bg-zinc-950/50 text-white opacity-0 transition group-hover:opacity-100 md:flex"
        >
          <ChevronRight size={40} />
        </button>
      </div>
    </div>
  );
}
