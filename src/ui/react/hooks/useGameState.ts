import { create } from 'zustand';

interface GameState {
  money: number;
  lives: number;
  fps: number;
  status: 'playing' | 'gameOver' | 'victory';
  waveNumber: number;
  debugLogs: string[];
  setFPS: (fps: number) => void;
  setWaveNumber: (wave: number) => void;
  addDebugLog: (log: string) => void;
  clearDebugLogs: () => void;
  setMoney: (money: number) => void;
  setLives: (lives: number) => void;
  setStatus: (s: GameState['status']) => void;
}

export const useGameState = create<GameState>((set) => ({
  money: 15,
  lives: 50,
  fps: 0,
  waveNumber: 0,
  debugLogs: [],
  status: 'playing',
  setFPS: (fps) => set({ fps }),
  setWaveNumber: (waveNumber) => set({ waveNumber }),
  addDebugLog: (log) =>
    set((state) => ({ debugLogs: [...state.debugLogs, log] })),
  clearDebugLogs: () => set({ debugLogs: [] }),
  setMoney: (money) => set({ money }),
  setLives: (lives) => set({ lives }),
  setStatus: (status) => set({ status }),
}));

export const useMoney = () => useGameState((s) => s.money);
export const useLives = () => useGameState((s) => s.lives);
export const useWaveNumber = () => useGameState((s) => s.waveNumber);
export const useGameStatus = () => useGameState((s) => s.status);
