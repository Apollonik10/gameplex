import { getPlatformById } from '@/services/platform.service';
import GameCard from '@/components/game-card/GameCard';
import PlatformBadge from '@/components/platform-badge/PlatformBadge';
import { notFound } from 'next/navigation';

export default async function PlatformPage({ params }) {
  const platform = await getPlatformById(params.id);
  if (!platform) notFound();

  return (
    <main className="min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-6 md:px-16">
      <header className="mb-16">
        <PlatformBadge platform={platform} />
        <h1
          className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mt-4"
          style={{ color: platform.brand_color || "#fff" }}
        >
          {platform.name}
        </h1>
        <p className="text-zinc-500 mt-2">
          {platform.manufacturer} · {platform.year_released} · {platform.games?.length} jogos
        </p>
        {platform.rom_extensions && (
          <p className="text-zinc-700 text-xs mt-1 font-mono">
            ROMs: {platform.rom_extensions.join(" · ")}
          </p>
        )}
      </header>

      <div className="flex flex-wrap gap-6">
        {platform.games?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}
