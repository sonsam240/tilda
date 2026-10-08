(() => {
  if(window.MD_HYBRID_STARTED)return;
  window.MD_HYBRID_STARTED=true;
  const root=new URL('./',document.currentScript.src);
  window.MD_ON_READY=fn=>document.readyState==='loading'
    ?document.addEventListener('DOMContentLoaded',fn,{once:true}):queueMicrotask(fn);
  const css=["assets/46bf509daf5f.css", "src/theme.css", "src/type-unified.css", "src/project-hover.css", "src/ru-layout.css", "src/speech-bubbles.css", "src/style-00.css", "src/style-01.css", "src/style-02.css", "src/style-03.css", "src/style-04.css", "src/style-05.css", "src/style-06.css", "src/style-07.css", "src/style-08.css", "src/style-09.css", "src/glow-panel.css", "src/flight-editor.css"], scripts=["assets/317ef0b6a1da.js", "assets/ddfce64d409f.js", "src/theme.js", "src/ru-typography.js", "src/load-progress.js", "src/hero-layout.js", "src/intro.js", "src/hero-background.js", "src/clocks.js", "src/talk-button.js", "src/info-panel.js", "src/sound-toggle.js", "src/impact-audio.js", "src/gallery-audio.js", "src/nav-links.js", "src/project-speech.js", "src/project-hover.js", "src/gallery-labels.js", "src/ru-layout.js", "src/finger-shot.js", "src/head-note.js"];
  function style(file){return new Promise((resolve,reject)=>{
    if(file==='src/style-00.css'||file==='src/ru-layout.css'){
      const rec=document.querySelector('[data-elem-id="1791098052216000015"]')?.closest('.t-rec');
      const numeric=rec?.id.replace(/^rec/,'');
      if(!numeric){reject(new Error('Не найдены элементы исходного Zero Block.'));return;}
      const url=new URL(file,root);
      const el=document.createElement('style');document.head.append(el);
      fetch(url).then(r=>{if(!r.ok)throw new Error('CSS: '+url);return r.text();}).then(text=>{
        el.textContent=text.replaceAll('4460683201',numeric).replace(/url\((['"]?)(?!data:|#)([^)'"\s]+)\1\)/g,(_,q,path)=>'url("'+new URL(path,url).href+'")');
        resolve();
      }).catch(reject);return;
    }
    const el=document.createElement('link');el.rel='stylesheet';el.href=new URL(file,root);
    el.onload=resolve;el.onerror=()=>reject(new Error('CSS: '+el.href));document.head.append(el);
  });}
  function script(file,module=false){return new Promise((resolve,reject)=>{
    const el=document.createElement('script');el.src=new URL(file,root);el.async=false;
    if(module)el.type='module';el.onload=resolve;el.onerror=()=>reject(new Error('JS: '+el.src));
    document.head.append(el);
  });}
  window.MD_HYBRID_READY=new Promise(resolve=>window.MD_ON_READY(resolve)).then(async()=>{
    if(document.getElementById('gn-head-runtime-module'))throw new Error('Старый код головы не удалён.');
    if(!document.getElementById('gn-head-canvas')||!document.getElementById('md-work-slider'))
      throw new Error('Нет HTML-блоков головы или галереи.');
    if(document.querySelectorAll('#md-project-content [data-project-key]').length!==13)
      throw new Error('Не установлен блок текстов проектов.');
    if(document.querySelectorAll('[data-elem-id="1791098052216000015"]').length!==1)
      throw new Error('Установи один полный блок страницы из 00-PAGE.html, без старых отдельных блоков.');
    await Promise.all(css.map(style));
    await document.fonts.ready;
    if(typeof window.t396_initialScale!=='function')await script('src/tilda-layout-support.js');
    if(typeof window.t396_init!=='function')await script('assets/4bdb04d1b888.js');
    for(const file of scripts)await script(file);
    await script('src/scene.js',true);
    await new Promise((resolve,reject)=>{
      const deadline=Date.now()+60000;
      const check=()=>{if(document.documentElement.dataset.modelMaterialReady==='true')resolve();
        else if(Date.now()>deadline)reject(new Error('Истекло время загрузки модели или материалов.'));
        else setTimeout(check,100);};check();
    });
    document.documentElement.dataset.mdHybrid='ready';
  }).catch(error=>{
    document.documentElement.dataset.mdHybrid='error';console.error('[MATILDA HYBRID]',error);
    document.getElementById('md-load-progress')?.remove();
    const el=document.createElement('div');el.textContent='Не удалось загрузить эффекты. Подробности в консоли.';
    el.style.cssText='position:fixed;bottom:12px;left:12px;z-index:2147483647;background:white;padding:10px;font:12px monospace';
    document.body.append(el);
    throw error;
  });
})();
