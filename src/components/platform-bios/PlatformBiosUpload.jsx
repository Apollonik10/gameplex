"use client";

import { useEffect, useState } from "react";
import { FileCog, UploadCloud, Trash2, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getBiosForPlatform, uploadBios, deleteRom } from "@/services/rom.service";
import { EJS_SYSTEMS } from "@/lib/constants";

/**
 * A maioria dos sistemas não exige BIOS (PS1, Saturn... funcionam sem, com
 * ressalvas de compatibilidade). Este componente deixa opcional o cadastro,
 * usado pelo EmulatorPlayer via EJS_biosUrl quando presente.
 */
export default function PlatformBiosUpload({ platform }) {
  const { user } = useAuth();
  const [bios, setBios] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const systemSupported = Boolean(EJS_SYSTEMS[platform.short_name]);

  useEffect(() => {
    let cancelled = false;
    getBiosForPlatform(platform.id).then((b) => {
      if (!cancelled) {
        setBios(b);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [platform.id]);

  if (!systemSupported || loading) return null;

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await uploadBios({ file, platformId: platform.id, userId: user.id });
      setBios(saved);
    } catch (err) {
      setError(err.message || "Erro ao enviar a BIOS.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!bios) return;
    setSaving(true);
    await deleteRom(bios.id);
    setBios(null);
    setSaving(false);
  };

  return (
    <div className="mt-4 flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3 text-sm">
      <FileCog size={18} className="text-zinc-500 shrink-0" />

      {bios ? (
        <>
          <span className="flex items-center gap-2 text-zinc-300">
            <CheckCircle2 size={14} className="text-green-500" />
            BIOS cadastrada: <span className="font-mono text-zinc-400">{bios.filename}</span>
          </span>
          <button
            onClick={handleRemove}
            disabled={saving}
            className="ml-auto flex items-center gap-1 text-zinc-500 hover:text-red-500 transition disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Remover
          </button>
        </>
      ) : (
        <>
          <span className="text-zinc-500">
            Nenhuma BIOS cadastrada para {platform.name} (opcional para a maioria dos jogos).
          </span>
          <label className="ml-auto flex items-center gap-1 cursor-pointer text-red-500 hover:text-red-400 transition">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
            Enviar BIOS
            <input type="file" onChange={handleUpload} className="hidden" disabled={saving || !user} />
          </label>
        </>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
