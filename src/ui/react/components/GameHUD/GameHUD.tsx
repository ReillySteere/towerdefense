import React from 'react';
import StartWaveButton from '../StartWaveButton/StartWaveButton';
import { useLives, useMoney, useWaveNumber } from 'ui/react/hooks/useGameState';
import styles from './GameHUD.module.scss';

const GameHUD: React.FC = () => {
  const money = useMoney();
  const lives = useLives();
  const wave = useWaveNumber();

  return (
    <div className={styles.container}>
      <span className={styles.entry}>💰 {money}</span>
      <span className={styles.entry}>❤️ {lives}</span>
      {wave > 0 && <span className={styles.entry}>🌊 Wave {wave}</span>}

      <StartWaveButton />
    </div>
  );
};

export default GameHUD;
