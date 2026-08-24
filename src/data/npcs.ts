import type { NPCData } from '../types/NPCTypes';
import { getCharsetFrames } from '../systems/CharsetFrames';

const RADIUS = 44;

// All 8 NPCs now come from character_1_8 / character_9_16 (both 16x20
// frames) so every character in the game ends up the same on-screen size
// without touching scale — characters_mv.png's 48x48 frames were making its
// 4 NPCs render noticeably differently, so it's no longer used here.
// (character_1_8's first 2 characters are reserved for the player.)
const CHARSET_1_8 = 'character_1_8';
const CHARSET_9_16 = 'character_9_16';

const purpleHair = getCharsetFrames(0, 2).idle; // character_1_8, unused by the player
const silverHeadband = getCharsetFrames(0, 3).idle; // character_1_8, unused by the player
const pinkHair = getCharsetFrames(1, 0).idle; // character_9_16, second group of 4
const orangeCurly = getCharsetFrames(1, 1).idle; // character_9_16, second group of 4
const block0Group0 = getCharsetFrames(0, 0).idle; // character_9_16
const block0Group1 = getCharsetFrames(0, 1).idle; // character_9_16
const block0Group2 = getCharsetFrames(0, 2).idle; // character_9_16
const block0Group3 = getCharsetFrames(0, 3).idle; // character_9_16

export const NPCS: NPCData[] = [
  {
    id: 'ana',
    kind: 'loneliness',
    name: 'Ana',
    x: 420,
    y: 260,
    textureKey: CHARSET_1_8,
    frame: purpleHair,
    interactionRadius: RADIUS,
    dialogueId: 'ana',
  },
  {
    id: 'marcos',
    kind: 'financial',
    name: 'Marcos',
    x: 320,
    y: 430,
    textureKey: CHARSET_1_8,
    frame: silverHeadband,
    interactionRadius: RADIUS,
    dialogueId: 'marcos',
  },
  {
    id: 'helena',
    kind: 'grief',
    name: 'Dona Helena',
    x: 155,
    y: 610,
    textureKey: CHARSET_9_16,
    frame: pinkHair,
    interactionRadius: RADIUS,
    dialogueId: 'helena',
  },
  {
    id: 'pedro',
    kind: 'direction',
    name: 'Pedro',
    x: 650,
    y: 705,
    textureKey: CHARSET_9_16,
    frame: orangeCurly,
    interactionRadius: RADIUS,
    dialogueId: 'pedro',
  },
  {
    id: 'rafael',
    kind: 'angry_religion',
    name: 'Rafael',
    x: 250,
    y: 660,
    textureKey: CHARSET_9_16,
    frame: block0Group0,
    interactionRadius: RADIUS,
    dialogueId: 'rafael',
  },
  {
    id: 'bia',
    kind: 'just_talk',
    name: 'Bia',
    x: 470,
    y: 680,
    textureKey: CHARSET_9_16,
    frame: block0Group1,
    interactionRadius: RADIUS,
    dialogueId: 'bia',
  },
  {
    id: 'julia',
    kind: 'helping_other',
    name: 'Júlia',
    x: 160,
    y: 790,
    textureKey: CHARSET_9_16,
    frame: block0Group2,
    interactionRadius: RADIUS,
    dialogueId: 'julia',
  },
  {
    id: 'carlos',
    kind: 'hidden_need',
    name: 'Carlos',
    x: 630,
    y: 860,
    textureKey: CHARSET_9_16,
    frame: block0Group3,
    interactionRadius: RADIUS,
    dialogueId: 'carlos',
  },
  {
    id: 'antonio',
    kind: 'loneliness',
    name: 'Sr. Antônio',
    x: 400,
    y: 970,
    textureKey: CHARSET_1_8,
    frame: purpleHair,
    interactionRadius: RADIUS,
    dialogueId: 'antonio',
  },
  {
    id: 'lu',
    kind: 'just_talk',
    name: 'Lu',
    x: 250,
    y: 1090,
    textureKey: CHARSET_9_16,
    frame: block0Group1,
    interactionRadius: RADIUS,
    dialogueId: 'lu',
  },
];
