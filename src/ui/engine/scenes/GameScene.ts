import Phaser from 'phaser';
import { GameManager } from '../managers';
import { gameState } from 'ui/engine/modules/Game/GameState';
import { useGameState } from 'ui/react/hooks/useGameState';
import { deleteHandlers, on } from 'ui/shared/eventBus';

export type DebugErrorEvent = {
  message: string;
  source: string;
};

export class GameScene extends Phaser.Scene {
  #gameManager: GameManager;
  #graphics: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
    console.log('[Phaser] GameScene constructor called');
  }

  init(): void {
    this.events.once('shutdown', this.shutdown, this);

    on('restartGame', () => {
      this.scene.restart();
      gameState.reset();
      useGameState.getState().reset();
      this.#gameManager = undefined!;
      this.events.removeAllListeners();
      deleteHandlers();
    });
  }

  preload(): void {
    // No assets for now.
  }

  create(): void {
    useGameState.getState().addDebugLog('[GameScene] create() called');
    this.#graphics = this.add.graphics();

    this.#gameManager = new GameManager(this);
    this.#gameManager.create();

    this.cameras.main?.setBackgroundColor('#242424');
  }

  update(_time: number, delta: number): void {
    this.#gameManager.update(delta, this.#graphics);
  }

  shutdown(): void {
    this.#graphics?.destroy();
    this.#graphics = undefined!;
    this.#gameManager = undefined!;
    this.events.removeAllListeners();
    deleteHandlers();
  }
}
