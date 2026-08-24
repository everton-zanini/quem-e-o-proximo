import type { DialogueActionType, DialogueData } from '../types/DialogueTypes';

type ChoiceHandler = (action: DialogueActionType) => void;

/**
 * Single reusable DOM node for the dialogue box. Created once and
 * shown/hidden/repopulated on demand, instead of creating/destroying DOM
 * nodes on every NPC interaction.
 */
class DialogueOverlay {
  private root: HTMLDivElement;
  private box: HTMLDivElement;
  private nameEl: HTMLParagraphElement;
  private textEl: HTMLParagraphElement;
  private optionsEl: HTMLDivElement;
  private onChoice: ChoiceHandler | null = null;

  constructor() {
    this.root = document.createElement('div');
    this.root.className = 'dialogue-overlay';

    this.box = document.createElement('div');
    this.box.className = 'dialogue-box';

    this.nameEl = document.createElement('p');
    this.nameEl.className = 'dialogue-name';

    this.textEl = document.createElement('p');
    this.textEl.className = 'dialogue-text';

    this.optionsEl = document.createElement('div');
    this.optionsEl.className = 'dialogue-options';

    this.box.append(this.nameEl, this.textEl, this.optionsEl);
    this.root.append(this.box);
    document.body.append(this.root);
  }

  show(dialogue: DialogueData, onChoice: ChoiceHandler): void {
    this.onChoice = onChoice;
    this.nameEl.textContent = dialogue.npcName;
    this.textEl.textContent = dialogue.intro;
    this.optionsEl.replaceChildren();

    for (const option of dialogue.options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'dialogue-option';
      button.dataset.action = option.action;
      button.textContent = `${option.icon} ${option.label}`;
      button.addEventListener('click', () => this.handleChoice(option.action));
      this.optionsEl.append(button);
    }

    this.root.classList.add('is-visible');
  }

  hide(): void {
    this.root.classList.remove('is-visible');
    this.onChoice = null;
  }

  private handleChoice(action: DialogueActionType): void {
    const handler = this.onChoice;
    this.hide();
    handler?.(action);
  }
}

export const dialogueOverlay = new DialogueOverlay();
