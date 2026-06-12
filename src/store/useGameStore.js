// src/store/useGameStore.js
import { create } from "zustand";

export const useGameStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  isSearchVisible: false,
  setSearchVisible: (visible) => set({ isSearchVisible: visible }),

  // ✅ NOVO: filtros de plataforma e gênero
  selectedPlatform: null,
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  
  selectedGenre: null,
  setSelectedGenre: (genre) => set({ selectedGenre: genre }),
  
  clearFilters: () => set({ selectedPlatform: null, selectedGenre: null, searchQuery: "" }),
}));
