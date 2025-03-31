import Phaser from 'phaser';

// Define a simple scene that sets a background color.
class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    // Preload assets here if needed in the future.
  }

  create() {
    // Set a background color so we can see the canvas.
    this.cameras.main.setBackgroundColor('#24252A');
  }
}

// Phaser game configuration.
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO, // Auto-detects WebGL or Canvas rendering.
  width: 800, // Game width
  height: 600, // Game height
  scene: MainScene, // The scene to load.
  parent: 'phaser-container', // Optional: attach the canvas to a specific element.
};

// Create a new Phaser game instance.
const game = new Phaser.Game(config);

export default game;
