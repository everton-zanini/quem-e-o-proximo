import Phaser from 'phaser';
import { generatePlaceholderTextures } from '../systems/TextureFactory';
import { SFX, LOOPS } from '../systems/AudioManager';

const MIN_LOADING_BAR_MS = 900;
const BAR_WIDTH = 220;
const BAR_HEIGHT = 20;

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload(): void {
    // A missing file here only logs a "loaderror" and is skipped — it does not
    // crash the scene. Drop matching files into public/assets/... and they
    // start being used automatically, no other code changes needed.
    this.load.on('loaderror', (file: Phaser.Loader.File) => {
      console.warn(`[Preload] asset not found yet, using placeholder: ${file.key}`);
    });

    // RPG Maker-style charsets: 12-col grid (4 characters x 3 walk frames,
    // rows down/left/right/up). Cell size differs per sheet — Player.ts and
    // NPC.ts scale whichever frame they get to a consistent on-screen size.
    // See data/characters.ts (player) and data/npcs.ts (NPCs) for which
    // character uses which sheet/block/group.
    this.load.spritesheet('character_1_8', 'assets/sprites/character_1-8.png', {
      frameWidth: 16,
      frameHeight: 20,
    });
    this.load.spritesheet('character_9_16', 'assets/sprites/character_9-16.png', {
      frameWidth: 16,
      frameHeight: 20,
    });

    // Large generic scenery tileset — only two hand-picked spots are used
    // (a clean grass patch and a clean sandy/dirt patch), defined as named
    // frames in create() once the image is loaded. See MapBuilder.ts.
    this.load.image('scenery', 'assets/sprites/output_tileset.png');

    this.load.audio(SFX.Interact, 'assets/audio/interact.mp3');
    this.load.audio(SFX.Choice, 'assets/audio/choice.mp3');
    this.load.audio(SFX.Complete, 'assets/audio/complete.mp3');

    this.load.audio(LOOPS.Music, 'assets/audio/musica.mp3');
    this.load.audio(LOOPS.Birds, 'assets/audio/passaros.wav');
    this.load.audio(LOOPS.Dialogue, 'assets/audio/dialogo.mp3');
    this.load.audio(LOOPS.MenuTheme, 'assets/audio/menu.wav');
    this.load.audio(LOOPS.EndingTheme, 'assets/audio/encerramento.wav');
  }

  create(): void {
    generatePlaceholderTextures(this);
    this.defineSceneryFrames();
    this.showLoadingBar();
  }

  /** Skipped when output_tileset.png hasn't loaded — MapBuilder falls back to flat colors. */
  private defineSceneryFrames(): void {
    if (!this.textures.exists('scenery')) return;

    const texture = this.textures.get('scenery');
    // Pixel rects picked by inspection: a seamless-looking flat grass patch
    // and a seamless-looking flat sandy/dirt patch, each well inside a
    // larger uniform area of the sheet (no autotile edges/seams cut into it).
    if (!texture.has('grass')) texture.add('grass', 0, 28, 30, 24, 24);
    if (!texture.has('dirt')) texture.add('dirt', 0, 120, 600, 20, 20);
    if (!texture.has('tree')) texture.add('tree', 0, 20, 560, 60, 100);
    if (!texture.has('house_green')) texture.add('house_green', 0, 648, 367, 44, 76);
    if (!texture.has('house_orange')) texture.add('house_orange', 0, 648, 539, 44, 76);
    if (!texture.has('house_red')) texture.add('house_red', 0, 648, 711, 44, 76);
  }

  /**
   * Purely cosmetic 8-bit style loading bar. Assets here load almost
   * instantly (small local files), so this fills over a fixed short
   * duration rather than tracking real byte progress — otherwise it would
   * just flash and never be seen.
   */
  private showLoadingBar(): void {
    const { width, height } = this.scale;
    const barX = width / 2 - BAR_WIDTH / 2;
    const barY = height / 2 - BAR_HEIGHT / 2;

    this.add
      .text(width / 2, barY - 28, 'CARREGANDO...', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#f5f5f5',
      })
      .setOrigin(0.5);

    const border = this.add.graphics();
    border.lineStyle(3, 0xf4d35e, 1);
    border.strokeRect(barX, barY, BAR_WIDTH, BAR_HEIGHT);

    const fill = this.add.graphics();

    this.tweens.addCounter({
      from: 0,
      to: 100,
      duration: MIN_LOADING_BAR_MS,
      onUpdate: (tween: Phaser.Tweens.Tween) => {
        const value = tween.getValue() ?? 0;
        const innerWidth = (BAR_WIDTH - 6) * (value / 100);
        fill.clear();
        fill.fillStyle(0xf4d35e, 1);
        fill.fillRect(barX + 3, barY + 3, innerWidth, BAR_HEIGHT - 6);
      },
      onComplete: () => {
        this.scene.start('MenuScene');
      },
    });
  }
}
