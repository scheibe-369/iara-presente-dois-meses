# 💣 Bomb Devil Protocol — para a Iara

Um presente interativo de **2 meses** — uma landing page com tema de _Chainsaw Man_ (a Reze, a Garota-Bomba).

A experiência tem 3 atos:

1. **Intro** — um terminal "BOMB DEVIL" armado, com mensagem criptografada.
2. **Detonação** — a Reze puxa o pino: pavio acende, contagem `3 · 2 · 1`, flash e onda de choque.
3. **Reveal** — a explosão forma um coração que bate, feito de "eu te amo", com o nome da Iara no centro e a mensagem de aniversário.

Bilíngue (🇧🇷 PT / 🇺🇸 EN) com seletor no canto superior direito.

## Rodar localmente

**Pré-requisito:** Node.js

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`.

## Build de produção

```bash
npm run build      # gera um index.html único e autocontido em dist/
npm run preview
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · Motion · Canvas 2D

## Estrutura

Arquitetura modular (Feature-Sliced) — tudo vive em `src/modules/bomb-reveal/`:

```
src/modules/bomb-reveal/
├─ BombReveal.tsx          # máquina de estados (intro → detonação → reveal) + histórico
├─ components/             # IntroTerminal, DetonationSequence, HeartCanvas, RevealScene, ...
├─ hooks/useLanguage.tsx   # idioma (PT/EN) com persistência
└─ data/copy.ts            # todo o texto, nos dois idiomas
```
