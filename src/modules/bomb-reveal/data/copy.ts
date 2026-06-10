// Bilingual copy for the Bomb Devil reveal. Everything user-facing lives here
// so a single language switch flips the whole experience.

export const GIRLFRIEND_NAME = 'Iara';

export type Lang = 'en' | 'pt';

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'pt', label: 'PT' },
  { code: 'en', label: 'EN' },
];

export const DEFAULT_LANG: Lang = 'en';

export interface Copy {
  pageTitle: string;
  intro: {
    terminalLabel: string;
    armedLabel: string;
    systemLabel: string;
    bootLine: string;
    targetLabel: string;
    targetValue: string;
    statusLabel: string;
    statusValue: string;
    lines: [string, string];
    cta: string;
  };
  detonation: {
    pinHint: string;
    countdown: [string, string, string];
  };
  reveal: {
    tag: string;
    topLine: string;
    topName: string;
    bottomLine: string;
    bottomSub: string;
    denjiHeart: string;
    replay: string;
    heartPhrases: string[];
    overlays: { topLeft: string[]; bottomRight: string };
  };
}

export const copy: Record<Lang, Copy> = {
  en: {
    pageTitle: '💣 Bomb Devil Protocol — for Iara',
    intro: {
      terminalLabel: 'bomb devil // terminal',
      armedLabel: 'armed',
      systemLabel: 'system',
      bootLine: 'Initializing BOMB DEVIL protocol v2.0...',
      targetLabel: 'target',
      targetValue: GIRLFRIEND_NAME,
      statusLabel: 'status',
      statusValue: 'FUSE ARMED',
      lines: [
        `Found an encrypted package for you, ${GIRLFRIEND_NAME}.`,
        'Warning: this message is highly explosive. 💣',
      ],
      cta: 'Detonate message',
    },
    detonation: {
      pinHint: 'pulling the pin...',
      countdown: ['3', '2', '1'],
    },
    reveal: {
      tag: 'detonation complete',
      topLine: 'Happy Two Months',
      topName: GIRLFRIEND_NAME,
      bottomLine: "You're my bomb girl",
      bottomSub: 'certified Bomb Devil — just like Reze 💣',
      denjiHeart: "you have Denji's heart",
      replay: 'Re-arm',
      heartPhrases: ['i love you'],
      overlays: {
        topLeft: ['reze // bomb devil', 'id: 0xDEADBEEF', 'type: organic_emotion'],
        bottomRight: 'yield: ∞ love // detonated',
      },
    },
  },
  pt: {
    pageTitle: '💣 Protocolo Bomb Devil — para Iara',
    intro: {
      terminalLabel: 'bomb devil // terminal',
      armedLabel: 'armado',
      systemLabel: 'sistema',
      bootLine: 'Iniciando protocolo BOMB DEVIL v2.0...',
      targetLabel: 'alvo',
      targetValue: GIRLFRIEND_NAME,
      statusLabel: 'status',
      statusValue: 'PAVIO ARMADO',
      lines: [
        `Encontrei um pacote criptografado pra você, ${GIRLFRIEND_NAME}.`,
        'Aviso: esta mensagem é altamente explosiva. 💣',
      ],
      cta: 'Detonar mensagem',
    },
    detonation: {
      pinHint: 'puxando o pino...',
      countdown: ['3', '2', '1'],
    },
    reveal: {
      tag: 'detonação completa',
      topLine: 'Feliz 2 Meses',
      topName: GIRLFRIEND_NAME,
      bottomLine: 'Você é minha garota bomba',
      bottomSub: 'Bomb Devil certificada — igual à Reze 💣',
      denjiHeart: "você tem o Denji's heart",
      replay: 'Rearmar',
      heartPhrases: ['eu te amo'],
      overlays: {
        topLeft: ['reze // bomb devil', 'id: 0xDEADBEEF', 'tipo: emoção_orgânica'],
        bottomRight: 'potência: ∞ amor // detonado',
      },
    },
  },
};
