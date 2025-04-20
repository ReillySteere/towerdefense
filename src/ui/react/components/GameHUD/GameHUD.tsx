import React, { useState } from 'react';
import * as Sentry from '@sentry/react';
import styles from './GameHUD.module.scss';
import StartWaveButton from '../StartWaveButton/StartWaveButton';
import { usePhaserEvent } from 'ui/react/hooks/usePhaserEvent';
import { useLives, useMoney, useWaveNumber } from 'ui/react/hooks/useGameState';

/**
 * Displays the current FPS and wave number.
 */
const GameHUD: React.FC = () => {
  usePhaserEvent('moneyUpdate');
  usePhaserEvent('livesUpdate');
  usePhaserEvent('waveUpdate');

  const money = useMoney();
  const lives = useLives();
  const wave = useWaveNumber();

  return (
    <div className="hud">
      <div>💰 {money}</div>
      <div>❤️ {lives}</div>
      <div>🌊 Wave {wave}</div>
      <StartWaveButton />
    </div>
  );
};

export default Sentry.withErrorBoundary(GameHUD, {
  fallback: <div>Error loading Game Status</div>,
});
