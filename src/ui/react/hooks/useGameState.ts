import { create } from 'zustand';

interface GameState {
  fps: number;
  waveNumber: number;
  debugLogs: string[];
  setFPS: (fps: number) => void;
  setWaveNumber: (wave: number) => void;
  addDebugLog: (log: string) => void;
  clearDebugLogs: () => void;
}

export const useGameState = create<GameState>((set) => ({
  fps: 0,
  waveNumber: 1,
  debugLogs: [],
  setFPS: (fps) => set({ fps }),
  setWaveNumber: (waveNumber) => set({ waveNumber }),
  addDebugLog: (log) =>
    set((state) => ({ debugLogs: [...state.debugLogs, log] })),
  clearDebugLogs: () => set({ debugLogs: [] }),
}));
