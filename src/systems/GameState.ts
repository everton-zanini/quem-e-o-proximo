import Phaser from 'phaser';
import type { DialogueActionType } from '../types/DialogueTypes';
import type { GameStateSnapshot } from '../types/GameStateTypes';
import { GameEvent } from '../types/GameStateTypes';

export const MIN_NPCS_TO_END = 5;
export const TIME_LIMIT_MS = 4.5 * 60 * 1000;

const IMPACT_BY_ACTION: Record<DialogueActionType, number> = {
  OUVIR: 1,
  AJUDAR: 2,
  COMPARTILHAR_ESPERANCA: 2,
  SAIR: 0,
};

class GameStateManager extends Phaser.Events.EventEmitter {
  private metNpcIds = new Set<string>();
  private listenedCount = 0;
  private helpedCount = 0;
  private sharedHopeCount = 0;
  private ignoredCount = 0;
  private impactScore = 0;
  private startTimeMs = Date.now();
  private isGameOver = false;

  reset(): void {
    this.metNpcIds.clear();
    this.listenedCount = 0;
    this.helpedCount = 0;
    this.sharedHopeCount = 0;
    this.ignoredCount = 0;
    this.impactScore = 0;
    this.startTimeMs = Date.now();
    this.isGameOver = false;
  }

  hasMet(npcId: string): boolean {
    return this.metNpcIds.has(npcId);
  }

  registerChoice(npcId: string, action: DialogueActionType): void {
    if (this.metNpcIds.has(npcId)) return;

    this.metNpcIds.add(npcId);
    this.impactScore += IMPACT_BY_ACTION[action];

    switch (action) {
      case 'OUVIR':
        this.listenedCount += 1;
        break;
      case 'AJUDAR':
        this.helpedCount += 1;
        break;
      case 'COMPARTILHAR_ESPERANCA':
        this.sharedHopeCount += 1;
        break;
      case 'SAIR':
        this.ignoredCount += 1;
        break;
    }

    this.emit(GameEvent.StateChanged, this.snapshot());
  }

  checkEndCondition(): boolean {
    if (this.isGameOver) return true;

    const elapsedMs = Date.now() - this.startTimeMs;
    const reachedMinNpcs = this.metNpcIds.size >= MIN_NPCS_TO_END;
    const reachedTimeLimit = elapsedMs >= TIME_LIMIT_MS;

    if (reachedMinNpcs || reachedTimeLimit) {
      this.isGameOver = true;
      this.emit(GameEvent.GameCompleted, this.snapshot());
      return true;
    }

    return false;
  }

  snapshot(): GameStateSnapshot {
    return {
      metCount: this.metNpcIds.size,
      listenedCount: this.listenedCount,
      helpedCount: this.helpedCount,
      sharedHopeCount: this.sharedHopeCount,
      ignoredCount: this.ignoredCount,
      impactScore: this.impactScore,
      elapsedMs: Date.now() - this.startTimeMs,
    };
  }
}

export const gameState = new GameStateManager();
