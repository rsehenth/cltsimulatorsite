/**
 * A ficha de inscrição: o carimbo.
 * Sem JavaScript a ficha já aparece preenchida e carimbada; aqui o visitante
 * pode carimbar de novo. O botão é criado por este arquivo, então nunca
 * existe um controle que finge funcionar.
 * Arquivo externo de propósito: mantém a CSP em script-src 'self'.
 */
const sheet = document.querySelector('[data-stamp]');
const slot = document.querySelector('[data-slot]');

if (sheet && slot) {
  slot.hidden = false;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ficha__button';
  button.textContent = 'Carimbar candidatura';

  const count = document.createElement('p');
  count.className = 'ficha__count';
  /* Região viva: o texto muda depois do clique, e mudança tardia de
     texto não é anunciada sozinha. */
  count.setAttribute('role', 'status');
  count.textContent = 'Carimbo já aplicado.';

  slot.append(button, count);

  let hits = 0;
  button.addEventListener('click', () => {
    hits += 1;
    sheet.classList.remove('is-hitting');
    void sheet.offsetWidth;
    sheet.classList.add('is-hitting');
    count.textContent =
      hits === 1
        ? 'Primeiro carimbo do dia. Ainda há boleto pela frente.'
        : `Você levou ${hits} carimbadas aqui dentro.`;
  });
}
