(() => {
 const sound=new Audio(new URL('../assets/link.mp3',document.currentScript.src));sound.preload='auto';sound.load();
 window.addEventListener('md:sound-change',()=>{if(!window.GN_SOUND_ENABLED)sound.pause();});
 const atoms=[...document.querySelectorAll('.tn-atom')];
 const about=atoms.find(el=>el.textContent.trim().toUpperCase().startsWith('РАБОТАЮ С ВЕБ ДИЗАЙНОМ'));
 const services=atoms.find(el=>el.textContent.trim().toUpperCase().startsWith('САЙТЫ, БРЕНДИНГ'));
 if(about)about.id='about';if(services)services.id='services';
 const style=document.createElement('style');style.textContent='.md-nav-link{transition:color .25s ease!important}.md-text-link{cursor:pointer}.md-talk-link .md-nav-random,.md-text-link .md-nav-random,.md-nav-link .md-nav-random,#md-sound-toggle .md-nav-random{color:#8950ff!important;-webkit-text-fill-color:#8950ff!important}';document.head.append(style);
 const talk=document.querySelector('[data-elem-id="1791120047222000001"] .tn-atom');
 if(talk){talk.classList.add('md-talk-link');talk.dataset.navLabel='Обсудить проект';}
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 document.querySelectorAll('.md-nav-link,.md-text-link,.md-talk-link,#md-sound-toggle').forEach(link=>{
   const target=link.id==='md-sound-toggle'?link.querySelector('.md-sound-label'):link.classList.contains('md-talk-link')?link.querySelector('.tn-atom__button-text'):link;
   let label=link.dataset.navLabel||target.textContent;let frame=0;
   function scramble(){
     cancelAnimationFrame(frame);
     if(link.id==='md-sound-toggle')label=window.GN_SOUND_ENABLED?'ЗВУК ВКЛ':'ЗВУК ВЫКЛ';
     if(window.GN_SOUND_ENABLED!==false){sound.currentTime=0;sound.play().catch(()=>{});}
     link.classList.add('is-scrambling');
     if(reduced.matches)return;
     const start=performance.now(),chars='АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЩЭЮЯ0123456789/#%';
     function tick(now){
       const p=Math.min(1,(now-start)/450),count=Math.floor(p*label.length);
       const fragment=document.createDocumentFragment();
       [...label].forEach((c,i)=>{
         const span=document.createElement('span');
         const random=i>=count && p<1;
         span.textContent=random?chars[Math.floor(Math.random()*chars.length)]:c;
         if(random){span.className='md-nav-random';span.style.setProperty('color','#8950ff','important');span.style.setProperty('-webkit-text-fill-color','#8950ff','important');}
         fragment.append(span);
       });
       target.replaceChildren(fragment);
       if(p<1)frame=requestAnimationFrame(tick);else {target.textContent=label;link.classList.remove('is-scrambling');}
     }
     frame=requestAnimationFrame(tick);
   }
   if(link.id==='md-sound-toggle')window.addEventListener('md:sound-change',()=>{cancelAnimationFrame(frame);label=window.GN_SOUND_ENABLED?'ЗВУК ВКЛ':'ЗВУК ВЫКЛ';link.classList.remove('is-scrambling');});
   link.addEventListener('pointerenter',scramble);link.addEventListener('focus',scramble);
   link.addEventListener('pointerleave',()=>{cancelAnimationFrame(frame);if(link.id==='md-sound-toggle')label=window.GN_SOUND_ENABLED?'ЗВУК ВКЛ':'ЗВУК ВЫКЛ';target.textContent=label;link.classList.remove('is-scrambling');});
   link.addEventListener('click',event=>{const href=link.getAttribute('href');if(!href)return;const target=document.querySelector(href);if(target){event.preventDefault();target.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'center'});history.replaceState(null,'',link.getAttribute('href'));}});
 });
})();
