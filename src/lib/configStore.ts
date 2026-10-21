import { DESIGNS, defaultConfig, type CardConfig } from "@/data/designs";
import { KEYS, useLocal } from "./storage";

export interface SavedDesign { id: string; config: CardConfig; savedAt: number }

export const useCurrentConfig = () => useLocal<CardConfig>(KEYS.current, defaultConfig(DESIGNS[0]!));
export const useFavorites = () => useLocal<string[]>(KEYS.favorites, []);
export const useSaved = () => useLocal<SavedDesign[]>(KEYS.saved, []);
