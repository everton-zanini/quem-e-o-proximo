export type DialogueActionType = 'OUVIR' | 'AJUDAR' | 'COMPARTILHAR_ESPERANCA' | 'SAIR';

export interface DialogueOption {
  label: string;
  icon: string;
  action: DialogueActionType;
}

export interface DialogueData {
  npcId: string;
  npcName: string;
  intro: string;
  options: DialogueOption[];
}
