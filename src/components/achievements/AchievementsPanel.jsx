"use client";

import { useEffect, useState } from "react";
import { Trophy, Lock, Star, ExternalLink } from "lucide-react";
import { getGameWithUserProgress } from "@/services/retroachievements.service";

/**
 * AchievementsPanel — exibe conquistas do RetroAchievements para um jogo.
 *
 * Props:
 *   raGameId  {number|string}  — ID do jogo no RetroAchievements
 *   gameTitle {string}         — Nome do jogo (para link externo)
 *
 * Requer NEXT_PUBLIC_RA_USERNAME e NEXT_PUBLIC_RA_API_KEY no .env.local.
 */
export default function AchievementsPanel({ raGameId, gameTitle }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!raGameId) {
      setLoading(false);
      return;
    }
    getGameWithUserProgress(raGameId).then((result) => {
      setData(result);
      setLoading(false);
    });
  }, [raGameId]);

  if (!raGameId) return null;

  if (loading) {
    return (
      <section className="space-y-4">
        <AchievementsHeader count={0} earned={0} loading />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-zinc-900/50 border border-zinc-800/50 animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!data || data.numAchievements === 0) {
    return (
      <section>
        <AchievementsHeader count={0} earned={0} />
        <p className="text-sm text-zinc-600 italic">
          Nenhuma conquista mapeada no RetroAchievements para este jogo.{" "}
          <a
            href={`https://retroachievements.org/game/${raGameId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:underline inline-flex items-center gap-1"
          >
            Ver no site <ExternalLink size={12} />
          </a>
        </p>
      </section>
    );
  }

  const { achievements, numAchievements, numAwardedToUser, points } = data;
  const earned = numAwardedToUser || 0;
  const progress = numAchievements > 0 ? (earned / numAchievements) * 100 : 0;

  return (
    <section className="space-y-5">
      <AchievementsHeader
        count={numAchievements}
        earned={earned}
        points={points}
        raGameId={raGameId}
      />

      {/* Barra de progresso */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-zinc-500 font-medium">
          <span>{earned} / {numAchievements} desbloqueadas</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Grid de conquistas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {achievements.slice(0, 12).map((ach) => (
          <AchievementCard key={ach.id} achievement={ach} />
        ))}
      </div>

      {achievements.length > 12 && (
        <a
          href={`https://retroachievements.org/game/${raGameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-zinc-800 text-zinc-500 text-sm hover:border-yellow-600 hover:text-yellow-500 transition"
        >
          Ver todas as {numAchievements} conquistas no RetroAchievements
          <ExternalLink size={14} />
        </a>
      )}
    </section>
  );
}

function AchievementsHeader({ count, earned, points, raGameId, loading }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-3">
        <Trophy size={16} className="text-yellow-500" />
        Conquistas
        {!loading && count > 0 && (
          <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            {points} pts
          </span>
        )}
      </h2>
      {raGameId && (
        <a
          href={`https://retroachievements.org/game/${raGameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-400 transition"
        >
          RetroAchievements <ExternalLink size={11} />
        </a>
      )}
    </div>
  );
}

function AchievementCard({ achievement }) {
  const { title, description, points, badgeUrl, badgeLockedUrl, earned, numAwarded } = achievement;
  const imgSrc = earned ? badgeUrl : badgeLockedUrl;

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
        earned
          ? "border-yellow-500/30 bg-yellow-500/5"
          : "border-zinc-800/50 bg-zinc-900/30 opacity-60"
      }`}
    >
      {/* Badge */}
      <div className="relative shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-zinc-800 flex items-center justify-center">
        {imgSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={title}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        ) : earned ? (
          <Star size={20} className="text-yellow-500" />
        ) : (
          <Lock size={20} className="text-zinc-600" />
        )}
        {earned && (
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 flex items-center justify-center">
            <Star size={9} fill="white" className="text-white" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-bold truncate ${earned ? "text-white" : "text-zinc-400"}`}>
          {title}
        </p>
        <p className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{description}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-black ${earned ? "text-yellow-400" : "text-zinc-600"}`}>
            {points} pts
          </span>
          {numAwarded > 0 && (
            <span className="text-[10px] text-zinc-700">
              • {numAwarded.toLocaleString()} jogadores
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
