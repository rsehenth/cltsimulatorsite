/**
 * Entrada escalonada dos blocos ao entrar na viewport.
 * Melhoria progressiva: os estados escondidos só existem depois que este
 * arquivo roda, então sem JavaScript nada fica invisível para o visitante.
 * Arquivo externo de propósito: mantém a CSP em script-src 'self'.
 */
const targets = Array.from(document.querySelectorAll('[data-reveal]'));
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (targets.length > 0 && !reduce && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => {
    /* O atraso é relativo aos irmãos do mesmo grupo: título, texto e
       imagem entram em cascata, não todos juntos. */
    const group = el.parentElement
      ? Array.from(el.parentElement.children).filter((n) => n.hasAttribute('data-reveal'))
      : [];
    const step = Math.max(0, group.indexOf(el));
    el.classList.add('reveal', `is-d${Math.min(step, 4)}`);
    observer.observe(el);
  });
}
