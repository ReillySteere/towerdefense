import { create } from 'zustand';
import {
  gameState,
  type GameStateSnapshot,
} from 'ui/engine/modules/Game/GameState';

interface GameStateProps {
  money: number;
  lives: number;
  waveNumber: number;
  status: 'playing' | 'gameOver' | 'victory';
  debugLogs: { id: number; message: string }[];
}

interface GameStateActions {
  setFromSnapshot: (snap: GameStateSnapshot) => void;
  setWaveNumber: (wave: number) => void;
  addDebugLog: (log: string) => void;
  removeDebugLog: (id: number) => void;
  reset: () => void;
  clearDebugLogs: () => void;
}

type GameState = GameStateProps & GameStateActions;

let logIdCounter = 0;
let rafHandle: number | null = null;

export const useGameState = create<GameState>((set) => ({
  money: gameState.money,
  lives: gameState.lives,
  waveNumber: gameState.wave,
  status: gameState.status,
  debugLogs: [],

  setFromSnapshot: (snap) => {
    if (rafHandle !== null) cancelAnimationFrame(rafHandle);

    rafHandle = requestAnimationFrame(() => {
      set({
        money: snap.money,
        lives: snap.lives,
        waveNumber: snap.wave,
        status: snap.status,
      });
    });
  },

  setWaveNumber: (waveNumber) => set({ waveNumber }),

  addDebugLog: (message) =>
    set((state) => ({
      debugLogs: [...state.debugLogs, { id: logIdCounter++, message }],
    })),

  removeDebugLog: (id) =>
    set((state) => ({
      debugLogs: state.debugLogs.filter((log) => log.id !== id),
    })),

  reset: () => {
    const snap = gameState.getSnapshot(); // sync with GameState singleton
    set({
      money: snap.money,
      lives: snap.lives,
      waveNumber: snap.wave,
      status: snap.status,
      debugLogs: [],
    });
  },

  clearDebugLogs: () => set({ debugLogs: [] }),
}));

export const useMoney = () => useGameState((s) => s.money);
export const useLives = () => useGameState((s) => s.lives);
export const useWaveNumber = () => useGameState((s) => s.waveNumber);
export const useGameStatus = () => useGameState((s) => s.status);
export const useDebugLogs = () =>
  useGameState((s) => s.debugLogs.map((log) => log.message));
export const useRawDebugLogs = () => useGameState((s) => s.debugLogs);
export const useResetGameState = () => useGameState((s) => s.reset);
