import React from 'react';
import styles from './styles.module.scss';
import PhaserGameWrapper from './components/PhaserGameWrapper';
import GameStatus from './components/GameStatus/GameStatus';
import DebugConsole from './components/DebugConsole/DebugConsole';

const App = () => {
  return (
    <div className={styles.container}>
      <GameStatus />
      <div id="phaser-container" className={styles.phaserContainer}>
        <PhaserGameWrapper />
      </div>
      <DebugConsole />
    </div>
  );
};

export default App;
