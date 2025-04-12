import React, { useEffect } from 'react';
import Phaser from 'phaser';
import { GameScene } from 'ui/engine/scenes';

const PhaserGameWrapper: React.FC = () => {
  useEffect(() => {
    // Phaser configuration object
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: 'phaser-container', // This anchors the game to the div with id "phaser-container"
      width: 800,
      height: 600,
      scene: [GameScene],
    };

    // Instantiate Phaser game
    const game = new Phaser.Game(config);

    // Cleanup: Destroy the game instance when the component unmounts.
    return () => {
      game.destroy(true);
    };
  }, []);

  return null;
};

export default PhaserGameWrapper;
