(() => {
  let previousTime=-1,origin=null,shaking=false;
  let shakeTargets=null;
  function shake(age){
    const kick=Math.exp(-age*12)*Math.max(0,1-age/.45);
    const sway=Math.max(0,1-age/.9)**2;
    const x=Math.sin(age*105)*12*kick+Math.sin(age*17)*3*sway;
    const y=Math.sin(age*87)*8*kick+Math.sin(age*13)*2*sway;
    const active=age>=0&&age<.9;
    if(!active&&!shaking)return;
    if(active!==shaking){document.documentElement.classList.toggle('md-shot-shaking',active);shaking=active;}
    shakeTargets??=['allrecords','md-sound-toggle'].map(id=>document.getElementById(id)).filter(Boolean);
    for(const el of shakeTargets)el.style.translate=active?`${x}px ${y}px`:'';
  }
  window.MD_FINGER_SHOT=state=>{
    if(!state||state.time<800){
      if(previousTime>=800)window.dispatchEvent(new CustomEvent('gn:echo-preview',{detail:null}));
      previousTime=state?.time??-1;origin=null;shake(10);return;
    }
    const age=(state.time-800)/1000;
    if(!origin)origin={x:innerWidth/2,y:innerHeight/2};
    if(state.playing&&previousTime<800){
      window.dispatchEvent(new CustomEvent('gn:character-impact',{detail:{...origin,shot:true}}));
    }
    window.dispatchEvent(new CustomEvent('gn:echo-preview',{detail:{...origin,age}}));
    shake(age);previousTime=state.time;
  };
})();
