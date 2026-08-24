export type NPCKind =
  | 'loneliness'
  | 'financial'
  | 'grief'
  | 'direction'
  | 'angry_religion'
  | 'just_talk'
  | 'helping_other'
  | 'hidden_need';

export interface PatrolPoint {
  x: number;
  y: number;
}

export interface NPCData {
  id: string;
  kind: NPCKind;
  name: string;
  x: number;
  y: number;
  textureKey: string;
  /** Frame index into `textureKey` when it's a shared spritesheet (e.g. characters_mv). */
  frame?: number;
  interactionRadius: number;
  dialogueId: string;
  patrol?: {
    points: PatrolPoint[];
    speed: number;
  };
}
