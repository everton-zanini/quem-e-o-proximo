import Phaser from 'phaser';
import { gameState, MIN_NPCS_TO_END } from '../systems/GameState';

/**
 * In-canvas HUD: met-NPC counter (top-left) and the "TOQUE PARA CONVERSAR"
 * action button (bottom-right, mirroring the joystick in the bottom-left).
 * Kept in Phaser (not DOM) because it updates every frame.
 */
export class HUD {
  private counterText: Phaser.GameObjects.Text;
  private promptButton: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onInteract: () => void) {
    const { width, height } = scene.scale;

    this.counterText = scene.add
      .text(12, 10, '', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#00000080',
        padding: { x: 8, y: 4 },
      })
      .setScrollFactor(0)
      .setDepth(2000);

    this.promptButton = scene.add
      .text(width - 70, height - 100, '💬\nFALAR', {
        fontFamily: 'monospace',
        fontSize: '13px',
        align: 'center',
        color: '#1c1c28',
        backgroundColor: '#f4d35e',
        padding: { x: 12, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(2000)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this.promptButton.on('pointerdown', onInteract);

    this.refreshCounter();
  }

  refreshCounter(): void {
    const snapshot = gameState.snapshot();
    this.counterText.setText(`Pessoas: ${snapshot.metCount}/${MIN_NPCS_TO_END}`);
  }

  showPrompt(): void {
    this.promptButton.setVisible(true);
  }

  hidePrompt(): void {
    this.promptButton.setVisible(false);
  }

  destroy(): void {
    this.counterText.destroy();
    this.promptButton.destroy();
  }
}
