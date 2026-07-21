"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Permite ao usuário reselecionar a pasta onde guarda suas ROMs no dispositivo
 * e localizar automaticamente o arquivo pelo nome registrado no banco.
 *
 * Usa <input type="file" webkitdirectory> em vez de showDirectoryPicker()
 * porque este último não tem suporte em navegadores mobile (Chrome/Firefox Android).
 * Isso significa que a pasta precisa ser reselecionada a cada sessão de jogo —
 * é a troca consciente entre simplicidade/compatibilidade e conveniência.
 */
export function useLocalRom() {
  const inputRef = useRef(null);
  const resolverRef = useRef(null);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState(null);

  const ensureInput = useCallback(() => {
    if (inputRef.current) return inputRef.current;

    const input = document.createElement("input");
    input.type = "file";
    input.webkitdirectory = true;
    input.multiple = true;
    input.style.display = "none";

    input.addEventListener("change", (e) => {
      const files = Array.from(e.target.files || []);
      setPicking(false);
      resolverRef.current?.(files);
      resolverRef.current = null;
    });

    document.body.appendChild(input);
    inputRef.current = input;
    return input;
  }, []);

  /**
   * Abre o seletor de pasta e retorna o File cujo nome bate com `filename`
   * (comparação case-insensitive). Retorna null se não encontrar ou se o
   * usuário cancelar.
   */
  const pickAndFindFile = useCallback(
    (filename) => {
      setError(null);
      setPicking(true);
      const input = ensureInput();

      return new Promise((resolve) => {
        resolverRef.current = (files) => {
          if (!files.length) {
            resolve(null);
            return;
          }
          const match = files.find(
            (f) => f.name.toLowerCase() === filename.toLowerCase()
          );
          if (!match) {
            setError(
              `Arquivo "${filename}" não encontrado na pasta selecionada.`
            );
            resolve(null);
            return;
          }
          resolve(match);
        };
        input.click();
      });
    },
    [ensureInput]
  );

  return { pickAndFindFile, picking, error };
}
