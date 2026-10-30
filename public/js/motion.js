/**
 * Movimento ligado a scroll. Melhoria progressiva, como reveal.js: os estados
 * escondidos só nascem depois que este arquivo roda e adiciona .js ao <html>,
 * então sem JavaScript — ou com prefers-reduced-motion — nada é ocultado.
 * Arquivo externo de propósito: a CSP mantém script-src 'self'.
 *
 * Um único listener de scroll e um único requestAnimationFrame para todos os
 * efeitos ligados a progresso. O valor exibido persegue o alvo (lerp); nunca
 * salta direto.
 */
const LERP_SPINE = 0.12;
const LERP_BAR = 0.14;
const SETTLE = 0.001;
const TILT_MAX = 2;

const clamp01 = (n) => Math.min(1, Math.max(0, n));
const lerp = (a, b, t) => a + (b - a) * t;

/* O painel de status e a espinha da timeline compartilham um observer. */
function observe(nodes, onEntry) {
  if (!('IntersectionObserver' in window)) return null;
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) onEntry(entry);
    },
    { threshold: [0, 0.25] },
  );
  nodes.forEach((node) => io.observe(node));
  return io;
}

/* Tilt de até 2° nos painéis do roadmap. Só escreve duas variáveis de ângulo
   por CSSOM — o transform vive no CSS, junto do retorno de 0,45 s. Em toque
   nada é ligado: sem ponteira fina o gesto de rolar competiria com o tilt. */
function initTilt() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const panel of document.querySelectorAll('.front__panel')) {
    const reset = () => {
      panel.style.setProperty('--tilt-x', '0');
      panel.style.setProperty('--tilt-y', '0');
    };
    panel.addEventListener('pointermove', (ev) => {
      const r = panel.getBoundingClientRect();
      const dx = (ev.clientX - r.left) / r.width - 0.5;
      const dy = (ev.clientY - r.top) / r.height - 0.5;
      panel.style.setProperty('--tilt-y', (dx * 2 * TILT_MAX).toFixed(2));
      panel.style.setProperty('--tilt-x', (-dy * 2 * TILT_MAX).toFixed(2));
    });
    panel.addEventListener('pointerleave', reset);
    panel.addEventListener('blur', reset, true);
    reset();
  }
}

function initMotion() {
  const root = document.documentElement;
  root.classList.add('js');

  /* ---------- Linha da timeline desenhando ---------- */
  const spines = [...document.querySelectorAll('.timeline__spine')].map((el) => {
    el.style.setProperty('--spine-p', '0');
    return {
      el,
      steps: [...el.children],
      shown: 0,
      target: 0,
      onScreen: true,
    };
  });

  /* ---------- Barra de progresso do sistema ---------- */
  const fill = document.querySelector('[data-sysbar-fill]');
  /* A seção atual marca o próprio link da navegação (is-current), em vez de
     um rótulo solto no canto que repetia o texto do menu. */
  const sections = [...document.querySelectorAll('.nav__link')]
    .map((link) => {
      const target = document.querySelector(link.getAttribute('href') || '');
      return target ? { target, link } : null;
    })
    .filter(Boolean);

  let barTarget = 0;
  let barShown = 0;
  let currentLink = null;

  const read = () => {
    const vh = window.innerHeight;

    for (const s of spines) {
      if (!s.onScreen) continue;
      const r = s.el.getBoundingClientRect();
      /* Começa a desenhar quando o topo cruza 80% da janela e termina quando
         o fim chega a 45% — a linha nunca some antes de o bloco sair da tela. */
      const span = r.height + vh * 0.35;
      s.target = clamp01((vh * 0.8 - r.top) / span);
    }

    const max = root.scrollHeight - vh;
    barTarget = max > 0 ? clamp01(window.scrollY / max) : 0;

    if (sections.length > 0) {
      const mid = vh * 0.4;
      let active = sections[0];
      for (const section of sections) {
        if (section.target.getBoundingClientRect().top <= mid) active = section;
      }
      if (active.link !== currentLink) {
        if (currentLink) {
          currentLink.classList.remove('is-current');
          currentLink.removeAttribute('aria-current');
        }
        currentLink = active.link;
        currentLink.classList.add('is-current');
        currentLink.setAttribute('aria-current', 'location');
      }
    }
  };

  let raf = 0;
  const tick = () => {
    raf = 0;
    let moving = false;

    for (const s of spines) {
      s.shown = lerp(s.shown, s.target, LERP_SPINE);
      if (Math.abs(s.target - s.shown) < SETTLE) s.shown = s.target;
      else moving = true;
      s.el.style.setProperty('--spine-p', s.shown.toFixed(4));

      /* O marcador acende com o preenchimento já passado por ele: usar o
         valor exibido, e não o alvo, é o que impede a luz de chegar antes. */
      const reached = Math.round(s.shown * s.steps.length);
      s.steps.forEach((li, i) => li.classList.toggle('is-passed', i < reached));
    }

    if (fill) {
      barShown = lerp(barShown, barTarget, LERP_BAR);
      if (Math.abs(barTarget - barShown) < SETTLE) barShown = barTarget;
      else moving = true;
      fill.style.setProperty('--p', barShown.toFixed(4));
    }

    if (moving) raf = requestAnimationFrame(tick);
  };

  const schedule = () => {
    read();
    if (!raf) raf = requestAnimationFrame(tick);
  };

  if (spines.length > 0) {
    observe(spines.map((s) => s.el), (entry) => {
      const s = spines.find((item) => item.el === entry.target);
      if (!s) return;
      s.onScreen = entry.isIntersecting;
      if (s.onScreen) schedule();
    });
  }

  const panel = document.querySelector('.hud__panel');
  if (panel) {
    /* Observa o contêiner, não o painel: o painel nasce recortado (clip-path
       fechado) e o navegador mede a interseção do que está visível — um
       recorte de altura zero nunca "entra na tela", então o painel nunca
       abriria. */
    const boot = observe([panel.parentElement || panel], (entry) => {
      if (!entry.isIntersecting) return;
      panel.classList.add('is-boot');
      boot.disconnect();
    });
    /* Sem IntersectionObserver o painel abre na hora: estado escondido que
       ninguém pode ligar é conteúdo perdido. */
    if (!boot) panel.classList.add('is-boot');
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
  initTilt();
}

const start = () => {
  /* Reduzir movimento desliga tudo: sem a classe .js nenhum estado escondido
     é criado, e o site fica exatamente como é sem script. */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  initMotion();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start, { once: true });
} else {
  start();
}
