/**
 * Conteúdo central do jogo. Toda informação pública que se repete pelo site
 * nasce aqui — inclusive a previsão da demo. Para mudar o ano, mude uma vez.
 */

/** Estados reais de uma frente do projeto, espelhando o roadmap de referência. */
export type WorkStatus = 'done' | 'active' | 'base' | 'proto' | 'planned';

export const STATUS_LABEL: Record<WorkStatus, string> = {
  done: 'Implementado',
  active: 'Sistema ativo',
  base: 'Base de jogo',
  proto: 'No protótipo',
  planned: 'Planejado / não implementado',
};

export const game = {
  name: 'CLT Simulator',
  wordmark: { first: 'CLT', second: 'Simulator' },
  stamp: 'Sem vagas',

  /** Estado público do projeto — nunca "concluído". */
  status: {
    label: 'Protótipo jogável',
    detail: 'Em desenvolvimento ativo',
    badge: 'Em desenvolvimento',
  },

  /** Previsão, não data garantida. Fonte única do "2027". */
  demo: {
    year: 2027,
    label: 'Demo prevista para 2027',
    kicker: 'Próximo destino',
    note: 'Previsão sujeita a alterações conforme o desenvolvimento.',
    roadmapNote: 'As etapas e a previsão podem mudar durante o desenvolvimento.',
    description:
      'Estamos trabalhando para transformar o protótipo em uma experiência demonstrativa mais completa, com evolução das mecânicas, conteúdo narrativo e aprimoramentos visuais.',
  },

  category: 'Jogo indie brasileiro de simulação de vida, exploração e narrativa',

  hero: {
    headline: 'Bem-vindo à vida adulta.',
    subheadline: 'Diploma na mão. Boletos chegando. Emprego? Boa sorte.',
    description:
      'CLT Simulator é um jogo indie brasileiro de simulação de vida em pixel art, onde você acompanha Cleiton na difícil missão de conseguir um emprego, sobreviver aos boletos e enfrentar os absurdos da vida adulta.',
    complement:
      'Explore a casa, percorra o bairro, use o computador e o celular, candidate-se a vagas e descubra até onde Cleiton consegue chegar.',
  },

  character: {
    name: 'Cleiton',
    role: 'Protagonista',
    summary:
      'Um jovem brasileiro que estudou, conquistou diplomas e acreditou que sua formação garantiria um futuro profissional. A realidade do mercado foi outra.',
    situation:
      'Desempregado, ele precisa procurar oportunidades, lidar com as próprias despesas, enfrentar situações cotidianas e tentar salvar a casa onde vive com a mãe.',
    premise:
      'Cleiton fez tudo o que disseram que precisava fazer: estudou, conquistou diplomas e se preparou para o mercado de trabalho. Mas descobriu que conseguir um emprego pode ser mais difícil do que parecia. Com as contas chegando e a casa em risco, ele tem poucos dias para mudar sua situação.',
    deadline: 'Cinco dias para tentar conseguir um emprego e encontrar uma saída para a crise.',
  },

  /** Nomes oficiais dos sistemas do jogo — preservar grafia. */
  systems: {
    os: 'WinTário OS',
    jobNetwork: 'FudidIn',
    chat: 'ZapZap',
    mail: 'PomboMail',
    dating: 'Tinderella',
  },

  seo: {
    title: 'CLT Simulator — O simulador brasileiro da vida adulta',
    description:
      'Conheça CLT Simulator, um jogo indie brasileiro em pixel art sobre emprego, boletos e os desafios da vida adulta. Em desenvolvimento, com demo prevista para 2027.',
    /** Troque pelo domínio oficial quando ele existir. Vazio = sem canonical. */
    ogImage: '/assets/branding/clt-logo.png',
  },
} as const;

/** Destaques compactos logo abaixo do hero. */
export const highlights = [
  { icon: 'house', title: 'Explore uma casa brasileira', note: 'Seis cômodos, objetos e passagem do tempo.' },
  { icon: 'browser', title: 'Procure emprego no FudidIn', note: 'A rede profissional satírica do jogo.' },
  { icon: 'phone', title: 'Converse pelo ZapZap', note: 'Mensagens, notificações e acontecimentos.' },
  { icon: 'crt', title: 'Use o WinTário OS', note: 'Desktop, aplicativos e uma nostalgia de PC antigo.' },
  { icon: 'street', title: 'Descubra os eventos do bairro', note: 'Rua, veículos, pedestres e sons do cotidiano.' },
] as const satisfies readonly { icon: string; title: string; note: string }[];

/** Mecânicas principais da seção Jogo e Conceito. */
export const mechanics = [
  {
    icon: 'bed',
    title: 'Vida cotidiana',
    text: 'Explore a casa de Cleiton, interaja com os objetos e acompanhe a passagem do tempo.',
  },
  {
    icon: 'browser',
    title: 'Procura de emprego',
    text: 'Use o FudidIn, a rede profissional satírica do jogo, para encontrar vagas e enviar candidaturas.',
  },
  {
    icon: 'crt',
    title: 'Computador e WinTário',
    text: 'Interaja com um computador inspirado na experiência dos sistemas operacionais antigos, com desktop e aplicativos.',
  },
  {
    icon: 'phone',
    title: 'Celular e mensagens',
    text: 'Use o celular de Cleiton, converse pelo ZapZap, receba notificações e acompanhe acontecimentos.',
  },
  {
    icon: 'street',
    title: 'Rua e bairro',
    text: 'Explore um bairro brasileiro com pedestres, veículos, sons e acontecimentos cotidianos.',
  },
  {
    icon: 'letter',
    title: 'Escolhas e consequências',
    text: 'Acompanhe objetivos, eventos narrativos, despesas e situações que influenciam a jornada do personagem.',
  },
] as const satisfies readonly { icon: string; title: string; text: string }[];

/**
 * Galeria de desenvolvimento. Uma entrada só renderiza imagem quando
 * `src` aponta para um arquivo que existe em `public/assets/screenshots`.
 * Sem imagem, o card aparece como prévia pendente — nunca com imagem quebrada.
 */
export type GalleryEntry = {
  title: string;
  note: string;
  icon: string;
  src?: string;
  width?: number;
  height?: number;
};

export const gallery: GalleryEntry[] = [
  { title: 'Quarto do Cleiton', note: 'O ponto de partida de toda partida.', icon: 'bed' },
  { title: 'Casa', note: 'Cômodos, portas e a rotina com a mãe.', icon: 'house' },
  { title: 'Rua e bairro', note: 'Fachadas, calçadas e trânsito.', icon: 'street' },
  { title: 'WinTário OS', note: 'Desktop, boot e aplicativos.', icon: 'crt' },
  { title: 'FudidIn', note: 'Feed, vagas e candidaturas.', icon: 'browser' },
  { title: 'Celular', note: 'ZapZap, agenda e notificações.', icon: 'phone' },
];

export const aiNote = {
  title: 'Desenvolvimento assistido por IA',
  text: 'O CLT Simulator está sendo desenvolvido com o auxílio de diferentes ferramentas de inteligência artificial, utilizadas em programação, análise técnica, criação de sistemas e experimentação artística. As decisões de conceito, direção e desenvolvimento são conduzidas ao longo do processo de criação.',
};

export const devlog = {
  title: 'Acompanhe o desenvolvimento',
  text: 'Veja os bastidores da criação do CLT Simulator, suas mecânicas, sistemas e os desafios de desenvolver um jogo indie com auxílio de inteligência artificial.',
  empty: 'As atualizações do desenvolvimento entram no ar aqui assim que forem publicadas.',
};
