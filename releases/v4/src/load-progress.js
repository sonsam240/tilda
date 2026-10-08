(() => {
 const indicator=document.createElement('div');indicator.id='md-load-progress';indicator.textContent='0%';indicator.setAttribute('role','progressbar');indicator.setAttribute('aria-label','Загрузка страницы');indicator.setAttribute('aria-valuemin','0');indicator.setAttribute('aria-valuemax','100');
 const style=document.createElement('style');style.textContent='#md-load-progress{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:10000003;color:#111;font:500 16px/1.2 "JetBrains Mono",monospace;pointer-events:none;transition:opacity .4s ease}';document.head.append(style);document.body.append(indicator);
 let ready=false,value=0,lastTime=performance.now(),finishResolve;
 function draw(now){
   const images=[...document.images],resources=[...document.querySelectorAll('script[src],link[rel=stylesheet]')].map(el=>el.src||el.href);
   const loaded=new Set(performance.getEntriesByType('resource').filter(r=>r.responseEnd>0).map(r=>r.name));
   const done=images.filter(i=>i.complete).length+resources.filter(url=>loaded.has(url)).length;
   const goal=ready?100:Math.min(90,Math.round(90*done/Math.max(1,images.length+resources.length)));
   const delta=Math.min(50,now-lastTime);lastTime=now;
   value=Math.min(goal,value+delta*.12);
   indicator.textContent=Math.floor(value)+'%';indicator.setAttribute('aria-valuenow',String(Math.floor(value)));
   const nav=document.querySelector('.md-nav-link');if(nav){const font=getComputedStyle(nav),rect=nav.getBoundingClientRect();indicator.style.fontFamily=font.fontFamily;indicator.style.fontWeight=font.fontWeight;indicator.style.fontSize=(parseFloat(font.fontSize)*rect.height/Math.max(1,nav.offsetHeight))+'px';}
   if(ready&&value>=100){indicator.style.opacity='0';setTimeout(()=>{indicator.remove();finishResolve?.();},400);return;}
   requestAnimationFrame(draw);
 }
 window.MD_FINISH_LOAD=()=>{ready=true;return new Promise(resolve=>{finishResolve=resolve;});};
 requestAnimationFrame(draw);
})();
