import { getSupabase } from '@/lib/supabase/client';

const ROMS_BUCKET = 'roms';
const SIGNED_URL_TTL_SECONDS = 120; // curto de propósito: gerado sob demanda ao abrir o emulador

/**
 * Retorna a ROM cadastrada para um jogo (role='rom'), se existir.
 */
export async function getRomForGame(gameId) {
  if (!gameId) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('roms')
    .select('*')
    .eq('game_id', gameId)
    .eq('role', 'rom')
    .maybeSingle();

  if (error) {
    console.error('Erro ao buscar ROM do jogo:', error.message);
    return null;
  }
  return data;
}

/**
 * Retorna a BIOS cadastrada para uma plataforma (role='bios'), se existir.
 */
export async function getBiosForPlatform(platformId) {
  if (!platformId) return null;
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('roms')
    .select('*')
    .eq('platform_id', platformId)
    .eq('role', 'bios')
    .maybeSingle();

  if (error) return null;
  return data;
}

/**
 * Gera uma signed URL de curta duração para uma ROM/BIOS armazenada na nuvem.
 */
export async function getSignedRomUrl(storagePath) {
  const supabase = getSupabase();
  if (!supabase || !storagePath) return null;

  const { data, error } = await supabase.storage
    .from(ROMS_BUCKET)
    .createSignedUrl(storagePath, SIGNED_URL_TTL_SECONDS);

  if (error) {
    console.error('Erro ao gerar signed URL:', error.message);
    return null;
  }
  return data?.signedUrl || null;
}

/**
 * Faz upload de uma ROM pequena (consoles antigos) para o Supabase Storage
 * e registra o metadado na tabela `roms` com storage_type = 'cloud'.
 */
export async function uploadCloudRom({ file, gameId, userId }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  if (!userId) throw new Error('Usuário não autenticado');

  const path = `${userId}/${gameId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(ROMS_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  // Remove registro anterior de ROM (nuvem ou local) para este jogo, se houver
  await supabase.from('roms').delete().eq('game_id', gameId).eq('role', 'rom');

  const { data, error } = await supabase
    .from('roms')
    .insert({
      user_id: userId,
      game_id: gameId,
      role: 'rom',
      storage_type: 'cloud',
      storage_path: path,
      filename: file.name,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Registra apenas o METADADO de uma ROM grande que vive no dispositivo do usuário.
 * Nenhum byte é enviado para o servidor — só nome e tamanho, usados depois para
 * localizar o arquivo quando o usuário reselecionar a pasta local.
 */
export async function registerLocalRom({ file, gameId, userId }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  if (!userId) throw new Error('Usuário não autenticado');

  await supabase.from('roms').delete().eq('game_id', gameId).eq('role', 'rom');

  const { data, error } = await supabase
    .from('roms')
    .insert({
      user_id: userId,
      game_id: gameId,
      role: 'rom',
      storage_type: 'local',
      filename: file.name,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Faz upload de um arquivo de BIOS para uma plataforma. BIOS são sempre
 * pequenos, então vão direto pra nuvem — sem opção "local" aqui.
 */
export async function uploadBios({ file, platformId, userId }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase não configurado');
  if (!userId) throw new Error('Usuário não autenticado');

  const path = `${userId}/bios/${platformId}/${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from(ROMS_BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) throw uploadError;

  await supabase.from('roms').delete().eq('platform_id', platformId).eq('role', 'bios');

  const { data, error } = await supabase
    .from('roms')
    .insert({
      user_id: userId,
      platform_id: platformId,
      role: 'bios',
      storage_type: 'cloud',
      storage_path: path,
      filename: file.name,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteRom(romId) {
  const supabase = getSupabase();
  if (!supabase) return;

  const { data: rom } = await supabase.from('roms').select('*').eq('id', romId).single();
  if (rom?.storage_type === 'cloud' && rom.storage_path) {
    await supabase.storage.from(ROMS_BUCKET).remove([rom.storage_path]);
  }
  await supabase.from('roms').delete().eq('id', romId);
}
