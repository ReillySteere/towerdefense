import Phaser from 'phaser';
import { GameManager, HUDManager } from '../managers';

export class GameScene extends Phaser.Scene {
  #gameManager: GameManager;
  #hudManager: HUDManager;

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

    this.#hudManager = new HUDManager(this);
  }

  update(_time: number, delta: number): void {
    this.#gameManager.update(delta, this.#graphics);
    this.#hudManager.update();
  }
}
