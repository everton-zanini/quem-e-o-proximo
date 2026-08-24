import Phaser from 'phaser';
import { AudioManager, LOOPS } from '../systems/AudioManager';

const MENU_THEME_VOLUME = 0.4;

export class MenuScene extends Phaser.Scene {
  private audio!: AudioManager;

  constructor() {
    super('MenuScene');
  }

  create(): void {
    this.audio = new AudioManager(this);
    this.audio.startLoop(LOOPS.MenuTheme, MENU_THEME_VOLUME);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.audio.stopLoop(LOOPS.MenuTheme));

    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.26, 'QUEM É O\nPRÓXIMO?', {
        fontFamily: 'monospace',
        fontSize: '30px',
        color: '#f4d35e',
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.45, 'Explore a cidade.\nEncontre pessoas.\nEscolha o que fazer.', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f5f5f5',
        align: 'center',
        lineSpacing: 6,
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(width / 2, height * 0.66, 'JOGAR', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#1c1c28',
        backgroundColor: '#f4d35e',
        padding: { x: 26, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playButton.on('pointerdown', () => {
      this.scene.start('InstructionsScene');
    });

    this.add
      .text(width / 2, height * 0.85, 'Toque no botão para começar', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#adb5bd',
      })
      .setOrigin(0.5);
  }
}
