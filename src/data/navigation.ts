/** Navegação principal: uma página, três seções, âncoras nativas. */
export type NavItem = {
  id: 'home' | 'jogo' | 'roadmap';
  href: string;
  label: string;
  hint: string;
};

export const navigation: readonly NavItem[] = [
  { id: 'home', href: '#home', label: 'Home', hint: 'O jogo em uma tela' },
  { id: 'jogo', href: '#jogo', label: 'Jogo e Conceito', hint: 'Quem é Cleiton' },
  { id: 'roadmap', href: '#roadmap', label: 'Roadmap', hint: 'O que já saiu e o que vem' },
] as const;
