import React from 'react';
import styles from './styles.module.scss';
import HealthStatus from './components/HealthStatus';
import PhaserGameWrapper from './components/PhaserGameWrapper';

const App = () => {
  return (
    <div className={styles.container}>
      <div id="phaser-container" className={styles.phaserContainer}>
        <PhaserGameWrapper />
      </div>
      <div id="root-ui" className={styles.uiOverlay}>
        <HealthStatus />
      </div>
    </div>
  );
};

export default App;
