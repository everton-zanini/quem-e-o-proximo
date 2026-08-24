import Phaser from 'phaser';
import { DIALOGUES } from '../data/dialogues';
import { dialogueOverlay } from '../ui/DialogueOverlay';
import { gameState } from '../systems/GameState';
import { AudioManager, SFX, LOOPS } from '../systems/AudioManager';
import type { DialogueActionType } from '../types/DialogueTypes';

interface DialogueSceneData {
  npcId: string;
  dialogueId: string;
}

const DIALOGUE_VOLUME = 0.4;

/**
 * Renders nothing itself — it only orchestrates pausing GameScene and
 * showing/hiding the DOM dialogue overlay while it's running.
 */
export class DialogueScene extends Phaser.Scene {
  private audio!: AudioManager;

  constructor() {
    super('DialogueScene');
  }

  create(data: DialogueSceneData): void {
    this.audio = new AudioManager(this);
    const dialogue = DIALOGUES[data.dialogueId];

    this.audio.startLoop(LOOPS.Dialogue, DIALOGUE_VOLUME);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.audio.stopLoop(LOOPS.Dialogue));

    dialogueOverlay.show(dialogue, (action) => this.handleChoice(data.npcId, action));
  }

  private handleChoice(npcId: string, action: DialogueActionType): void {
    this.audio.stopLoop(LOOPS.Dialogue);
    this.audio.play(SFX.Choice);
    gameState.registerChoice(npcId, action);
    this.scene.stop();
    this.scene.resume('GameScene');
  }
}
