import Phaser from 'phaser';

const BASE_RADIUS = 42;
const THUMB_RADIUS = 20;
const MAX_DISTANCE = 42;

/**
 * A minimal touch joystick built from Phaser primitives (no external plugin).
 * Always visible at a fixed rest position in the bottom-left quadrant of the
 * viewport, so players can see where to touch before ever tapping — dragging
 * anywhere in the zone moves the thumb toward that touch, clamped to
 * MAX_DISTANCE, and it snaps back to rest on release. Exposes a normalized
 * {x, y} vector via getVector().
 */
export class VirtualJoystick {
  private scene: Phaser.Scene;
  private zone: Phaser.GameObjects.Zone;
  private base: Phaser.GameObjects.Arc;
  private thumb: Phaser.GameObjects.Arc;
  private origin: { x: number; y: number };
  private vector = { x: 0, y: 0 };
  private pointerId: number | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    const { width, height } = scene.scale;
    const zoneWidth = width * 0.55;
    const zoneHeight = height * 0.4;

    this.zone = scene.add
      .zone(0, height - zoneHeight, zoneWidth, zoneHeight)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setInteractive();

    this.origin = { x: zoneWidth * 0.5, y: height - zoneHeight * 0.5 };

    this.base = scene.add
      .circle(this.origin.x, this.origin.y, BASE_RADIUS, 0xffffff, 0.25)
      .setScrollFactor(0)
      .setDepth(1000);

    this.thumb = scene.add
      .circle(this.origin.x, this.origin.y, THUMB_RADIUS, 0xffffff, 0.5)
      .setScrollFactor(0)
      .setDepth(1001);

    this.zone.on('pointerdown', this.handlePointerDown, this);
    scene.input.on(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
    scene.input.on(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.handlePointerUp, this);
  }

  getVector(): { x: number; y: number } {
    return this.vector;
  }

  destroy(): void {
    this.scene.input.off(Phaser.Input.Events.POINTER_MOVE, this.handlePointerMove, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP, this.handlePointerUp, this);
    this.scene.input.off(Phaser.Input.Events.POINTER_UP_OUTSIDE, this.handlePointerUp, this);
    this.zone.destroy();
    this.base.destroy();
    this.thumb.destroy();
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    this.pointerId = pointer.id;
    this.updateThumb(pointer.x, pointer.y);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (this.pointerId === null || pointer.id !== this.pointerId) return;
    this.updateThumb(pointer.x, pointer.y);
  }

  private handlePointerUp(pointer: Phaser.Input.Pointer): void {
    if (this.pointerId === null || pointer.id !== this.pointerId) return;

    this.pointerId = null;
    this.vector = { x: 0, y: 0 };
    this.thumb.setPosition(this.origin.x, this.origin.y);
  }

  private updateThumb(pointerX: number, pointerY: number): void {
    const dx = pointerX - this.origin.x;
    const dy = pointerY - this.origin.y;
    const distance = Math.min(Math.hypot(dx, dy), MAX_DISTANCE);
    const angle = Math.atan2(dy, dx);
    const thumbX = Math.cos(angle) * distance;
    const thumbY = Math.sin(angle) * distance;

    this.thumb.setPosition(this.origin.x + thumbX, this.origin.y + thumbY);
    this.vector = { x: thumbX / MAX_DISTANCE, y: thumbY / MAX_DISTANCE };
  }
}
