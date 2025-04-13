import Phaser from 'phaser';
import { EventBus } from '../events/EventBus';

class HUDManager {
  #errors: string[] = [];
  private scene: Phaser.Scene;
  private debugText: Phaser.GameObjects.Text;

  /**
   * Creates an instance of HUDManager. - Subscribes to the debugError
   * @param scene The Phaser.Scene where the HUD is rendered.
   */
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.initializeHUD();

    EventBus.getInstance().subscribe('debugError', ({ message, source }) => {
      const errorText = `${source}: ${message}`;
      this.#errors.push(errorText);

      // Automatically remove this error after 2 seconds.
      setTimeout(() => {
        const index = this.#errors.indexOf(errorText);
        if (index > -1) {
          this.#errors.splice(index, 1);
        }
      }, 2000);
    });
  }

  /**
   * Initializes the debug text object.
   */
  private initializeHUD(): void {
    this.debugText = this.scene.add.text(10, 10, '', {
      fontSize: '16px',
      color: '#ffffff',
    });
  }

  /**
   * Gathers debug information from various managers and updates the debug text display.
   */
  public update(): void {
    let debugInfo = '';

    this.#errors.forEach((error) => {
      debugInfo += `${error}\n`;
    });

    this.debugText.setText(debugInfo);
  }
}

export default HUDManager;
