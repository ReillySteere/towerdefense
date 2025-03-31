import styles from './styles.module.scss';
import './phaserGame';

import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div className={styles.container}>
      <div id="phaser-container" className={styles.phaserContainer}></div>
      <div id="root-ui" className={styles.uiOverlay}>
        <h1>React UI Overlay</h1>
        {/* Additional UI components */}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
