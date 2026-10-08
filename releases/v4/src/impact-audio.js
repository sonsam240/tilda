(() => {
  const source = new URL('../assets/pulse.mp3', document.currentScript.src).href;
  const voices = Array.from({length: 4}, () => {
    const audio = new Audio(source);
    audio.preload = 'auto';
    audio.load();
    return audio;
  });
  window.addEventListener('md:sound-change',()=>{if(!window.GN_SOUND_ENABLED)voices.forEach(a=>a.pause());});
  let next = 0;
  window.addEventListener('gn:character-impact', () => {
    if(window.GN_SOUND_ENABLED===false)return;
    const audio = voices[next];
    next = (next + 1) % voices.length;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
})();
