import type { CharacterOption } from '../data/characters';
import { CHARACTER_OPTIONS } from '../data/characters';

const DEFAULT_NAME = 'Jogador(a)';

class PlayerProfileManager {
  name: string = DEFAULT_NAME;
  character: CharacterOption = CHARACTER_OPTIONS[0];

  setName(name: string): void {
    const trimmed = name.trim();
    this.name = trimmed.length > 0 ? trimmed : DEFAULT_NAME;
  }

  setCharacter(character: CharacterOption): void {
    this.character = character;
  }
}

export const playerProfile = new PlayerProfileManager();
