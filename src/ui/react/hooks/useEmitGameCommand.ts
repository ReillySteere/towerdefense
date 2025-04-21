import { useCallback } from 'react';
import { resetGame } from 'ui/engine/initGame';
import { emit } from 'ui/shared/eventBus';

type GameCommand =
  | { type: 'startNextWave' }
  | { type: 'pauseGame' }
  | { type: 'resumeGame' }
  | { type: 'restartGame' }
  | { type: 'debugLog'; source: string; message: string };

export default function useEmitGameCommand() {
  return useCallback((command: GameCommand) => {
    if (command.type === 'debugLog') {
      emit('debugError', { source: command.source, message: command.message });
    } else if (command.type === 'restartGame') {
      resetGame();
    } else {
      emit(command.type, command);
    }
  }, []);
}
