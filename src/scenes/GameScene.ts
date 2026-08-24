import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { NPCS } from '../data/npcs';
import { PLAYER_START } from '../data/mapLayout';
import { buildMap } from '../systems/MapBuilder';
import { VirtualJoystick } from '../systems/VirtualJoystick';
import { HUD } from '../ui/HUD';
import { AudioManager, SFX, LOOPS } from '../systems/AudioManager';
import { gameState } from '../systems/GameState';
import { playerProfile } from '../systems/PlayerProfile';

const MUSIC_VOLUME = 0.35;
const BIRDS_VOLUME = 0.25;

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private npcs: NPC[] = [];
  private joystick!: VirtualJoystick;
  private hud!: HUD;
  private audio!: AudioManager;
  private nearbyNpc: NPC | null = null;
  private isDialogueOpen = false;

  constructor() {
    super('GameScene');
  }

  create(): void {
    this.isDialogueOpen = false;
    this.nearbyNpc = null;

    this.audio = new AudioManager(this);

    const map = buildMap(this);

    this.player = new Player(this, PLAYER_START.x, PLAYER_START.y, playerProfile.character);
    this.physics.add.collider(this.player, map.obstacles);

    this.npcs = NPCS.map((npcData) => new NPC(this, npcData));
    this.physics.add.collider(this.player, this.npcs);

    this.cameras.main.setBounds(0, 0, map.width, map.height);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);
    this.cameras.main.setRoundPixels(true);

    this.joystick = new VirtualJoystick(this);
    this.hud = new HUD(this, () => this.handleInteract());

    this.audio.startLoop(LOOPS.Music, MUSIC_VOLUME);
    this.audio.startAmbiencePan(LOOPS.Birds, { volume: BIRDS_VOLUME });

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, this.handleShutdown, this);
  }

  update(): void {
    if (this.isDialogueOpen) return;

    this.player.updateMovement(this.joystick.getVector());
    this.updateNearbyNpc();

    if (gameState.checkEndCondition()) {
      this.scene.start('ResultScene', gameState.snapshot());
    }
  }

  private updateNearbyNpc(): void {
    const npc = this.npcs.find((candidate) => candidate.isPlayerInRange(this.player.x, this.player.y)) ?? null;

    if (npc !== this.nearbyNpc) {
      this.nearbyNpc = npc;
      if (npc) {
        this.hud.showPrompt();
      } else {
        this.hud.hidePrompt();
      }
    }
  }

  private handleInteract(): void {
    if (!this.nearbyNpc || this.isDialogueOpen) return;

    const npc = this.nearbyNpc;
    this.isDialogueOpen = true;
    this.audio.play(SFX.Interact);
    this.player.setVelocity(0, 0);
    this.hud.hidePrompt();

    this.scene.launch('DialogueScene', { npcId: npc.npcData.id, dialogueId: npc.npcData.dialogueId });
    this.scene.pause();

    this.events.once(Phaser.Scenes.Events.RESUME, () => {
      this.isDialogueOpen = false;
      npc.markInteracted();
      this.hud.refreshCounter();
      this.nearbyNpc = null;
    });
  }

  private handleShutdown(): void {
    this.audio.stopLoop(LOOPS.Music);
    this.audio.stopLoop(LOOPS.Birds);
    this.joystick.destroy();
    this.hud.destroy();
  }
}
