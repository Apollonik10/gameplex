import { enrichAllGames } from '../src/services/enrichment.service.js';

async function run() {
  console.log("Iniciando enriquecimento de dados via APIs...");
  try {
    const results = await enrichAllGames();
    console.log(`Sucesso! Processados ${results.length} jogos.`);
  } catch (error) {
    console.error("Erro durante o enriquecimento:", error);
  }
}

run();
