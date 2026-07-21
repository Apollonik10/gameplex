"use client";

import { useEffect, useRef, useState } from "react";
import { X, FolderOpen, Loader2, AlertTriangle } from "lucide-react";
import { EJS_SYSTEMS, EMULATORJS_CDN } from "@/lib/constants";
import { getRomForGame, getBiosForPlatform, getSignedRomUrl } from "@/services/rom.service";
import { useLocalRom } from "@/hooks/useLocalRom";

/**
 * Player real, baseado em EmulatorJS (https://emulatorjs.org) — um frontend web
 * para cores do RetroArch compilados em WebAssembly. Roda 100% no navegador,
 * sem backend de emulação.
 *
 * ROMs "cloud": a signed URL do Supabase Storage é passada direto pra EJS_gameUrl.
 * ROMs "local": o usuário reseleciona a pasta no dispositivo (input webkitdirectory),
 * o arquivo é localizado pelo nome e vira um blob: URL local.
 */
export default function EmulatorPlayer({ game, onClose }) {
  const containerRef = useRef(null);
  const objectUrlRef = useRef(null);
  const scriptRef = useRef(null);

  const [rom, setRom] = useState(null);
  const [status, setStatus] = useState("loading-rom"); // loading-rom | needs-local | preparing | ready | error | unsupported
  const [errorMsg, setErrorMsg] = useState("");
  const [gameUrl, setGameUrl] = useState(null);

  const { pickAndFindFile, picking, error: pickError } = useLocalRom();

  const platformShortName = game.platforms?.short_name;
  const systemInfo = EJS_SYSTEMS[platformShortName];

  // 1. Carrega o metadado da ROM cadastrada para este jogo
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!systemInfo) {
        setStatus("unsupported");
        return;
      }

      const found = await getRomForGame(game.id);
      if (cancelled) return;

      if (!found) {
        setStatus("error");
        setErrorMsg("Nenhuma ROM cadastrada para este jogo ainda.");
        return;
      }

      setRom(found);

      if (found.storage_type === "cloud") {
        const url = await getSignedRomUrl(found.storage_path);
        if (cancelled) return;
        if (!url) {
          setStatus("error");
          setErrorMsg("Não foi possível gerar o link da ROM na nuvem.");
          return;
        }
        setGameUrl(url);
        setStatus("preparing");
      } else {
        setStatus("needs-local");
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game.id]);

  // 2. Fluxo de ROM local: usuário seleciona a pasta e localizamos o arquivo
  const handlePickLocalFolder = async () => {
    if (!rom) return;
    const file = await pickAndFindFile(rom.filename);
    if (!file) return;

    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setGameUrl(url);
    setStatus("preparing");
  };

  // 3. Injeta o EmulatorJS assim que temos uma gameUrl pronta
  useEffect(() => {
    if (status !== "preparing" || !gameUrl || !containerRef.current) return;

    let cancelled = false;

    async function boot() {
      // BIOS opcional (algumas plataformas exigem, a maioria não)
      let biosUrl;
      const bios = await getBiosForPlatform(game.platform_id);
      if (bios?.storage_type === "cloud" && bios.storage_path) {
        biosUrl = await getSignedRomUrl(bios.storage_path);
      }
      if (cancelled) return;

      window.EJS_player = "#ejs-container";
      window.EJS_core = systemInfo.system;
      window.EJS_gameUrl = gameUrl;
      window.EJS_pathtodata = EMULATORJS_CDN;
      window.EJS_gameName = game.title;
      window.EJS_startOnLoaded = true;
      if (biosUrl) window.EJS_biosUrl = biosUrl;
      if (systemInfo.requiresThreads) window.EJS_threads = true;

      const script = document.createElement("script");
      script.src = `${EMULATORJS_CDN}loader.js`;
      script.async = true;
      script.onload = () => {
        if (!cancelled) setStatus("ready");
      };
      script.onerror = () => {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Falha ao carregar o EmulatorJS (verifique sua conexão).");
        }
      };
      document.body.appendChild(script);
      scriptRef.current = script;
    }

    boot();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, gameUrl]);

  // 4. Limpeza ao fechar
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (scriptRef.current) scriptRef.current.remove();
      try {
        window.EJS_emulator?.gameManager?.exit?.();
      } catch {
        // best-effort cleanup
      }
      delete window.EJS_player;
      delete window.EJS_core;
      delete window.EJS_gameUrl;
      delete window.EJS_biosUrl;
      delete window.EJS_threads;
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-[110]"
      >
        <X size={40} />
      </button>

      <div className="relative aspect-video w-full max-w-5xl bg-zinc-900 shadow-2xl rounded-lg overflow-hidden border border-zinc-800">
        {status === "unsupported" && (
          <Message
            icon={<AlertTriangle className="text-yellow-500" size={40} />}
            title="Sistema ainda sem suporte no navegador"
            text={`O EmulatorJS ainda não tem um core WebAssembly para ${platformShortName}. PS2, por exemplo, não é suportado por nenhum emulador web no momento.`}
          />
        )}

        {status === "loading-rom" && (
          <Message
            icon={<Loader2 className="animate-spin text-red-600" size={40} />}
            title="Verificando ROM cadastrada..."
          />
        )}

        {status === "error" && (
          <Message
            icon={<AlertTriangle className="text-red-500" size={40} />}
            title="Não foi possível iniciar"
            text={errorMsg}
          />
        )}

        {status === "needs-local" && rom && (
          <Message
            icon={<FolderOpen className="text-zinc-400" size={40} />}
            title="Selecione a pasta com suas ROMs"
            text={`Procurando por "${rom.filename}" no dispositivo. Nada é enviado para a internet — a leitura é só local.`}
          >
            <button
              onClick={handlePickLocalFolder}
              disabled={picking}
              className="mt-6 flex items-center gap-2 rounded bg-red-600 px-6 py-3 font-bold text-white transition hover:bg-red-700 disabled:opacity-50"
            >
              {picking ? <Loader2 className="animate-spin" size={18} /> : <FolderOpen size={18} />}
              Selecionar pasta
            </button>
            {pickError && <p className="mt-3 text-sm text-red-500">{pickError}</p>}
          </Message>
        )}

        {status === "preparing" && (
          <Message
            icon={<Loader2 className="animate-spin text-red-600" size={40} />}
            title="Preparando o emulador..."
            text={systemInfo?.requiresThreads ? "Este sistema pode levar alguns segundos a mais para carregar." : undefined}
          />
        )}

        {/* O EmulatorJS injeta o player dentro desta div assim que o script carrega */}
        <div
          id="ejs-container"
          ref={containerRef}
          className={status === "ready" ? "h-full w-full" : "hidden"}
        />
      </div>
    </div>
  );
}

function Message({ icon, title, text, children }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-12 text-center">
      {icon}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {text && <p className="max-w-md text-zinc-500">{text}</p>}
      {children}
    </div>
  );
}
