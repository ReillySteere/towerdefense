import React from 'react';
import { useGameState } from 'ui/react/hooks/useGameState';
import * as Sentry from '@sentry/react';
import styles from './GameStatus.module.scss';

/**
 * Displays the current FPS and wave number.
 */
const GameStatus: React.FC = () => {
  const fps = useGameState((state) => state.fps);
  const waveNumber = useGameState((state) => state.waveNumber);

  return (
    <div className={styles.gameStatus}>
      <span>FPS: {fps}</span>
      <span>Wave: {waveNumber}</span>
    </div>
  );
};

export default Sentry.withErrorBoundary(GameStatus, {
  fallback: <div>Error loading Game Status</div>,
});
