import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from 'ui/engine/scenes';
import { useGameState } from 'ui/react/hooks/useGameState';

export type DebugErrorEvent = {
  message: string;
  source: string;
};
/**
 * Initializes the Phaser game and wires up Phaser events to update the React state.
 */
const PhaserGameWrapper: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (gameContainerRef.current) {
      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: gameContainerRef.current,
        scene: [GameScene],
      };

      // Create the Phaser game instance
      gameRef.current = new Phaser.Game(config);

      // Once the scene is available, set up event listeners
      // Delay is used here to ensure the scene has been created.
      const setupSceneEvents = () => {
        const scene = gameRef.current?.scene.getScene('GameScene');
        if (scene) {
          // TODO: Workaround for strict-mode that I don't feel like sorting out right now
          scene.events.removeAllListeners('updateFPS');
          scene.events.removeAllListeners('waveUpdate');
          scene.events.removeAllListeners('debugError');

          // Listen for FPS update events
          scene.events.on('updateFPS', (fps: number) => {
            useGameState.getState().setFPS(fps);
          });
          // Listen for wave update events
          scene.events.on('waveUpdate', (wave: number) => {
            useGameState.getState().setWaveNumber(wave);
          });
          // Listen for debug log events
          scene.events.on(
            'debugError',
            ({ source, message }: DebugErrorEvent) => {
              useGameState.getState().addDebugLog(`${source}: ${message}`);
            },
          );
        }
      };

      // A simple timeout to allow the scene to initialize.
      setTimeout(setupSceneEvents, 1000);

      // Cleanup on unmount
      return () => {
        if (gameRef.current) {
          gameRef.current.destroy(true);
          gameRef.current = null;
        }
      };
    }
  }, []);

  return <div ref={gameContainerRef} id="phaser-game-container" />;
};

export default PhaserGameWrapper;
