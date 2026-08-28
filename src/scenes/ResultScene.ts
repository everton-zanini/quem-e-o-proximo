import Phaser from 'phaser';
import type { GameStateSnapshot } from '../types/GameStateTypes';
import { BIBLE_REFERENCE, CLOSING_WORD, REFLECTION_LINES } from '../data/reflections';
import { AudioManager, SFX, LOOPS } from '../systems/AudioManager';
import { playerProfile } from '../systems/PlayerProfile';

const LINE_HOLD_MS = 3600;
const ENDING_THEME_VOLUME = 0.4;

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create(snapshot: GameStateSnapshot): void {
    const { width, height } = this.scale;
    const audio = new AudioManager(this);
    audio.play(SFX.Complete);
    audio.startLoop(LOOPS.EndingTheme, ENDING_THEME_VOLUME);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => audio.stopLoop(LOOPS.EndingTheme));

    this.cameras.main.setBackgroundColor('#0b0b12');

    this.add
      .text(width / 2, 30, 'MISSÃO CONCLUÍDA', {
        fontFamily: 'monospace',
        fontSize: '17px',
        color: '#f4d35e',
        fontStyle: 'bold',
      })
      .setOrigin(0.5, 0);

    this.add
      .text(width / 2, 54, `Parabéns, ${playerProfile.name}!`, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#f5f5f5',
      })
      .setOrigin(0.5, 0);

    const stats = [
      `Pessoas encontradas: ${snapshot.metCount}`,
      `Pessoas ouvidas: ${snapshot.listenedCount}`,
      `Pessoas ajudadas: ${snapshot.helpedCount}`,
      `Esperança compartilhada: ${snapshot.sharedHopeCount}`,
      `Pessoas ignoradas: ${snapshot.ignoredCount}`,
    ];

    this.add
      .text(width / 2, 96, stats.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '13px',
        color: '#f5f5f5',
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5, 0);

    const reflectionText = this.add
      .text(width / 2, 270, '', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f5f5f5',
        align: 'center',
        wordWrap: { width: width - 48 },
      })
      .setOrigin(0.5, 0)
      .setAlpha(0);

    const verseText = this.add
      .text(width / 2, height - 160, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#adb5bd',
        align: 'center',
        wordWrap: { width: width - 48 },
        fontStyle: 'italic',
        lineSpacing: 6,
      })
      .setOrigin(0.5, 0)
      .setAlpha(0);

    const replayButton = this.add
      .text(width / 2, height - 40, 'JOGAR NOVAMENTE', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#1c1c28',
        backgroundColor: '#f4d35e',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setInteractive({ useHandCursor: true });

    replayButton.on('pointerdown', () => this.scene.start('InstructionsScene'));

    const continueButton = this.add
      .text(width / 2, height - 40, 'CONTINUAR', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#1c1c28',
        backgroundColor: '#f4d35e',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    continueButton.on('pointerdown', () => {
      continueButton.destroy();
      this.playReflectionSequence(reflectionText, verseText, replayButton);
    });
  }

  private playReflectionSequence(
    reflectionText: Phaser.GameObjects.Text,
    verseText: Phaser.GameObjects.Text,
    replayButton: Phaser.GameObjects.Text,
  ): void {
    let index = 0;

    const showNextLine = (): void => {
      if (index >= REFLECTION_LINES.length) {
        this.revealClosing(verseText, replayButton);
        return;
      }

      reflectionText.setAlpha(0).setText(REFLECTION_LINES[index]);
      this.tweens.add({ targets: reflectionText, alpha: 1, duration: 400 });
      index += 1;
      this.time.delayedCall(LINE_HOLD_MS, showNextLine);
    };

    showNextLine();
  }

  private revealClosing(verseText: Phaser.GameObjects.Text, replayButton: Phaser.GameObjects.Text): void {
    verseText.setText(`${CLOSING_WORD}\n\n"${BIBLE_REFERENCE.text}"\n${BIBLE_REFERENCE.citation}`);
    this.tweens.add({ targets: verseText, alpha: 1, duration: 500 });
    this.tweens.add({ targets: replayButton, alpha: 1, duration: 500, delay: 300 });
  }
}
