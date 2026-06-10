import { create } from "zustand";

export const useGameStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  isSearchVisible: false,
  setSearchVisible: (visible) => set({ isSearchVisible: visible }),
}));
