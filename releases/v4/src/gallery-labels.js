(() => {
  const frames = new WeakMap();
  let active = null;
  const style = document.createElement('style');
  style.textContent = '.md-work-card__title .md-gallery-random{color:#8950ff!important;-webkit-text-fill-color:#8950ff!important}';
  document.head.append(style);
  function animate(card, label) {
    const title = card.querySelector('.md-work-card__title');
    if (!title) return;
    cancelAnimationFrame(frames.get(title));
    const start = performance.now(), chars = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789/#%';
    function tick(now) {
      const progress = Math.min(1, (now - start) / 450);
      if (progress >= 1) { title.textContent = label; frames.delete(title); return; }
      const settled = Math.floor(progress * label.length);
      const fragment = document.createDocumentFragment();
      [...label].forEach((character, index) => {
        const span = document.createElement('span');
        const random = index >= settled && character !== ' ';
        span.textContent = random ? chars[Math.floor(Math.random() * chars.length)] : character;
        if (random) span.className = 'md-gallery-random';
        fragment.append(span);
      });
      title.replaceChildren(fragment);
      frames.set(title, requestAnimationFrame(tick));
    }
    tick(start);
  }
  function restore(card) {
    const title = card?.querySelector('.md-work-card__title');
    if (title?.dataset.projectTitle) animate(card, title.dataset.projectTitle);
  }
  document.addEventListener('pointerover', event => {
    const card = event.target.closest('.md-work-card');
    if (!card || card === active || window.MD_INTRO_SEQUENCE?.phase !== 'ready') return;
    restore(active);
    active = card;
    animate(card, 'Открыть проект');
  });
  document.addEventListener('pointerout', event => {
    if (!active || event.target.closest('.md-work-card') !== active || active.contains(event.relatedTarget)) return;
    restore(active);
    active = null;
  });
})();
