import Phaser from 'phaser';
import { CHARACTER_OPTIONS } from '../data/characters';
import type { CharacterOption } from '../data/characters';
import { getCharsetFrames } from '../systems/CharsetFrames';
import { playerProfile } from '../systems/PlayerProfile';
import { gameState } from '../systems/GameState';

const PORTRAIT_SCALE = 4;

export class CharacterSelectScene extends Phaser.Scene {
  private selected: CharacterOption = playerProfile.character;
  private highlight!: Phaser.GameObjects.Graphics;
  private portraitPositions = new Map<string, { x: number; y: number }>();
  private nameInput!: HTMLInputElement;
  private root!: HTMLDivElement;

  constructor() {
    super('CharacterSelectScene');
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height * 0.14, 'QUEM É VOCÊ?', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#f4d35e',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.highlight = this.add.graphics();

    const spacing = width * 0.28;
    const centerY = height * 0.34;

    CHARACTER_OPTIONS.forEach((character, index) => {
      const x = width / 2 + (index === 0 ? -spacing : spacing);
      this.portraitPositions.set(character.id, { x, y: centerY });

      const frames = getCharsetFrames(character.block, character.group);
      const sprite = this.add
        .sprite(x, centerY, character.textureKey, frames.idle)
        .setScale(PORTRAIT_SCALE)
        .setInteractive({ useHandCursor: true });

      sprite.on('pointerdown', () => this.selectCharacter(character));

      this.add
        .text(x, centerY + 60, character.label, {
          fontFamily: 'monospace',
          fontSize: '13px',
          color: '#f5f5f5',
        })
        .setOrigin(0.5);
    });

    this.drawHighlight();
    this.createNameOverlay();

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
  }

  private selectCharacter(character: CharacterOption): void {
    this.selected = character;
    this.drawHighlight();
  }

  private drawHighlight(): void {
    const pos = this.portraitPositions.get(this.selected.id);
    if (!pos) return;

    this.highlight.clear();
    this.highlight.lineStyle(3, 0xf4d35e, 1);
    this.highlight.strokeRect(pos.x - 34, pos.y - 44, 68, 88);
  }

  private createNameOverlay(): void {
    this.root = document.createElement('div');
    this.root.className = 'select-overlay is-visible';

    const box = document.createElement('div');
    box.className = 'select-box';

    const label = document.createElement('p');
    label.className = 'select-name-label';
    label.textContent = 'Seu nome';

    this.nameInput = document.createElement('input');
    this.nameInput.className = 'select-name-input';
    this.nameInput.type = 'text';
    this.nameInput.maxLength = 16;
    this.nameInput.placeholder = 'Jogador(a)';
    this.nameInput.value = playerProfile.name === 'Jogador(a)' ? '' : playerProfile.name;

    const startButton = document.createElement('button');
    startButton.type = 'button';
    startButton.className = 'select-start-button';
    startButton.textContent = 'COMEÇAR';
    startButton.addEventListener('click', () => this.handleStart());

    box.append(label, this.nameInput, startButton);
    this.root.append(box);
    document.body.append(this.root);
  }

  private handleStart(): void {
    playerProfile.setName(this.nameInput.value);
    playerProfile.setCharacter(this.selected);
    gameState.reset();
    this.scene.start('GameScene');
  }

  private handleShutdown(): void {
    this.root.remove();
  }
}
