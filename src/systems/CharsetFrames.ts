export interface DirectionFrames {
  down: [number, number];
  left: [number, number];
  right: [number, number];
  up: [number, number];
  /** "Standing still, facing down" frame — the middle of the down walk cycle. */
  idle: number;
}

const COLUMNS = 12;
const ROWS_PER_BLOCK = 4;
const FRAMES_PER_WALK = 3;

/**
 * Frame ranges for a character in a 12-column charset sheet laid out in
 * 4-row blocks (down/left/right/up), 3 walk frames per direction, 4
 * characters per block (3 columns each). Matches characters_mv.png,
 * character_9-16.png and character_1-8.png.
 */
export function getCharsetFrames(block: number, group: number): DirectionFrames {
  const rowStart = block * ROWS_PER_BLOCK;
  const colStart = group * FRAMES_PER_WALK;
  const downStart = rowStart * COLUMNS + colStart;
  const leftStart = downStart + COLUMNS;
  const rightStart = leftStart + COLUMNS;
  const upStart = rightStart + COLUMNS;

  return {
    down: [downStart, downStart + 2],
    left: [leftStart, leftStart + 2],
    right: [rightStart, rightStart + 2],
    up: [upStart, upStart + 2],
    idle: downStart + 1,
  };
}
