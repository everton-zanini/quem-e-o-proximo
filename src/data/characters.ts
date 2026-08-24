export interface CharacterOption {
  id: string;
  label: string;
  textureKey: string;
  /** Which 4-row direction-block within the sheet (0 = rows 0-3, 1 = rows 4-7, ...). */
  block: number;
  /** Which of the 4 characters within that block (0-3), i.e. which 3-column group. */
  group: number;
}

export const CHARACTER_OPTIONS: CharacterOption[] = [
  { id: 'boy', label: 'Menino', textureKey: 'character_1_8', block: 0, group: 0 },
  { id: 'girl', label: 'Menina', textureKey: 'character_1_8', block: 0, group: 1 },
];
