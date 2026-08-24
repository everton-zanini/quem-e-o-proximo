export type MapElementType = 'street' | 'plaza' | 'house' | 'church' | 'tree' | 'obstacle';

export interface MapElement {
  type: MapElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  color: number;
}

/** World is bigger than the logical screen (360x640) so there is a bit of city to explore. */
export const MAP_WIDTH = 720;
export const MAP_HEIGHT = 1280;

export const GRASS_COLOR = 0x4c9a4c;

export const PLAYER_START = { x: 360, y: 220 };

/** Element types that block movement (get a static physics body). */
export const SOLID_TYPES: MapElementType[] = ['house', 'church', 'tree', 'obstacle'];

export const MAP_LAYOUT: MapElement[] = [
  // Church — starting point / "base"
  { type: 'church', x: 260, y: 40, w: 200, h: 160, color: 0x8b5e3c },

  // Streets
  { type: 'street', x: 330, y: 200, w: 60, h: 340, color: 0x707070 },
  { type: 'street', x: 40, y: 650, w: 160, h: 50, color: 0x707070 },
  { type: 'street', x: 520, y: 650, w: 160, h: 50, color: 0x707070 },
  { type: 'street', x: 330, y: 820, w: 60, h: 380, color: 0x707070 },
  { type: 'street', x: 100, y: 1150, w: 520, h: 50, color: 0x707070 },

  // Central plaza
  { type: 'plaza', x: 160, y: 540, w: 400, h: 280, color: 0xd8c9a3 },

  // Fountain (obstacle in the middle of the plaza)
  { type: 'obstacle', x: 330, y: 650, w: 60, h: 60, color: 0x6ec6ff },

  // Houses
  { type: 'house', x: 40, y: 560, w: 90, h: 80, color: 0xb5651d },
  { type: 'house', x: 40, y: 740, w: 90, h: 80, color: 0xb5651d },
  { type: 'house', x: 590, y: 560, w: 90, h: 80, color: 0xc97c3d },
  { type: 'house', x: 590, y: 740, w: 90, h: 80, color: 0xc97c3d },
  { type: 'house', x: 100, y: 1060, w: 90, h: 80, color: 0xa8571f },
  { type: 'house', x: 530, y: 1060, w: 90, h: 80, color: 0xa8571f },

  // Trees
  { type: 'tree', x: 250, y: 210, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 440, y: 230, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 150, y: 480, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 560, y: 480, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 250, y: 900, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 440, y: 920, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 340, y: 1230, w: 28, h: 28, color: 0x2f6b2f },
  { type: 'tree', x: 60, y: 900, w: 28, h: 28, color: 0x2f6b2f },
];
