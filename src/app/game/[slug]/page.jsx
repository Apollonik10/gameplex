import { getGameBySlug } from '@/services/game.service';
import { getGlossaryTerms } from '@/services/glossary.service';
import { enrichGame } from '@/services/enrichment.service';
import GameDetailsContent from './GameDetailsContent';

async function getGameDetails(slug) {
  const game = await getGameBySlug(slug);
  if (!game) return null;

  if (!game.game_screenshots?.length || !game.game_videos?.length) {
    await enrichGame(game.id);
    return getGameBySlug(slug);
  }

  return game;
}

export default async function GamePage({ params }) {
  const { slug } = await params;
  const [game, glossary] = await Promise.all([
    getGameDetails(slug),
    getGlossaryTerms(),
  ]);

  if (!game) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        Jogo não encontrado.
      </div>
    );
  }

  return <GameDetailsContent game={game} glossary={glossary} />;
}
