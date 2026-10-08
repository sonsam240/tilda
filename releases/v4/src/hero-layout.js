t_onFuncLoad('t396_initialScale',function() {t396_initialScale('4460683201');});t_onReady(function() {t_onFuncLoad('t396_init',function() {t396_init('4460683201');});});

(() => {
  function fit(){
    const art=document.querySelector('#md-hybrid-shell .t396__artboard');
    const elem=art?.querySelector('.tn-elem');if(!art||!elem)return;
    const scale=parseFloat(getComputedStyle(elem).zoom)||1;
    const height=Number(art.getAttribute('data-artboard-height'))*scale;
    art.style.height=height+'px';
    for(const node of art.querySelectorAll('.t396__carrier,.t396__filter'))node.style.height=height+'px';
  }
  const schedule=()=>requestAnimationFrame(()=>requestAnimationFrame(fit));
  window.MD_ON_READY(schedule);window.addEventListener('resize',schedule,{passive:true});
})();
