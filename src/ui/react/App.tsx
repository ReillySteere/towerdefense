import React from 'react';
import { createPortal } from 'react-dom';
import styles from './styles.module.scss';
import PhaserGameWrapper from './components/PhaserGameWrapper';
import GameHUD from './components/GameHUD/GameHUD';
import DebugConsole from './components/DebugConsole/DebugConsole';
import GameStatusOverlay from './components/GameHUD/GameStatusOverlay';

const App = () => {
  return (
    <div className={styles.container}>
      <GameHUD />
      <GameStatusOverlay />
      <div id="phaser-container" className={styles.phaserContainer}>
        <PhaserGameWrapper />
      </div>
      <DebugConsole />
    </div>
  );
};

export default App;
