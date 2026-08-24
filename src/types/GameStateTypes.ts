export interface GameStateSnapshot {
  metCount: number;
  listenedCount: number;
  helpedCount: number;
  sharedHopeCount: number;
  ignoredCount: number;
  impactScore: number;
  elapsedMs: number;
}

export const GameEvent = {
  StateChanged: 'state-changed',
  GameCompleted: 'game-completed',
} as const;

export type GameEventName = (typeof GameEvent)[keyof typeof GameEvent];
