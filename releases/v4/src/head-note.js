(() => {
  const message=window.MD_RU_TEXT(document.querySelector('#md-project-content [data-speech-key=HEAD_NOTE]').textContent.trim());
  const bubble=document.createElement('div');bubble.id='md-head-note';bubble.setAttribute('role','status');bubble.setAttribute('aria-label',message);
  const text=document.createElement('span');text.setAttribute('aria-hidden','true');bubble.append(text);document.body.append(bubble);
  let anchor=null;
  window.MD_HEAD_NOTE=state=>{
    if(!state){bubble.style.opacity='0';anchor=null;return;}
    if(!anchor){bubble.style.width='';bubble.style.minHeight='';text.textContent=message;const rect=bubble.getBoundingClientRect(),half=rect.width/2;bubble.style.width=rect.width+'px';bubble.style.minHeight=rect.height+'px';anchor={x:Math.max(half+16,Math.min(innerWidth-half-16,state.x)),y:Math.max(rect.height+70,state.y+24)};}
    bubble.style.left=`${anchor.x}px`;bubble.style.top=`${anchor.y}px`;
    const appear=Math.min(1,state.time/350),fade=1-Math.max(0,Math.min(1,(state.time-5300)/800));
    bubble.style.opacity=String(appear*fade);
    bubble.style.transform='translate(-50%,-100%)';

  };
})();
