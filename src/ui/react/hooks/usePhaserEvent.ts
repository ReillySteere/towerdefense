import { useEffect } from 'react';
import { on, type Handler } from 'ui/shared/eventBus';
import { useGameState } from './useGameState';

type EventToHandlerMap = {
  moneyUpdate: number;
  livesUpdate: number;
  waveUpdate: number;
  updateFPS: number;
  gameOver: void;
  gameWon: void;
  debugError: { message: string; source: string };
};

/**
 * Automatically binds known Phaser events to Zustand state updates.
 * Auto-unsubscribes on component unmount.
 */
export function usePhaserEvent<K extends keyof EventToHandlerMap>(
  event: K,
): void {
  const set = useGameState.getState();

  useEffect(() => {
    const unsub = on(event, (payload: any) => {
      switch (event) {
        case 'moneyUpdate':
          set.setMoney(payload);
          break;
        case 'livesUpdate':
          set.setLives(payload);
          break;
        case 'waveUpdate':
          set.setWaveNumber(payload);
          break;
        case 'updateFPS':
          set.setFPS(payload);
          break;
        case 'gameOver':
          set.setStatus('gameOver');
          set.addDebugLog(`[usePhaserEvent] Game Over`);
          break;
        case 'gameWon':
          set.setStatus('victory');
          set.addDebugLog(`[usePhaserEvent] Game Won`);
          break;
        case 'debugError':
          set.addDebugLog(`${payload.source}: ${payload.message}`);
          break;
        default:
          console.warn(`[usePhaserEvent] Unhandled event: ${event}`);
      }
    });

    return unsub;
  }, [event, set]);
}
