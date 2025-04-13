import React from 'react';
import { useGameState } from 'ui/react/hooks/useGameState';
import * as Sentry from '@sentry/react';
import styles from './DebugConsole.module.scss';

/**
 * Displays debug log messages.
 */
const DebugConsole: React.FC = () => {
  const debugLogs = useGameState((state) => state.debugLogs);

  return (
    <div className={styles.debugConsole}>
      <h4>Debug Logs:</h4>
      <ul>
        {debugLogs.map((log, idx) => (
          <li key={idx}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default Sentry.withErrorBoundary(DebugConsole, {
  fallback: <div>Error loading Debug Console</div>,
});
