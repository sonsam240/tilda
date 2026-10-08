(() => {
  window.GN_SOUND_ENABLED=true;
  try{window.GN_SOUND_ENABLED=localStorage.getItem('md-sound')!=='off';}catch{}
  const style=document.createElement('style');
  style.textContent=`html.md-head-hover,html.md-head-hover body{cursor:pointer!important}
  #md-sound-toggle{position:fixed;left:27.333333%;top:34px;transform:translateY(-50%);z-index:10000002;display:flex;align-items:center;gap:9px;border:0;padding:0;background:transparent;color:#111;font:12px 'JetBrains Mono',monospace;cursor:pointer;min-width:120px;justify-content:flex-start;touch-action:manipulation}
  #md-sound-toggle>*{pointer-events:none}
  .md-sound-bars{transform:translateY(-2px);display:flex;align-items:center;gap:2px;height:14px;width:18px}.md-sound-bars i{display:block;width:2px;height:5px;background:#111;transform-origin:center}
  .md-sound-label{transition:opacity .18s ease;white-space:nowrap}.md-sound-bars{opacity:0;transition:opacity .4s ease}#md-sound-toggle.md-sound-ready .md-sound-bars{opacity:1}
  `;
  document.head.append(style);
  const button=document.createElement('button');button.id='md-sound-toggle';button.type='button';button.className='scram';
  button.innerHTML='<span class="md-sound-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="md-sound-label tn-atom"></span>';
  let amplitude=window.GN_SOUND_ENABLED?1:0,frame=0,labelTimer;
  const label=button.querySelector('.md-sound-label'),bars=[...button.querySelectorAll('i')];
  function animate(now){
    frame=0;const goal=window.GN_SOUND_ENABLED?1:0;
    amplitude+=(goal-amplitude)*.075;
    bars.forEach((bar,i)=>bar.style.transform=`scaleY(${1+amplitude*(.75+Math.sin(now*.006+i*1.7)*.65)})`);
    if(goal||amplitude>.001)frame=requestAnimationFrame(animate);
  }
  function update(smooth=false){
    button.setAttribute('aria-pressed',String(window.GN_SOUND_ENABLED));
    const text=window.GN_SOUND_ENABLED?'ЗВУК ВКЛ':'ЗВУК ВЫКЛ';clearTimeout(labelTimer);
    if(smooth){label.style.opacity='0';labelTimer=setTimeout(()=>{label.textContent=text;label.style.opacity='1';},140);}else label.textContent=text;
    if(!frame)frame=requestAnimationFrame(animate);
  }
  function align(){
    const nav=document.querySelector('.md-nav-link');if(!nav)return;
    const font=getComputedStyle(nav),rect=nav.getBoundingClientRect();
    for(const property of ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','textTransform'])button.style[property]=font[property];
    const visualScale=rect.height/Math.max(1,nav.offsetHeight);
    button.style.fontSize=(parseFloat(font.fontSize)*visualScale)+'px';
    button.style.lineHeight=(parseFloat(font.lineHeight)*visualScale)+'px';
    label.style.font='inherit';label.style.color='inherit';label.style.lineHeight='inherit';
    button.style.top=(rect.top+rect.height*.5)+'px';
  }

  button.onclick=()=>{window.GN_SOUND_ENABLED=!window.GN_SOUND_ENABLED;try{localStorage.setItem('md-sound',window.GN_SOUND_ENABLED?'on':'off');}catch{}update(true);window.dispatchEvent(new Event('md:sound-change'));};
  update();document.body.append(button);align();window.addEventListener('resize',align);document.fonts?.ready.then(align);document.addEventListener('md:text-ready',()=>{button.classList.add('md-sound-ready');align();});
})();
