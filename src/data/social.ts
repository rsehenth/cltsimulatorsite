/**
 * Redes sociais oficiais. Preencha apenas com URLs reais e publicadas.
 * Uma entrada sem URL válida não aparece no site — nem como botão cinza,
 * nem como link para um perfil que não existe.
 */
export type SocialLink = {
  key: string;
  label: string;
  handle?: string;
  url?: string;
};

export const socialLinks: readonly SocialLink[] = [
  { key: 'youtube', label: 'YouTube', url: '' },
  { key: 'x', label: 'X', url: '' },
  { key: 'instagram', label: 'Instagram', url: '' },
  { key: 'discord', label: 'Discord', url: '' },
  { key: 'bluesky', label: 'Bluesky', url: '' },
] as const;

/** Só aceita http/https absoluto; rejeita placeholders e URLs relativas. */
export function validLinks(links: readonly SocialLink[] = socialLinks): SocialLink[] {
  return links.filter((link) => {
    const raw = link.url?.trim();
    if (!raw) return false;
    try {
      const url = new URL(raw);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch {
      return false;
    }
  });
}
