import type { SpriteName } from './sprites';
import type { WorkStatus } from './game';

/**
 * Roadmap público, extraído de Roadmap-v1-CLT.html.
 * A classificação de cada frente e de cada sistema foi preservada.
 */

export type RoadmapItem = {
  icon: SpriteName;
  title: string;
  text: string;
  status: WorkStatus;
  items: readonly string[];
};

/** Bloco A — as oito frentes entregues no protótipo. */
export const builtFronts: readonly RoadmapItem[] = [
  {
    icon: 'bed', title: 'Base inicial', status: 'done',
    text: 'O quarto do Cleiton, o movimento, o relógio e os checkpoints diários que sustentam a partida.',
    items: ['Quarto do Cleiton', 'Movimento e interações', 'Relógio e tempo', 'Checkpoints diários'],
  },
  {
    icon: 'crt', title: 'WinTário OS', status: 'done',
    text: 'Um PC completo dentro do jogo, do boot ao desktop, com aplicativos que funcionam de verdade.',
    items: ['PC com boot e desktop', 'FudidIn e PomboMail', 'Snake e tela azul', 'Cold Start + Run Loop'],
  },
  {
    icon: 'phone', title: 'Celular', status: 'done',
    text: 'O telefone de Cleiton com conversas, agenda e notificações que reagem ao andamento do dia.',
    items: ['ZapZap e agenda', 'Notificações e bateria', 'Aplicativos no telefone', 'Mensagens e respostas'],
  },
  {
    icon: 'letter', title: 'Narrativa', status: 'done',
    text: 'A abertura, os diálogos e os eventos que transformam a procura por emprego em história.',
    items: ['Cutscene de abertura', 'Humor e diálogos', 'Eventos e candidaturas', 'Objetivo: emprego'],
  },
  {
    icon: 'house', title: 'Casa expandida', status: 'done',
    text: 'A residência cresceu: seis cômodos exploráveis, com portas, janela e objetos interativos.',
    items: ['Seis cômodos exploráveis', 'Mãe e objetos interativos', 'Portas e janela', 'Ambiente único da casa'],
  },
  {
    icon: 'street', title: 'Rua e bairro', status: 'done',
    text: 'Do portão para fora: um mapa animado com veículos, pedestres e música de carro passando.',
    items: ['Rua animada e mapa', 'Veículos e pedestres', 'Carros especiais e música', 'Ambiente externo'],
  },
  {
    icon: 'speaker', title: 'Áudio e refinos', status: 'done',
    text: 'Camadas de som por ambiente, de portas e passos ao loop da rua, com cache otimizado.',
    items: ['Menu, veículos e FudidIn', 'PC, casa e rua em loop', 'Som de portas e passos', 'Cache de áudio otimizado'],
  },
  {
    icon: 'checklist', title: 'Objetivos iniciais', status: 'done',
    text: 'A estrutura de metas que segura o jogador: tarefas obrigatórias, candidaturas e porta trancada.',
    items: ['Cinco ações obrigatórias', 'Cinco candidaturas no FudidIn', 'Porta bloqueada até cumprir', 'HUD contextual por cena'],
  },
] as const;

/** Bloco B — as doze áreas de sistema do protótipo. */
export const systemAreas: readonly RoadmapItem[] = [
  { icon: 'clock', title: 'Gameplay', status: 'active', text: '', items: ['Movimentação e câmera', 'Interações e portas', 'Tempo, pausa e ações'] },
  { icon: 'guy', title: 'Personagem', status: 'proto', text: '', items: ['Cleiton e animações', 'Roupas e guarda-roupa', 'Ações e idle'] },
  { icon: 'house', title: 'Casa', status: 'base', text: '', items: ['Quarto e corredor', 'Sala, cozinha, banheiro', 'Quarto da mãe'] },
  { icon: 'street', title: 'Rua', status: 'active', text: '', items: ['Bairro explorável', 'NPCs e mapa (M)', 'Travessias e calçadas'] },
  { icon: 'bus', title: 'Trânsito', status: 'proto', text: '', items: ['Carros, motos e ônibus', 'Pedestres e trajetórias', 'Veículos musicais'] },
  { icon: 'crt', title: 'WinTário', status: 'base', text: '', items: ['Desktop e inicialização', 'PomboMail e aplicativos', 'BSOD e reinicialização'] },
  { icon: 'browser', title: 'FudidIn', status: 'active', text: '', items: ['Feed, vagas e mensagens', 'Candidaturas e progresso', 'Música do aplicativo'] },
  { icon: 'phone', title: 'Celular', status: 'proto', text: '', items: ['ZapZap e agenda', 'Notificações e bateria', 'Outros apps do telefone'] },
  { icon: 'letter', title: 'Narrativa', status: 'base', text: '', items: ['Cutscene e diálogos', 'Eventos e mensagens', 'Sátira brasileira'] },
  { icon: 'checklist', title: 'Objetivos', status: 'active', text: '', items: ['Objetivo: emprego', '5 tarefas antes de sair', 'Progresso de candidaturas'] },
  { icon: 'speaker', title: 'Áudio', status: 'proto', text: '', items: ['Ambientes casa e rua', 'PC, portas e passos', 'Música e cache sob demanda'] },
  { icon: 'coin', title: 'Estado + HUD', status: 'base', text: '', items: ['GameState e checkpoint', 'Saldo, aluguel e relógio', 'Game Over e interfaces'] },
] as const;

/** Bloco C — as nove frentes planejadas. A última é o marco da expansão. */
export const plannedFronts: readonly RoadmapItem[] = [
  { icon: 'polish', title: 'Polimento de cenários', status: 'planned', text: 'Mais objetos interativos e mais vida na casa e no bairro.', items: [] },
  { icon: 'busstop', title: 'Ponto de ônibus', status: 'planned', text: 'Transporte funcional para chegar até a vaga de emprego.', items: [] },
  { icon: 'bandit', title: 'Mecânica de assalto', status: 'planned', text: 'Perigos durante a exploração, com possível Game Over.', items: [] },
  { icon: 'diary', title: 'Diário de missões', status: 'planned', text: 'Missões concluídas, em andamento e estatísticas da partida.', items: [] },
  { icon: 'flag', title: 'Subquests do bairro', status: 'planned', text: 'Histórias, encontros locais, favores e consequências.', items: [] },
  { icon: 'scales', title: 'Balanceamento', status: 'planned', text: 'Economia, ritmo da partida, dificuldade e recompensas.', items: [] },
  { icon: 'beggar', title: 'Pedintes e golpes', status: 'planned', text: 'Pedir ajuda na rua: um evento que pode ser legítimo ou golpe.', items: [] },
  { icon: 'heartphone', title: 'Tinderella funcional', status: 'planned', text: 'App integrado ao celular, com interações e novos eventos.', items: [] },
] as const;

export const nextMilestone: RoadmapItem = {
  icon: 'office',
  title: 'Entrevista presencial',
  status: 'planned',
  text: 'O primeiro grande passo da expansão atual: Cleiton sai da tela do computador e entra na sala de espera.',
  items: ['Novo cenário da empresa', 'Primeira entrevista de Cleiton'],
};

/** Bloco D — evolução gráfica. */
export const artUpgrade = {
  intro:
    'O protótipo atual utiliza gráficos procedurais e uma identidade pixel art inicial. O projeto prevê uma evolução artística dos cenários, móveis, personagens e veículos, com materiais mais detalhados, iluminação aprimorada e maior consistência visual.',
  flag: 'Arte provisória — sistemas já funcionam',
  areas: [
    { icon: 'palette', title: 'Direção de arte', items: ['Padrão artístico consistente', 'Pixel art detalhada e profissional', 'Proporções, paleta e contornos', 'Identidade brasileira preservada'] },
    { icon: 'material', title: 'Texturas e materiais', items: ['Cada material com aparência própria', 'Madeira, concreto, tecido, metal, vidro', 'Variações discretas e desgaste', 'Superfícies menos artificiais'] },
    { icon: 'lamp', title: 'Iluminação e sombras', items: ['Sombras de contato em móveis e objetos', 'Mais profundidade nos cenários', 'Luz coerente com cada ambiente', 'Atmosfera própria de dia e de noite'] },
    { icon: 'sofa', title: 'Interiores detalhados', items: ['Refino do quarto do Cleiton', 'Melhor acabamento dos móveis', 'Evolução dos demais cômodos', 'Mais personalidade ambiental'] },
    { icon: 'street', title: 'Rua e bairro', items: ['Fachadas com materiais convincentes', 'Calçadas e asfalto com refino', 'Sombras e profundidade nas construções', 'Ambientação urbana brasileira'] },
    { icon: 'guy', title: 'Personagens e veículos', items: ['Cleiton e NPCs refinados', 'Silhuetas e proporções melhores', 'Mais volume e expressividade', 'Veículos com acabamento coerente'] },
  ] as const satisfies readonly { icon: SpriteName; title: string; items: readonly string[] }[],
} as const;

export const artPhases = [
  {
    icon: 'crt', name: 'PoC / MVP', status: 'done', current: true,
    items: ['Protótipo funcional', 'Arte inicial', 'Validação das mecânicas'],
  },
  {
    icon: 'tile', name: 'Refinamento artístico', status: 'planned', current: false,
    items: ['Redesign de assets', 'Texturas e materiais', 'Iluminação', 'Cenários mais detalhados'],
  },
  {
    icon: 'sparkle', name: 'Polimento visual', status: 'planned', current: false,
    items: ['Identidade consolidada', 'Personagens refinados', 'Cenários e veículos consistentes', 'Acabamento mais maduro'],
  },
] as const satisfies readonly { icon: SpriteName; name: string; status: WorkStatus; current: boolean; items: readonly string[] }[];

/** Contagens exibidas nos HUDs — derivadas dos dados acima, nunca digitadas. */
export const counts = {
  built: builtFronts.length,
  systems: systemAreas.length,
  planned: plannedFronts.length + 1,
  art: artUpgrade.areas.length,
} as const;
