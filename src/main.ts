import './style.css';
import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MenuScene } from './scenes/MenuScene';
import { InstructionsScene } from './scenes/InstructionsScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { GameScene } from './scenes/GameScene';
import { DialogueScene } from './scenes/DialogueScene';
import { ResultScene } from './scenes/ResultScene';

new Phaser.Game({
  ...gameConfig,
  scene: [BootScene, PreloadScene, MenuScene, InstructionsScene, CharacterSelectScene, GameScene, DialogueScene, ResultScene],
});
