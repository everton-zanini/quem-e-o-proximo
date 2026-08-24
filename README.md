# Quem é o Próximo?

Jogo 2D de exploração urbana sobre parar, notar e responder às pessoas ao seu redor — cada uma carregando uma dor ou necessidade diferente.

## Tecnologias

- **Phaser 4** — engine 2D (renderização WebGL/Canvas, física Arcade, cenas, áudio)
- **TypeScript**
- **Vite** — dev server e build

Estrutura do código (`src/`):
- `scenes/` — telas do jogo (Boot, Preload, Menu, Instructions, CharacterSelect, Game, Dialogue, Result)
- `entities/` — `Player` e `NPC` (sprites com física)
- `systems/` — construção do mapa (`MapBuilder`), áudio (`AudioManager`), estado da partida (`GameState`), joystick virtual, etc.
- `data/` — conteúdo declarativo: layout do mapa, personagens, NPCs, diálogos, texto de encerramento
- `ui/` — HUD e caixa de diálogo (DOM sobreposto ao canvas)

### Rodando localmente

```bash
npm install
npm run dev       # servidor de desenvolvimento
npm run build     # build de produção (dist/)
npm run preview   # serve o build de produção localmente
```

## Sobre o jogo

Você explora uma pequena cidade e encontra pessoas — cada uma enfrentando algo diferente: solidão, aperto financeiro, luto, falta de direção, desconfiança da fé, alguém só querendo desabafar, alguém ajudando o próximo, ou uma necessidade escondida atrás de um "tudo bem".

Ao interagir com alguém, você escolhe como responder:
- 👂 **Ouvir**
- ❤️ **Ajudar**
- 🗣️ **Compartilhar a Palavra**
- ➡️ **Sair** (seguir sem parar)

Funciona com teclado (WASD / setas) ou toque (joystick virtual), pensado tanto para desktop quanto para mobile.

A partida termina ao encontrar pelo menos 5 pessoas ou quando o tempo (4:30) se esgota. No final, o jogo mostra quantas pessoas você encontrou, ouviu, ajudou e ignorou, seguido de uma reflexão que fecha com Marcos 16:15.
