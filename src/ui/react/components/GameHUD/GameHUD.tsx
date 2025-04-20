import React from 'react';
import {
  useGameState,
  useLives,
  useMoney,
  useWaveNumber,
} from 'ui/react/hooks/useGameState';
import * as Sentry from '@sentry/react';
import styles from './GameHUD.module.scss';
import { createPortal } from 'react-dom';
import StartWaveButton from '../StartWaveButton/StartWaveButton';

/**
 * Displays the current FPS and wave number.
 */
const GameHUD: React.FC = () => {
  const money = useMoney();
  const lives = useLives();
  const waveNumber = useWaveNumber();

  return createPortal(
    <div className="hud">
      <div>💰 {money}</div>
      <div>❤️ {lives}</div>
      <div>🌊 Wave {waveNumber}</div>
      <StartWaveButton />
    </div>,
    document.getElementById('root-ui')!,
  );
};
export default Sentry.withErrorBoundary(GameHUD, {
  fallback: <div>Error loading Game Status</div>,
});
