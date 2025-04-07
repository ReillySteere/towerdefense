import React from 'react';
import styles from './styles.module.scss';
import HealthStatus from './components/HealthStatus';

const App = () => {
  return (
    <div className={styles.container}>
      <div id="phaser-container" className={styles.phaserContainer}></div>
      <div id="root-ui" className={styles.uiOverlay}>
        <HealthStatus />
      </div>
    </div>
  );
};

export default App;
