/**
 * rom-folder.js — Gerencia acesso à pasta de ROMs do usuário.
 *
 * Usa a File System Access API (showDirectoryPicker) + IndexedDB para
 * persistir o handle do diretório entre sessões. Na primeira vez pede
 * permissão; nas próximas, tenta reusar o handle gravado.
 *
 * Suporte: Chrome/Edge 86+, Opera 72+. Firefox/Safari não suportam.
 */

const DB_NAME = 'gameplex-roms';
const STORE_NAME = 'handles';
const HANDLE_KEY = 'rom-directory';

function isSupported() {
  return typeof window !== 'undefined' && 'showDirectoryPicker' in window;
}

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE_NAME);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveHandle(handle) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadHandle() {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const req = tx.objectStore(STORE_NAME).get(HANDLE_KEY);
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Pede ao usuário para escolher uma pasta de ROMs e salva o handle.
 * Retorna o FileSystemDirectoryHandle ou null se cancelado.
 */
export async function pickRomFolder() {
  if (!isSupported()) return null;
  try {
    const handle = await window.showDirectoryPicker({ mode: 'read' });
    await saveHandle(handle);
    return handle;
  } catch {
    // Usuário cancelou
    return null;
  }
}

/**
 * Tenta recuperar o handle salvo. Retorna null se não existir
 * ou se a permissão foi revogada.
 */
export async function getSavedFolder() {
  if (!isSupported()) return null;
  try {
    const handle = await loadHandle();
    if (!handle) return null;
    // Verifica se ainda temos permissão
    const perm = await handle.queryPermission({ mode: 'read' });
    if (perm === 'granted') return handle;
    // Tenta pedir permissão novamente
    const req = await handle.requestPermission({ mode: 'read' });
    return req === 'granted' ? handle : null;
  } catch {
    return null;
  }
}

/**
 * Dado um diretório e um jogo, tenta encontrar a ROM pelo nome/slug.
 * Busca por arquivos cujo nome contenha o título ou slug do jogo
 * (case-insensitive) e que tenham extensão válida.
 */
export async function findRomInFolder(dirHandle, game) {
  const extensions = [
    '.zip', '.sfc', '.smc', '.nes', '.gb', '.gbc', '.gba',
    '.n64', '.z64', '.v64', '.nds', '.gen', '.md', '.sms',
    '.gg', '.iso', '.cso', '.pbp', '.bin', '.cue', '.a26', '.rom',
  ];

  const searchTerms = [
    game.slug?.toLowerCase(),
    game.title?.toLowerCase(),
  ].filter(Boolean);

  const candidates = [];

  try {
    for await (const [name, entry] of dirHandle) {
      if (entry.kind !== 'file') continue;
      const lower = name.toLowerCase();
      const hasValidExt = extensions.some((ext) => lower.endsWith(ext));
      if (!hasValidExt) continue;

      const matches = searchTerms.some((term) => lower.includes(term));
      if (matches) {
        candidates.push({ name, entry });
      }
    }
  } catch {
    return null;
  }

  if (candidates.length === 0) return null;

  // Prioriza .zip > extensões específicas > .bin/.cue
  candidates.sort((a, b) => {
    const pri = { '.zip': 0, '.sfc': 1, '.smc': 1, '.nes': 1, '.gba': 1, '.gb': 1, '.gbc': 1, '.n64': 1, '.z64': 1, '.gen': 1, '.md': 1 };
    const pa = pri[a.name.slice(a.name.lastIndexOf('.'))] ?? 5;
    const pb = pri[b.name.slice(b.name.lastIndexOf('.'))] ?? 5;
    return pa - pb;
  });

  const file = await candidates[0].entry.getFile();
  return file;
}

/**
 * Ver se a File System Access API é suportada no browser.
 */
export { isSupported };
