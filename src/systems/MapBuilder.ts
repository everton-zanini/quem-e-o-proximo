import Phaser from 'phaser';
import { GRASS_COLOR, MAP_HEIGHT, MAP_LAYOUT, MAP_WIDTH, SOLID_TYPES } from '../data/mapLayout';

export interface MapBuildResult {
  obstacles: Phaser.Physics.Arcade.StaticGroup;
  width: number;
  height: number;
}

const SCENERY_KEY = 'scenery';

/** Maps each house's mapLayout.ts `color` to the matching tileset sprite variant. */
const HOUSE_FRAME_BY_COLOR: Record<number, string> = {
  0xb5651d: 'house_orange',
  0xc97c3d: 'house_red',
  0xa8571f: 'house_green',
};

// The house sprite (44x76) is smaller than a house's mapLayout footprint
// (90x80) — scaled up so it fills the plot better.
const HOUSE_SCALE = 1.6;

/**
 * Draws the city from the declarative MAP_LAYOUT list and creates static
 * collision bodies for solid elements. No tilemap involved — swapping this
 * for a Tiled JSON map later only touches this file, not GameScene.
 *
 * Ground (grass) and streets use real texture tiles from output_tileset.png
 * when it's loaded (see PreloadScene, which defines its 'grass'/'dirt'
 * frames); otherwise they fall back to the flat colors below, same
 * robustness pattern used for every other asset in this game.
 */
export function buildMap(scene: Phaser.Scene): MapBuildResult {
  scene.cameras.main.setBackgroundColor(GRASS_COLOR);
  scene.physics.world.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);

  const hasGrassTexture = hasSceneryFrame(scene, 'grass');
  const hasDirtTexture = hasSceneryFrame(scene, 'dirt');
  const hasTreeTexture = hasSceneryFrame(scene, 'tree');

  if (hasGrassTexture) {
    scene.add.tileSprite(MAP_WIDTH / 2, MAP_HEIGHT / 2, MAP_WIDTH, MAP_HEIGHT, SCENERY_KEY, 'grass');
  }

  const obstacles = scene.physics.add.staticGroup();

  for (const element of MAP_LAYOUT) {
    const centerX = element.x + element.w / 2;
    const centerY = element.y + element.h / 2;

    const houseFrame = element.type === 'house' ? HOUSE_FRAME_BY_COLOR[element.color] : undefined;
    const hasHouseTexture = !!houseFrame && hasSceneryFrame(scene, houseFrame);

    const visual =
      element.type === 'street' && hasDirtTexture
        ? scene.add.tileSprite(centerX, centerY, element.w, element.h, SCENERY_KEY, 'dirt')
        : element.type === 'tree' && hasTreeTexture
          ? scene.add.image(centerX, centerY, SCENERY_KEY, 'tree')
          : hasHouseTexture
            ? scene.add.image(centerX, centerY, SCENERY_KEY, houseFrame).setScale(HOUSE_SCALE)
            : scene.add.rectangle(centerX, centerY, element.w, element.h, element.color);

    if (SOLID_TYPES.includes(element.type)) {
      scene.physics.add.existing(visual, true);
      obstacles.add(visual);

      // The tree/house sprites don't match their mapLayout.ts collision
      // footprint 1:1 (tree canopy overhangs its 28x28 trunk; house art is
      // smaller than its 90x80 plot before scaling up). Force the hitbox
      // back to that footprint (StaticBody#setSize re-centers it) so
      // collision stays unchanged either way.
      if ((element.type === 'tree' && hasTreeTexture) || hasHouseTexture) {
        (visual.body as Phaser.Physics.Arcade.StaticBody).setSize(element.w, element.h);
      }
    }
  }

  return { obstacles, width: MAP_WIDTH, height: MAP_HEIGHT };
}

function hasSceneryFrame(scene: Phaser.Scene, frame: string): boolean {
  return scene.textures.exists(SCENERY_KEY) && scene.textures.get(SCENERY_KEY).has(frame);
}
