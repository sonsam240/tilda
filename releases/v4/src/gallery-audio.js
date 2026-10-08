(() => {
  const base = document.currentScript.src;
  const make = name => {const audio = new Audio(new URL('../assets/'+name+'.mp3',base));audio.preload='auto';audio.load();return audio;};
  const choices = Array.from({length:4},()=>make('chose'));
  const context=new (window.AudioContext||window.webkitAudioContext)();
  let clickBuffer,choice=0,stopTimer,repeatTimer,scrollSpeed=0,lastScroll=0;
  const decoded=fetch(new URL('../assets/slider.mp3',base)).then(r=>r.arrayBuffer()).then(data=>context.decodeAudioData(data)).then(buffer=>{
    const samples=buffer.getChannelData(0),rate=buffer.sampleRate,windowSize=Math.floor(rate*.008);
    let peak=0,start=0;
    for(let i=0;i<Math.min(samples.length,rate*.8);i+=windowSize){
      let energy=0;for(let j=i;j<Math.min(i+windowSize,samples.length);j++)energy+=samples[j]*samples[j];
      if(energy>peak){peak=energy;start=i;}
    }
    start=Math.max(0,start-Math.floor(rate*.006));
    const length=Math.min(Math.floor(rate*.065),buffer.length-start);
    clickBuffer=context.createBuffer(buffer.numberOfChannels,length,rate);
    for(let ch=0;ch<buffer.numberOfChannels;ch++){
      const out=clickBuffer.getChannelData(ch),input=buffer.getChannelData(ch);
      for(let i=0;i<length;i++)out[i]=input[start+i]*Math.min(1,i/(rate*.002),(length-i)/(rate*.003));
    }
  }).catch(()=>{});
  function click(){if(!clickBuffer||context.state!=='running')return;const node=context.createBufferSource();node.buffer=clickBuffer;const gain=context.createGain();gain.gain.value=.12+.65*Math.min(1,scrollSpeed/35);node.connect(gain);gain.connect(context.destination);node.start();}
  function stop(){clearTimeout(repeatTimer);repeatTimer=null;}

  document.addEventListener('pointerover',event=>{
    if(window.GN_SOUND_ENABLED===false)return;
    const card=event.target.closest('.md-work-card');
    if(!card || card.contains(event.relatedTarget))return;
    if(document.getElementById('md-work-slider')?.dataset.mdIntro!=='ready')return;
    const audio=choices[choice++ % choices.length];audio.currentTime=0;audio.play().catch(()=>{});
  });
  function repeat(){
    const age=performance.now()-lastScroll;
    if(age>140){stop();return;}
    click();repeatTimer=setTimeout(repeat,Math.max(35,160-125*Math.min(1,scrollSpeed/35)));
  }
  window.addEventListener('md:gallery-scroll-sound',event=>{
    if(window.GN_SOUND_ENABLED===false)return;
    context.resume().catch(()=>{});
    scrollSpeed=event.detail?.speed||0;lastScroll=performance.now();
    clearTimeout(stopTimer);
    if(!repeatTimer)repeat();
    stopTimer=setTimeout(stop,150);
  });
  window.addEventListener('md:sound-change',()=>{if(!window.GN_SOUND_ENABLED){stop();choices.forEach(a=>a.pause());context.suspend();}});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){clearTimeout(stopTimer);stop();}});
})();
