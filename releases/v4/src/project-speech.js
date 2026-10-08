(() => {
  const messages=Object.fromEntries([...document.querySelectorAll('#md-project-content [data-speech-key]')].map(el=>[el.dataset.speechKey,el.textContent.trim()]));
  const bubble = document.createElement('div');
  bubble.id = 'md-project-speech';
  bubble.setAttribute('role', 'status');
  const text = document.createElement('span');
  text.setAttribute('aria-hidden', 'true');
  bubble.append(text);
  document.body.append(bubble);
  const style = document.createElement('style');
  style.textContent = `#md-project-speech{visibility:hidden;transition:opacity .35s ease,visibility 0s .35s;}#md-project-speech.visible{opacity:1;visibility:visible;transform:translate(-50%,-100%);transition:opacity .35s ease,visibility 0s;}`;
  document.head.append(style);
  let active = '', anchor = null, timer = null;
  function position() {
    if (!anchor) return;
    const half = bubble.getBoundingClientRect().width / 2;
    bubble.style.left = Math.max(half + 16, Math.min(innerWidth - half - 16, anchor.x)) + 'px';
    bubble.style.top = Math.max(bubble.getBoundingClientRect().height + 70, anchor.y + 24) + 'px';
  }
  window.MD_PROJECT_SPEECH = (key, {delay = 0} = {}) => {
    const message = window.MD_RU_TEXT(messages[key]);
    if (active === key && message) return;
    clearTimeout(timer);
    active = message ? key : '';
    if (!message) { bubble.classList.remove('visible'); anchor = null; return; }
    bubble.classList.remove('visible');
    const show = () => {
    if (active !== key) return;
    anchor = window.MD_HEAD_ANCHOR ? {...window.MD_HEAD_ANCHOR} : {x:innerWidth / 2, y:innerHeight * .3};
    bubble.setAttribute('aria-label', message);
    bubble.style.width='';bubble.style.minHeight='';
    text.textContent = message;
    const size=bubble.getBoundingClientRect();
    bubble.style.width=size.width+'px';bubble.style.minHeight=size.height+'px';
    position();
    bubble.classList.add('visible');
    };
    if (delay > 0) timer = setTimeout(show, delay);
    else show();
  };
  document.querySelectorAll('.md-nav-link').forEach(link => {
    const key = {'РАБОТЫ':'WORKS','УСЛУГИ':'SERVICES','ОБО МНЕ':'ABOUT'}[link.dataset.navLabel?.trim().toUpperCase()];
    if (!messages[key]) return;
    const show = () => window.MD_PROJECT_SPEECH(key);
    const hide = () => { if (active === key) window.MD_PROJECT_SPEECH(null); };
    link.addEventListener('pointerenter', show);
    link.addEventListener('pointerleave', hide);
    link.addEventListener('focus', show);
    link.addEventListener('blur', hide);
  });
  window.addEventListener('resize', position);
})();
