import React from 'react';
import { emit } from 'shared/eventBus';

const StartWaveButton: React.FC = () => {
  return (
    <button
      type="button"
      className="start-wave-btn"
      onClick={() => emit('startNextWave')}
    >
      Start&nbsp;Next&nbsp;Wave
    </button>
  );
};

export default StartWaveButton;
