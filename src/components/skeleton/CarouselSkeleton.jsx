import GameCardSkeleton from "./GameCardSkeleton";

export default function CarouselSkeleton() {
  return (
    <div className="mb-10 px-6 md:px-16">
      <div className="mb-4 h-6 w-48 animate-pulse rounded bg-zinc-900"></div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
