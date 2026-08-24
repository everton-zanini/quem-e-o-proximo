import type { DialogueData, DialogueOption } from '../types/DialogueTypes';

const DEFAULT_OPTIONS: DialogueOption[] = [
  { label: 'Ouvir', icon: '👂', action: 'OUVIR' },
  { label: 'Ajudar', icon: '❤️', action: 'AJUDAR' },
  { label: 'Compartilhar a Palavra', icon: '🗣️', action: 'COMPARTILHAR_ESPERANCA' },
  { label: 'Sair', icon: '➡️', action: 'SAIR' },
];

export const DIALOGUES: Record<string, DialogueData> = {
  ana: {
    npcId: 'ana',
    npcName: 'Ana',
    intro: 'Oi... desculpa, hoje não tenho muito o que dizer. Faz tempo que ninguém puxa assunto comigo.',
    options: DEFAULT_OPTIONS,
  },
  marcos: {
    npcId: 'marcos',
    npcName: 'Marcos',
    intro: 'Esse mês tá osso. Nem sei como vou fechar as contas até o fim do mês.',
    options: DEFAULT_OPTIONS,
  },
  helena: {
    npcId: 'helena',
    npcName: 'Dona Helena',
    intro: 'Meu marido se foi há alguns meses. Ainda não me acostumei com a casa tão silenciosa.',
    options: DEFAULT_OPTIONS,
  },
  pedro: {
    npcId: 'pedro',
    npcName: 'Pedro',
    intro: 'Sei lá, cara. Terminei os estudos e não faço a menor ideia do que fazer da vida agora.',
    options: DEFAULT_OPTIONS,
  },
  rafael: {
    npcId: 'rafael',
    npcName: 'Rafael',
    intro: 'Religião? Já ouvi promessa demais e vi pouca coisa acontecer de verdade.',
    options: DEFAULT_OPTIONS,
  },
  bia: {
    npcId: 'bia',
    npcName: 'Bia',
    intro: 'Nossa, que dia corrido! Só queria mesmo alguém pra desabafar um minuto.',
    options: DEFAULT_OPTIONS,
  },
  julia: {
    npcId: 'julia',
    npcName: 'Júlia',
    intro: 'Tô aqui ajudando meu vizinho a levar as compras, ele não anda bem das pernas.',
    options: DEFAULT_OPTIONS,
  },
  carlos: {
    npcId: 'carlos',
    npcName: 'Carlos',
    intro: 'Tá tudo certo por aqui, rs. Só... um pouco cansado essa semana. Só isso.',
    options: DEFAULT_OPTIONS,
  },
  antonio: {
    npcId: 'antonio',
    npcName: 'Sr. Antônio',
    intro: 'Sento aqui todo santo dia. Ninguém mais para pra conversar comigo.',
    options: DEFAULT_OPTIONS,
  },
  lu: {
    npcId: 'lu',
    npcName: 'Lu',
    intro: 'Ei! Eu adoraria só trocar uma ideia com alguém agora, nem que seja rapidinho.',
    options: DEFAULT_OPTIONS,
  },
};
