import Phaser from 'phaser';
import type { NPCData } from '../types/NPCTypes';

const TARGET_SIZE = 32;

export class NPC extends Phaser.Physics.Arcade.Sprite {
  readonly npcData: NPCData;
  hasInteracted = false;

  constructor(scene: Phaser.Scene, npcData: NPCData) {
    // Falls back to the TextureFactory placeholder circle for this kind if
    // the shared spritesheet it points to hasn't loaded (e.g. still missing).
    const hasRealTexture = scene.textures.exists(npcData.textureKey);
    const textureKey = hasRealTexture ? npcData.textureKey : `npc_${npcData.kind}`;
    const frame = hasRealTexture ? npcData.frame : undefined;

    super(scene, npcData.x, npcData.y, textureKey, frame);
    this.npcData = npcData;
    scene.add.existing(this);
    scene.physics.add.existing(this, true);

    // Normalize to a consistent on-screen size regardless of the source
    // frame's native dimensions (48x48 square vs 16x20 non-square, etc.) —
    // uniform scale keeps aspect ratio, unlike setDisplaySize on its own.
    const scale = TARGET_SIZE / Math.max(this.frame.width, this.frame.height);
    const displayWidth = this.frame.width * scale;
    const displayHeight = this.frame.height * scale;
    this.setScale(scale);
    this.body?.setSize(displayWidth, displayHeight);

    this.setDepth(npcData.y);
  }

  isPlayerInRange(playerX: number, playerY: number): boolean {
    if (this.hasInteracted) return false;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, playerX, playerY);
    return distance <= this.npcData.interactionRadius;
  }

  markInteracted(): void {
    this.hasInteracted = true;
    this.setAlpha(0.5);
  }
}
