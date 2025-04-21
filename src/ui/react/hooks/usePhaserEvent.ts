import { useEffect } from 'react';
import { on } from 'ui/shared/eventBus';
import { useGameState } from './useGameState';

type DebugErrorPayload = { message: string; source: string };

export function usePhaserEvent() {
  const addDebugLog = useGameState.getState().addDebugLog;

  useEffect(() => {
    const off = on('debugError', ({ message, source }: DebugErrorPayload) => {
      addDebugLog(`${source}: ${message}`);
    });

    return () => off();
  }, [addDebugLog]);
}
