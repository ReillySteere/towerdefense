import React, { useEffect } from 'react';
import { useRawDebugLogs, useGameState } from 'ui/react/hooks/useGameState';
import styles from './DebugConsole.module.scss';
import { usePhaserEvent } from 'ui/react/hooks/usePhaserEvent';

const DebugConsole: React.FC = () => {
  usePhaserEvent();
  const debugLogs = useRawDebugLogs();
  const removeLog = useGameState((s) => s.removeDebugLog);

  useEffect(() => {
    const timers = debugLogs.map((log) =>
      setTimeout(() => removeLog(log.id), 2000),
    );

    return () => timers.forEach(clearTimeout);
  }, [debugLogs, removeLog]);

  return (
    <div className={styles.debugConsole}>
      <h4>Debug Logs:</h4>
      <ul>
        {debugLogs.map((log) => (
          <li key={log.id}>{log.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default DebugConsole;
