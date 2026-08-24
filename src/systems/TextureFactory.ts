import Phaser from 'phaser';
import type { NPCKind } from '../types/NPCTypes';

const CHARACTER_SIZE = 32;
const OUTLINE_COLOR = 0x1c1c28;
const PLAYER_COLOR = 0xf5f5f5;

const NPC_KIND_COLORS: Record<NPCKind, number> = {
  loneliness: 0x8ecae6,
  financial: 0xffb703,
  grief: 0x6c757d,
  direction: 0x9d4edd,
  angry_religion: 0xe63946,
  just_talk: 0x2a9d8f,
  helping_other: 0x06d6a0,
  hidden_need: 0xf4a261,
};

/**
 * Generates placeholder textures from plain Graphics shapes for any
 * character key that wasn't already loaded as a real image in Preload.
 * This is the single place to swap for real spritesheets later — entities
 * only ever reference a `textureKey`, never draw shapes, and real sprites
 * loaded via `this.load.image(key, ...)` take precedence automatically.
 */
export function generatePlaceholderTextures(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  if (!scene.textures.exists('player')) {
    drawCharacter(g, PLAYER_COLOR);
    g.generateTexture('player', CHARACTER_SIZE, CHARACTER_SIZE);
  }

  for (const kind of Object.keys(NPC_KIND_COLORS) as NPCKind[]) {
    const key = `npc_${kind}`;
    if (scene.textures.exists(key)) continue;

    g.clear();
    drawCharacter(g, NPC_KIND_COLORS[kind]);
    g.generateTexture(key, CHARACTER_SIZE, CHARACTER_SIZE);
  }

  g.destroy();
}

function drawCharacter(g: Phaser.GameObjects.Graphics, bodyColor: number): void {
  const cx = CHARACTER_SIZE / 2;
  const cy = CHARACTER_SIZE / 2;

  g.fillStyle(OUTLINE_COLOR, 1);
  g.fillCircle(cx, cy, 14);
  g.fillStyle(bodyColor, 1);
  g.fillCircle(cx, cy, 12);
  g.fillStyle(OUTLINE_COLOR, 1);
  g.fillCircle(cx, cy + 6, 3);
}
