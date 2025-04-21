import React, { useRef } from 'react';
import { useGameStatus } from 'ui/react/hooks/useGameState';
import useEmitGameCommand from 'ui/react/hooks/useEmitGameCommand';
import { CSSTransition } from 'react-transition-group';
import styles from './GameStatusOverlay.module.scss';

const GameStatusOverlay: React.FC = () => {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const status = useGameStatus();
  const emit = useEmitGameCommand();

  const show = status !== 'playing';
  const title = status === 'victory' ? 'You Win!' : 'Game Over';

  return (
    <CSSTransition
      nodeRef={nodeRef}
      in={show}
      timeout={300}
      classNames={{
        enter: styles.enter,
        enterActive: styles.enterActive,
        exit: styles.exit,
        exitActive: styles.exitActive,
      }}
      unmountOnExit
    >
      <div ref={nodeRef} className={styles.overlay}>
        <h1>{title}</h1>
        <button type="button" onClick={() => emit({ type: 'restartGame' })}>
          Play Again
        </button>
      </div>
    </CSSTransition>
  );
};

export default GameStatusOverlay;
