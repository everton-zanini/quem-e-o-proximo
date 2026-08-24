import Phaser from 'phaser';
import type { CharacterOption } from '../data/characters';
import { getCharsetFrames } from '../systems/CharsetFrames';
import type { DirectionFrames } from '../systems/CharsetFrames';

const SPEED = 140;
const MOVE_EPSILON = 0.1;
const TARGET_SIZE = 32; // same on-screen size as NPCs (see entities/NPC.ts)
const ANIM_FRAME_RATE = 8;

/** Normalized 2D vector, e.g. what VirtualJoystick.getVector() returns. */
interface MoveVector {
  x: number;
  y: number;
}

type Direction = 'down' | 'left' | 'right' | 'up';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursorKeys?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private animPrefix = '';
  private idleFrame = 0;
  private hasAnimations = false;

  constructor(scene: Phaser.Scene, x: number, y: number, character: CharacterOption) {
    const hasRealTexture = scene.textures.exists(character.textureKey);
    const textureKey = hasRealTexture ? character.textureKey : 'player';
    const frames = hasRealTexture ? getCharsetFrames(character.block, character.group) : null;

    super(scene, x, y, textureKey, frames?.idle);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);

    // Circle sized/centered proportionally to whatever frame size this
    // texture happens to have (32x32 placeholder vs 16x20 charset, etc.).
    const radius = Math.min(this.frame.width, this.frame.height) * 0.375;
    this.setCircle(radius, this.frame.width / 2 - radius, this.frame.height / 2 - radius);

    // Scale so the larger frame dimension always ends up at TARGET_SIZE —
    // dynamic Arcade bodies auto-scale their circle along with the sprite.
    this.setScale(TARGET_SIZE / Math.max(this.frame.width, this.frame.height));
    this.setDepth(y);

    if (frames) {
      this.animPrefix = `${character.textureKey}-${character.block}-${character.group}`;
      this.idleFrame = frames.idle;
      this.hasAnimations = true;
      this.createAnimations(frames);
    }

    if (scene.input.keyboard) {
      this.cursorKeys = scene.input.keyboard.createCursorKeys();
      this.wasdKeys = scene.input.keyboard.addKeys('W,A,S,D') as typeof this.wasdKeys;
    }
  }

  /** Called every frame from GameScene.update() with the joystick's current vector. */
  updateMovement(joystickVector: MoveVector): void {
    const vector: MoveVector = { x: joystickVector.x, y: joystickVector.y };

    if (this.cursorKeys && this.wasdKeys) {
      if (this.cursorKeys.left.isDown || this.wasdKeys.A.isDown) vector.x -= 1;
      if (this.cursorKeys.right.isDown || this.wasdKeys.D.isDown) vector.x += 1;
      if (this.cursorKeys.up.isDown || this.wasdKeys.W.isDown) vector.y -= 1;
      if (this.cursorKeys.down.isDown || this.wasdKeys.S.isDown) vector.y += 1;
    }

    const length = Math.hypot(vector.x, vector.y);
    if (length > 1) {
      vector.x /= length;
      vector.y /= length;
    }

    this.setVelocity(vector.x * SPEED, vector.y * SPEED);
    this.updateAnimation(vector, length);
    this.setDepth(this.y);
  }

  /** No-op when only the placeholder texture is loaded (no walk animations exist). */
  private updateAnimation(vector: MoveVector, length: number): void {
    if (!this.hasAnimations) return;

    if (length < MOVE_EPSILON) {
      this.anims.stop();
      this.setFrame(this.idleFrame);
      return;
    }

    const direction: Direction =
      Math.abs(vector.y) >= Math.abs(vector.x)
        ? vector.y < 0
          ? 'up'
          : 'down'
        : vector.x < 0
          ? 'left'
          : 'right';

    this.anims.play(`walk-${direction}-${this.animPrefix}`, true);
  }

  private createAnimations(frames: DirectionFrames): void {
    const byDirection: Array<[Direction, [number, number]]> = [
      ['down', frames.down],
      ['left', frames.left],
      ['right', frames.right],
      ['up', frames.up],
    ];

    for (const [direction, [start, end]] of byDirection) {
      const key = `walk-${direction}-${this.animPrefix}`;
      if (this.scene.anims.exists(key)) continue;

      this.scene.anims.create({
        key,
        frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start, end }),
        frameRate: ANIM_FRAME_RATE,
        repeat: -1,
      });
    }
  }
}
