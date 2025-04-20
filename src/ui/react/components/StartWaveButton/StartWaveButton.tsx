import React, { useCallback } from 'react';
import useEmitGameCommand from 'ui/react/hooks/useEmitGameCommand';

const StartWaveButton: React.FC = () => {
  const emitCommand = useEmitGameCommand();
  const handleClick = useCallback(() => {
    emitCommand({ type: 'startNextWave' });
  }, []);

  return (
    <button type="button" className="start-wave-btn" onClick={handleClick}>
      Start&nbsp;Next&nbsp;Wave
    </button>
  );
};

export default StartWaveButton;
