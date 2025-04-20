import React from 'react';
import { createPortal } from 'react-dom';
import { useGameStatus } from 'ui/react/hooks/useGameState';
import styles from './GameStatusOverlay.module.scss';

const GameStatusOverlay: React.FC = () => {
  const status = useGameStatus();
  if (status === 'playing') return null;

  const message = status === 'victory' ? 'You Win!' : 'Game Over';

  return createPortal(
    <div className={styles.overlay}>
      <h1>{message}</h1>
      {/* restart button placeholder */}
    </div>,
    document.getElementById('root')!,
  );
};

export default GameStatusOverlay;
