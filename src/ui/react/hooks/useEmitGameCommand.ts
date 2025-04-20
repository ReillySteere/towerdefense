import { useCallback } from 'react';
import { emit } from 'ui/shared/eventBus';

type GameCommand =
  | { type: 'startNextWave' }
  | { type: 'pauseGame' }
  | { type: 'resumeGame' }
  | { type: 'restartGame' };

export default function useEmitGameCommand() {
  return useCallback((command: GameCommand) => {
    emit(command.type, command);
  }, []);
}
