"use client";

import { useEffect, useRef, useState } from "react";
import { X, FolderOpen, Loader2, AlertTriangle, Play } from "lucide-react";
import { EJS_SYSTEMS, EMULATORJS_CDN } from "@/lib/constants";

/**
 * EmulatorPlayer — player via EmulatorJS (cores RetroArch em WebAssembly).
 *
 * Modos de ROM:
 *  1. localFile (File object) — arquivo selecionado pelo usuário no dispositivo.
 *     Vira um blob: URL temporário. Nada é enviado para a internet.
 *  2. romUrl (string) — URL direta (ex: Supabase signed URL) para compatibilidade futura.
 *
 * Não exige login. O usuário só precisa ter a ROM no dispositivo.
 */
export default function EmulatorPlayer({ game, localFile, romUrl, onClose }) {
  const containerRef = useRef(null);
  const objectUrlRef = useRef(null);
  const scriptRef = useRef(null);

  const [status, setStatus] = useState("idle"); // idle | preparing | ready | error | unsupported | needs-file
  const [errorMsg, setErrorMsg] = useState("");
  const [gameUrl, setGameUrl] = useState(null);

  const platformShortName = game.platforms?.short_name;
  const systemInfo = EJS_SYSTEMS[platformShortName];

  // Verifica suporte ao sistema
  useEffect(() => {
    if (!systemInfo) {
      setStatus("unsupported");
      return;
    }

    // Prioridade: arquivo local fornecido > URL direta > pedir arquivo ao usuário
    if (localFile) {
      const url = URL.createObjectURL(localFile);
      objectUrlRef.current = url;
      setGameUrl(url);
      setStatus("preparing");
    } else if (romUrl) {
      setGameUrl(romUrl);
      setStatus("preparing");
    } else {
      setStatus("needs-file");
    }
  }, [systemInfo, localFile, romUrl]);

  // Seleção manual de arquivo (caso não tenha sido passado via props)
  const handlePickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setGameUrl(url);
    setStatus("preparing");
  };

  // Injeta o EmulatorJS quando gameUrl estiver pronto
  useEffect(() => {
    if (status !== "preparing" || !gameUrl || !containerRef.current) return;

    let cancelled = false;

    function boot() {
      window.EJS_player = "#ejs-container";
      window.EJS_core = systemInfo.system;
      window.EJS_gameUrl = gameUrl;
      window.EJS_pathtodata = EMULATORJS_CDN;
      window.EJS_gameName = game.title;
      window.EJS_startOnLoaded = true;
      if (systemInfo.requiresThreads) window.EJS_threads = true;

      // Remove script anterior se houver
      if (scriptRef.current) {
        scriptRef.current.remove();
        scriptRef.current = null;
      }

      const script = document.createElement("script");
      script.src = `${EMULATORJS_CDN}loader.js`;
      script.async = true;
      script.onload = () => {
        if (!cancelled) setStatus("ready");
      };
      script.onerror = () => {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("Falha ao carregar o EmulatorJS. Verifique sua conexão com a internet.");
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

  // Limpeza ao fechar
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto";
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      if (scriptRef.current) scriptRef.current.remove();
      try {
        window.EJS_emulator?.gameManager?.exit?.();
      } catch {
        // cleanup best-effort
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
        aria-label="Fechar emulador"
      >
        <X size={40} />
      </button>

      <div className="relative aspect-video w-full max-w-5xl bg-zinc-900 shadow-2xl rounded-lg overflow-hidden border border-zinc-800">
        {/* Sistema não suportado */}
        {status === "unsupported" && (
          <Message
            icon={<AlertTriangle className="text-yellow-500" size={40} />}
            title="Sistema sem suporte no navegador"
            text={`O EmulatorJS ainda não tem um core WebAssembly para ${platformShortName}. PS2 e alguns sistemas mais recentes não são suportados.`}
          />
        )}

        {/* Aguardando arquivo */}
        {status === "needs-file" && (
          <Message
            icon={<FolderOpen className="text-zinc-400" size={40} />}
            title="Selecione a ROM do jogo"
            text="Nenhum arquivo é enviado para a internet — a leitura é totalmente local."
          >
            <label className="mt-6 flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-black cursor-pointer hover:bg-zinc-200 transition">
              <Play size={18} fill="currentColor" />
              Selecionar arquivo de ROM
              <input
                type="file"
                className="hidden"
                accept=".zip,.sfc,.smc,.nes,.gb,.gbc,.gba,.n64,.z64,.v64,.nds,.gen,.md,.sms,.gg,.iso,.cso,.pbp,.bin,.cue,.a26,.rom"
                onChange={handlePickFile}
              />
            </label>
          </Message>
        )}

        {/* Preparando */}
        {status === "preparing" && (
          <Message
            icon={<Loader2 className="animate-spin text-red-600" size={40} />}
            title="Preparando o emulador..."
            text={
              systemInfo?.requiresThreads
                ? "Este sistema pode levar alguns segundos a mais para carregar."
                : "Carregando o core de emulação..."
            }
          />
        )}

        {/* Erro */}
        {status === "error" && (
          <Message
            icon={<AlertTriangle className="text-red-500" size={40} />}
            title="Não foi possível iniciar"
            text={errorMsg}
          >
            <button
              onClick={() => {
                setStatus("needs-file");
                setGameUrl(null);
              }}
              className="mt-4 text-sm text-zinc-500 hover:text-white transition underline"
            >
              Tentar com outro arquivo
            </button>
          </Message>
        )}

        {/* Container do EmulatorJS */}
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
