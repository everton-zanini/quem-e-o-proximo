import Phaser from 'phaser';

const LINES = ['🕹️  Use o manche para andar', '💬  Toque em FALAR perto de alguém', '👂 ❤️ 🗣️ ➡️  Escolha o que fazer na conversa'];

export class InstructionsScene extends Phaser.Scene {
  constructor() {
    super('InstructionsScene');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.16, 'COMO JOGAR', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#f4d35e',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height * 0.4, LINES.join('\n\n'), {
        fontFamily: 'monospace',
        fontSize: '15px',
        color: '#f5f5f5',
        align: 'center',
        lineSpacing: 10,
        wordWrap: { width: width - 48 },
      })
      .setOrigin(0.5, 0);

    const continueButton = this.add
      .text(width / 2, height * 0.85, 'CONTINUAR', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#1c1c28',
        backgroundColor: '#f4d35e',
        padding: { x: 22, y: 12 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    continueButton.on('pointerdown', () => this.scene.start('CharacterSelectScene'));
  }
}
