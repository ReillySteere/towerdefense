import Phaser from 'phaser';
import { GameManager } from '../managers';

export class GameScene extends Phaser.Scene {
  #gameManager: GameManager;
  #graphics: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // No assets for now.
  }

  create(): void {
    this.#gameManager = new GameManager(this);
    this.#gameManager.create();
    this.#graphics = this.add.graphics();

    this.cameras.main.setBackgroundColor('#242424');
  }

  update(_time: number, delta: number): void {
    this.#gameManager.update(delta, this.#graphics);
    const fps = Math.round(1000 / delta);
    this.events.emit('updateFPS', fps);
  }
}
