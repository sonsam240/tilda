(()=>{
 window.GN_ECHO_SETTINGS={enabled:true,opacity:1,strength:3,speed:1.3,width:.08,duration:1.6};
 window.MD_ON_READY(()=>{
 const layer=document.createElement('div');layer.setAttribute('aria-hidden','true');layer.id='md-light-echo';
 Object.assign(layer.style,{position:'absolute',inset:'0',overflow:'hidden',pointerEvents:'none',zIndex:'0',contain:'strict'});
 const ring=document.createElement('div');
 Object.assign(ring.style,{position:'absolute',width:'512px',height:'512px',borderRadius:'50%',opacity:'0',background:'radial-gradient(ellipse at 28% 25%,rgba(244,157,218,.38),transparent 72%),radial-gradient(ellipse at 76% 30%,rgba(177,159,244,.36),transparent 74%),radial-gradient(ellipse at 80% 76%,rgba(143,194,245,.34),transparent 76%),radial-gradient(ellipse at 25% 78%,rgba(155,232,216,.3),transparent 74%),radial-gradient(ellipse at 45% 18%,rgba(247,224,176,.25),transparent 78%)',maskImage:'radial-gradient(circle closest-side,transparent 17%,rgba(0,0,0,.025) 27%,rgba(0,0,0,.1) 36%,rgba(0,0,0,.3) 45%,rgba(0,0,0,.6) 53%,rgba(0,0,0,.72) 59%,rgba(0,0,0,.6) 65%,rgba(0,0,0,.32) 72%,rgba(0,0,0,.1) 79%,rgba(0,0,0,.02) 86%,transparent 94%)',WebkitMaskImage:'radial-gradient(circle closest-side,transparent 17%,rgba(0,0,0,.025) 27%,rgba(0,0,0,.1) 36%,rgba(0,0,0,.3) 45%,rgba(0,0,0,.6) 53%,rgba(0,0,0,.72) 59%,rgba(0,0,0,.6) 65%,rgba(0,0,0,.32) 72%,rgba(0,0,0,.1) 79%,rgba(0,0,0,.02) 86%,transparent 94%)',transformOrigin:'center'});
 layer.append(ring);document.getElementById('md-page').prepend(layer);let animation=null,preview=false;
 function start(detail={},paused=false){
  animation?.cancel();
  const x=detail.x??innerWidth/2,y=detail.y??innerHeight/2;
  const bounds=layer.getBoundingClientRect();ring.style.left=(x-bounds.left-256)+'px';ring.style.top=(y-bounds.top-256)+'px';ring.style.willChange='transform,opacity';
  const scale=Math.hypot(Math.max(x,innerWidth-x),Math.max(y,innerHeight-y))/200;
  animation=ring.animate([{transform:'scale(.06) rotate(0deg)',opacity:0},{transform:'scale(.2) rotate(2deg)',opacity:.85,offset:.04},{transform:`scale(${scale*.55}) rotate(12deg)`,opacity:.58,offset:.55},{transform:`scale(${scale}) rotate(24deg)`,opacity:0}],{duration:window.GN_ECHO_SETTINGS.duration*1000,easing:'linear',fill:'none'});
  animation.onfinish=()=>{ring.style.willChange='auto';};
  if(paused)animation.pause();
 }
 window.addEventListener('gn:character-impact',event=>{if(!window.GN_ECHO_SETTINGS.enabled)return;preview=false;start(event.detail);});
 window.addEventListener('gn:echo-preview',event=>{
  const detail=event.detail;
  if(!detail){if(preview)animation?.play();preview=false;return;}
  if(!window.GN_ECHO_SETTINGS.enabled)return;
  if(!preview){start(detail,true);preview=true;}
  animation.currentTime=Math.max(0,detail.age*1000);
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden){animation?.cancel();preview=false;ring.style.willChange='auto';}});
 });
})();