import React from 'react';
import { useQuery } from '@tanstack/react-query';
import styles from './styles.module.scss';
import { useGameStore } from './store';
import fetchHealth from 'ui/api/fetchHealth';

const App = () => {
  const { score, incrementScore } = useGameStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  });

  return (
    <div className={styles.container}>
      <div id="phaser-container" className={styles.phaserContainer}></div>
      <div id="root-ui" className={styles.uiOverlay}>
        <h1>React UI Overlay</h1>
        <button onClick={incrementScore}>Increment Score</button>
        <p>
          {isLoading ? (
            <span>'Loading health...'</span>
          ) : error ? (
            <span>'Error fetching health'</span>
          ) : (
            <span>{JSON.stringify(data)}</span>
          )}
        </p>
      </div>
      <p>Score: {score}</p>
    </div>
  );
};

export default App;
