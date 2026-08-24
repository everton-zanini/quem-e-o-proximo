import Phaser from 'phaser';

export const SFX = {
  Interact: 'sfx_interact',
  Choice: 'sfx_choice',
  Complete: 'sfx_complete',
} as const;

export type SfxKey = (typeof SFX)[keyof typeof SFX];

/** Loop-style audio: background music, ambience, dialogue chatter. */
export const LOOPS = {
  Music: 'loop_music',
  Birds: 'loop_birds',
  Dialogue: 'loop_dialogue',
  MenuTheme: 'loop_menu_theme',
  EndingTheme: 'loop_ending_theme',
} as const;

export type LoopKey = (typeof LOOPS)[keyof typeof LOOPS];

export interface AmbiencePanOptions {
  volume?: number;
  /** Pan range the sound oscillates between. -1 = full left, 1 = full right. */
  panFrom?: number;
  panTo?: number;
  /** Duration of one leg of the oscillation (ms). Full cycle = 2x this (yoyo). */
  duration?: number;
}

/**
 * Thin wrapper around the sound manager. Safe to call even when no audio
 * files have been loaded yet — swap in real files via the Preload scene
 * and these calls start working with no other code changes.
 */
export class AudioManager {
  private scene: Phaser.Scene;
  private activeLoops = new Map<LoopKey, Phaser.Sound.BaseSound>();
  private activeTweens = new Map<LoopKey, Phaser.Tweens.Tween>();

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  play(key: SfxKey): void {
    if (!this.scene.cache.audio.exists(key)) return;
    this.scene.sound.play(key);
  }

  /**
   * Starts a looping sound if it isn't already playing. Safe to call every
   * frame (e.g. from Player's movement check) — it's a no-op while the loop
   * is already active, so it never restarts/clicks the sound.
   */
  startLoop(key: LoopKey, volume = 1): Phaser.Sound.BaseSound | undefined {
    if (!this.scene.cache.audio.exists(key)) return undefined;

    const existing = this.activeLoops.get(key);
    if (existing && existing.isPlaying) return existing;

    const sound = this.scene.sound.add(key, { loop: true, volume });
    sound.play();
    this.activeLoops.set(key, sound);
    return sound;
  }

  /**
   * Like startLoop, but also animates stereo pan back and forth forever —
   * used for the birds ambience to fake a sense of spatial movement in an
   * otherwise fully 2D top-down scene. No audible effect on the HTML5 Audio
   * backend, but harmless there.
   */
  startAmbiencePan(key: LoopKey, options: AmbiencePanOptions = {}): void {
    const sound = this.startLoop(key, options.volume ?? 1);
    if (!sound) return;
    if (this.activeTweens.has(key)) return;

    const { panFrom = -0.6, panTo = 0.6, duration = 7000 } = options;

    const tween = this.scene.tweens.add({
      targets: sound,
      pan: { from: panFrom, to: panTo },
      duration,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.activeTweens.set(key, tween);
  }

  stopLoop(key: LoopKey): void {
    const tween = this.activeTweens.get(key);
    if (tween) {
      tween.stop();
      this.activeTweens.delete(key);
    }

    const sound = this.activeLoops.get(key);
    if (!sound) return;
    sound.stop();
    sound.destroy();
    this.activeLoops.delete(key);
  }

  isLoopPlaying(key: LoopKey): boolean {
    return this.activeLoops.get(key)?.isPlaying ?? false;
  }
}
