(() => {
  const links = ['Работы','Услуги','Обо мне'].map(label => document.querySelector(`[data-nav-label="${label}"]`));
  const cta = document.querySelector('.md-text-link');
  const arrow = document.querySelector('[data-elem-id="1791097995971"]');
  function moveTo(element, x, y) {
    const rect = element.getBoundingClientRect();
    const scale = rect.height / Math.max(1, element.offsetHeight);
    if (!Number.isFinite(scale) || scale <= 0) return;
    element.style.setProperty('left', (parseFloat(getComputedStyle(element).left) + (x - rect.left) / scale) + 'px', 'important');
    if (y !== undefined) element.style.setProperty('top', (parseFloat(getComputedStyle(element).top) + (y - rect.top) / scale) + 'px', 'important');
  }
  function align() {
    const talk=document.querySelector('[data-elem-id="1791120047222000001"]');
    const edge=document.querySelector('.msk .tn-atom');
    if(talk&&edge)moveTo(talk,edge.getBoundingClientRect().right-talk.getBoundingClientRect().width);
    if (links.every(Boolean)) {
      const first = links[0].getBoundingClientRect();
      const scale = first.height / Math.max(1, links[0].offsetHeight);
      let right = first.right;
      links.slice(1).forEach(link => {
        moveTo(link.closest('.tn-elem'), right + 20 * scale, first.top);
        right = link.getBoundingClientRect().right;
      });
    }
    if (cta && arrow) {
      const rect = cta.getBoundingClientRect(), scale = rect.height / Math.max(1, cta.offsetHeight);
      moveTo(arrow, rect.right + 8 * scale, rect.top + (rect.height - arrow.getBoundingClientRect().height) / 2);
    }
  }
  window.addEventListener('load', align);
  window.addEventListener('resize', () => requestAnimationFrame(align));
  document.addEventListener('md:text-ready', align);
  document.addEventListener('md:gallery-ready', align);
  document.fonts?.ready.then(align);
  align();
})();
