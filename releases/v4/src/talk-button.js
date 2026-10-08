/* Install before the GN module boots. Does not replace settings or model URLs. */
(() => {
  'use strict';
  const marker='/* GN_TALK_HEAD_BRIDGE_V2 */';
  const hook=`${marker}
  (()=>{
    function publish(phase){
      const state=phase==='revealing'?{phase,start:gnRevealAnimation.start,duration:gnRevealAnimation.duration}:{phase};
      window.GN_CHARACTER_REVEAL=state;
      window.dispatchEvent(new CustomEvent('gn:character-reveal',{detail:state}));
    }
    const replay=replayGnReveal;
    replayGnReveal=function(...args){const result=replay(...args);publish(gnRevealAnimation?.active?'revealing':'ready');return result;};
    const complete=completeGnReveal;
    completeGnReveal=function(...args){const result=complete(...args);publish('ready');return result;};
    const update=updateGnRevealAnimation;
    updateGnRevealAnimation=function(now){
      const result=update(now);
      if(!gnRevealAnimation&&gnRevealState.p>=1&&window.GN_CHARACTER_REVEAL?.phase==='revealing')publish('ready');
      return result;
    };
    publish('waiting');
  })();
  `;
  function install(){
    const part=document.getElementById('gn-head-code-1');
    if(!part)return false;
    const code=part.textContent||'';
    if(code.includes(marker)||code.includes('function announceGnCharacterReveal'))return true;
    const point=code.indexOf('function replayGnReveal(');
    if(point<0||!code.includes('function updateGnRevealAnimation(')||!code.includes('function completeGnReveal('))return false;
    // Changing an already-running module cannot affect its private variables.
    if(document.getElementById('gn-head-runtime-module')){
      console.warn('[GN TALK] Place the button block before the three head blocks.');
      return true;
    }
    part.textContent=code.slice(0,point)+hook+code.slice(point);
    return true;
  }
  if(install())return;
  const observer=new MutationObserver(()=>{if(install())observer.disconnect();});
  observer.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  window.MD_ON_READY(()=>{
    install();observer.disconnect();
  },{once:true});
})();

/* GN liquid button: WebGL volume, shared GPU context, no binary symbols. */
(() => {
  'use strict';
  if(window.__GN_TALK_BUTTON__)return;
  window.__GN_TALK_BUTTON__=true;
  const selector='.gn-talk, .tn-elem[data-elem-id="1791097738699"]';
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const controllers=[];
  let latest=window.GN_CHARACTER_REVEAL,fallback=0,gpu,singleTarget=false;
  const vertex=`attribute vec2 position;varying vec2 vUv;
    void main(){vUv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
  const fragment=`precision highp float;
  varying vec2 vUv;
  uniform vec2 uSize,uCanvas;
  uniform float uProgress,uTime,uRadius;
  uniform vec3 uBase,uText;
  uniform sampler2D uLabel;
  // Same noise and liquid lighting as the character shader.
  float gnRevealHash13(vec3 p3){
    p3=fract(p3*.1031);p3+=dot(p3,p3.zyx+31.32);
    return fract((p3.x+p3.y)*p3.z);
  }
  float gnRevealNoise(vec3 p){
    vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(mix(gnRevealHash13(i),gnRevealHash13(i+vec3(1,0,0)),f.x),
      mix(gnRevealHash13(i+vec3(0,1,0)),gnRevealHash13(i+vec3(1,1,0)),f.x),f.y),
      mix(mix(gnRevealHash13(i+vec3(0,0,1)),gnRevealHash13(i+vec3(1,0,1)),f.x),
      mix(gnRevealHash13(i+vec3(0,1,1)),gnRevealHash13(i+vec3(1,1,1)),f.x),f.y),f.z);
  }
  float front(vec3 p){
    float band=uSize.y*.7;
    float plane=-uSize.x*.5-band+(uSize.x+band*2.)*uProgress;
    float wave=gnRevealNoise(vec3(p.y*.23,p.z*.19,uTime*.9))-.5;
    return p.x+wave*uSize.y*.42*(1.-uProgress)-plane;
  }
  float surface(vec3 p){
    float band=uSize.y*.7;
    float edge=front(p);
    float glass=smoothstep(-band,0.,edge);
    // Displaced volume: curved normals and a molten cut surface.
    float ripple=gnRevealNoise(p*.22+vec3(0.,-uTime*1.6,0.))-.5;
    p.z+=ripple*uSize.y*.14*glass;
    p.y+=ripple*uSize.y*.055*glass;
    vec3 halfSize=vec3(uSize*.5,max(1.,uSize.y*.105));
    float radius=min(uRadius,min(halfSize.y,halfSize.z));
    vec3 q=abs(p)-(halfSize-vec3(radius));
    float box=length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.)-radius;
    float k=uSize.y*.04;
    float h=clamp(.5+.5*(box-edge)/k,0.,1.);
    return mix(edge,box,h)+k*h*(1.-h);
  }
  vec3 normalAt(vec3 p){
    vec2 e=vec2(.13,0.);
    return normalize(vec3(surface(p+e.xyy)-surface(p-e.xyy),
      surface(p+e.yxy)-surface(p-e.yxy),surface(p+e.yyx)-surface(p-e.yyx)));
  }
  void main(){
    vec2 xy=(vUv-.5)*uCanvas;
    if(abs(xy.x)>uSize.x*.5+3.||abs(xy.y)>uSize.y*.5+3.)discard;
    float bandWidth=uSize.y*.7;
    float frontPlane=-uSize.x*.5-bandWidth+(uSize.x+2.*bandWidth)*uProgress;
    // Conservative noise bound skips unrevealed pixels before volume tracing.
    if(xy.x>frontPlane+uSize.y*.21*(1.-uProgress)+1.)discard;
    vec3 p=vec3(xy,12.);
    bool hit=false;
    for(int i=0;i<32;i++){
      float d=surface(p);
      if(d<.075){hit=true;break;}
      p.z-=max(d*.72,.045);
      if(p.z< -8.)break;
    }
    if(!hit)discard;
    vec3 n=normalAt(p),view=vec3(0,0,1);
    float fres=pow(1.-abs(dot(n,view)),2.);
    float edge=front(p),band=uSize.y*.7;
    float glass=smoothstep(-band,0.,edge);
    float fade=1.-smoothstep(.88,1.,uProgress);
    glass*=fade;
    float noiseA=gnRevealNoise(p*.31+vec3(uTime*1.4,0,0));
    float noiseB=gnRevealNoise(p*.31+vec3(0,uTime*1.4,7.3));
    vec2 refractUv=(vec2(noiseA,noiseB)-.5)*.04*glass+n.xy*.024*glass;
    vec2 uv=p.xy/uSize+.5+refractUv;
    float label=texture2D(uLabel,clamp(uv,0.,1.)).a;
    float spec=pow(max(dot(reflect(-normalize(vec3(-.4,.6,1.)),n),view),0.),28.);
    vec3 solid=mix(uBase,uText,label);
    vec3 liquid=uBase*2.5+vec3(.0,.067,1.)*(.12+fres*.62)*1.5;
    liquid=mix(liquid,vec3(1.),fres*.22);
    liquid+=vec3(.16,.10,.22)*spec+vec3(.2,.12,.3)*fres;
    liquid=mix(liquid,uText,label*.96);
    vec3 color=mix(solid,liquid,glass);
    float line=pow(smoothstep(-band*.28,0.,edge),3.);
    float shimmer=.8+.2*sin(uTime*6.+p.y*.4);
    color+=vec3(.349,0.,1.)*line*shimmer*4.*fade;
    color=color/(1.+color*.45);
    color=pow(max(color,0.),vec3(1./2.2));
    gl_FragColor=vec4(color,1.);
  }`;

  function createGpu(){
    const canvas=document.createElement('canvas');
    const gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:true,depth:false,stencil:false,preserveDrawingBuffer:false});
    if(!gl)return null;
    const shaders=[];
    function compile(type,source){
      const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
      if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
        const error=gl.getShaderInfoLog(shader);gl.deleteShader(shader);throw new Error(error||'Shader compilation failed');
      }
      shaders.push(shader);return shader;
    }
    try{
      const program=gl.createProgram();
      gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Liquid shader link failed');
      shaders.forEach(s=>gl.deleteShader(s));gl.useProgram(program);
      const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
      const uniforms=Object.fromEntries(['uSize','uCanvas','uProgress','uTime','uRadius','uBase','uText','uLabel'].map(k=>[k,gl.getUniformLocation(program,k)]));
      gl.uniform1i(uniforms.uLabel,0);
      canvas.addEventListener('webglcontextlost',()=>controllers.forEach(c=>c.finish()));
      return {canvas,gl,uniforms};
    }catch(error){console.warn('[GN TALK] WebGL effect unavailable:',error.message);return null;}
  }
  function color(value){const numbers=(value||'').match(/[\d.]+/g);return numbers?.length>=3?numbers.slice(0,3).map(n=>Number(n)/255):[0,0,0];}
  function measurePixels(atom){
    const w=Math.max(1,atom.clientWidth),h=Math.max(1,atom.clientHeight);
    const rect=atom.getBoundingClientRect();
    const sx=rect.width/(atom.offsetWidth||w)||1,sy=rect.height/(atom.offsetHeight||h)||1;
    const dpr=Math.max(1,Number(window.devicePixelRatio)||1);
    const quality=dpr>=2?1.25:2;
    const wantedW=Math.ceil((w+16)*sx*dpr*quality),wantedH=Math.ceil((h+16)*sy*dpr*quality);
    const cap=Math.min(1,2048/wantedW,2048/wantedH,Math.sqrt(262144/(wantedW*wantedH)));
    const pw=Math.max(1,Math.floor(wantedW*cap)),ph=Math.max(1,Math.floor(wantedH*cap));
    return {w,h,pw,ph,dx:pw/(w+16),dy:ph/(h+16)};
  }

  function mount(elem){
    const atom=elem.querySelector('.tn-atom');
    if(!atom||atom.dataset.gnTalkState)return;
    atom.dataset.gnTalkGpu=gpu?'webgl':'unavailable';
    const direct=singleTarget&&Boolean(gpu);
    const canvas=direct?gpu.canvas:document.createElement('canvas');
    canvas.className='gn-talk-webgl';canvas.setAttribute('aria-hidden','true');
    const ctx=direct?null:canvas.getContext('2d');atom.appendChild(canvas);
    atom.dataset.gnTalkSurface=direct?'direct-webgl':'shared-copy';
    if(getComputedStyle(atom).position==='static')atom.classList.add('gn-talk-relative');
    let animation=null,raf=0,revealed=false,texture=null,width=0,height=0,metrics=null,radius=4,base=[0,0,0],text=[1,1,1];
    const savedVisibility=atom.style.visibility||'';

    function finish(){
      if(raf)cancelAnimationFrame(raf);raf=0;animation=null;revealed=true;
      atom.classList.remove('gn-talk-shader-active');atom.style.visibility=savedVisibility;canvas.style.display='none';
      atom.dataset.gnTalkState='ready';atom.dataset.gnTalkProgress='1.000';
    }
    function prepare(){
      if(!gpu||gpu.gl.isContextLost()||(!direct&&!ctx))return false;
      const measured=measurePixels(atom),{w,h}=measured;
      if(texture&&width===w&&height===h&&metrics?.pw===measured.pw&&metrics?.ph===measured.ph)return true;
      width=w;height=h;metrics=measured;
      atom.dataset.gnTalkBuffer=`${metrics.pw}x${metrics.ph}`;
      const cs=getComputedStyle(atom),label=atom.querySelector('.tn-atom__button-text')||atom,ls=getComputedStyle(label);
      if(!animation){base=color(cs.backgroundColor);radius=parseFloat(cs.borderRadius)||4;}
      text=color(ls.color);
      const atlas=document.createElement('canvas');atlas.width=Math.ceil(w*metrics.dx);atlas.height=Math.ceil(h*metrics.dy);
      const pen=atlas.getContext('2d');if(!pen)return false;
      pen.setTransform(atlas.width/w,0,0,atlas.height/h,0,0);pen.font=ls.font||`${ls.fontSize} ${ls.fontFamily}`;
      pen.fillStyle='#fff';pen.textAlign='center';pen.textBaseline='middle';
      if('letterSpacing' in pen)pen.letterSpacing=ls.letterSpacing;
      const caption=label.textContent.trim();
      pen.fillText(ls.textTransform==='uppercase'?caption.toUpperCase():caption,w*.5,h*.5);
      const {gl}=gpu;if(texture)gl.deleteTexture(texture);
      texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);return true;
    }
    function paint(progress,time){
      atom.dataset.gnTalkProgress=progress.toFixed(3);
      if(!gpu||gpu.gl.isContextLost()){finish();return;}
      const {gl,uniforms:u}=gpu,cw=width+16,ch=height+16;
      const {pw,ph}=metrics;
      if(gpu.canvas.width!==pw||gpu.canvas.height!==ph){gpu.canvas.width=pw;gpu.canvas.height=ph;}
      if(canvas.width!==pw||canvas.height!==ph){canvas.width=pw;canvas.height=ph;}
      gl.viewport(0,0,pw,ph);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.uniform2f(u.uSize,width,height);gl.uniform2f(u.uCanvas,cw,ch);gl.uniform1f(u.uProgress,progress);
      gl.uniform1f(u.uTime,time);gl.uniform1f(u.uRadius,radius);
      gl.uniform3fv(u.uBase,base);gl.uniform3fv(u.uText,text);gl.drawArrays(gl.TRIANGLES,0,6);
      if(!direct){ctx.clearRect(0,0,pw,ph);ctx.drawImage(gpu.canvas,0,0);}
    }
    function frame(now){
      raf=0;if(!animation||document.hidden)return;
      const raw=Math.max(0,Math.min(1,(now-animation.start)/animation.duration));
      if(raw>=1){finish();return;}
      if(!prepare()){finish();return;}
      paint(1-(1-raw)*(1-raw),(now-animation.start)/1000);
      if(animation)raf=requestAnimationFrame(frame);
    }
    function play(start,duration){
      if(motion.matches||!prepare()){atom.dataset.gnTalkGpu=motion.matches?'reduced-motion':'unavailable';finish();return;}
      if(raf)cancelAnimationFrame(raf);
      animation={start,duration:Math.max(50,duration)};revealed=false;
      atom.classList.add('gn-talk-shader-active');atom.style.visibility=savedVisibility;canvas.style.display='block';
      atom.dataset.gnTalkState='revealing';
      const elapsed=performance.now()-start,raw=Math.max(0,Math.min(1,elapsed/animation.duration));
      if(raw>=1){finish();return;}
      paint(1-(1-raw)*(1-raw),Math.max(0,elapsed)/1000);raf=document.hidden?0:requestAnimationFrame(frame);
    }
    function sync(state){
      if(!state||revealed)return;
      if(state.phase==='ready'||state.phase==='error')finish();
      else if(state.phase==='revealing'&&Number.isFinite(state.start)&&Number.isFinite(state.duration))play(state.start,state.duration);
    }
    const controller={sync,finish,fallback:()=>{if(!revealed)finish();},visibility:()=>{
      if(document.hidden){if(raf)cancelAnimationFrame(raf);raf=0;}
      else if(animation&&!raf)raf=requestAnimationFrame(frame);
    }};
    controllers.push(controller);
    if(motion.matches||!gpu||(!direct&&!ctx)){finish();return;}
    // Warm the small shader/label before the character starts its reveal.
    if(prepare())paint(0,0,false);
    atom.dataset.gnTalkState='waiting';atom.style.visibility='hidden';canvas.style.display='none';sync(latest);
    if(document.fonts?.ready)document.fonts.ready.then(()=>{width=0;if(animation)prepare();});
  }
  window.addEventListener('gn:character-reveal',event=>{
    latest=event.detail;
    if(fallback&&latest?.phase!=='waiting')clearTimeout(fallback);
    controllers.forEach(c=>c.sync(latest));
  });
  document.addEventListener('visibilitychange',()=>controllers.forEach(c=>c.visibility()));
  motion.addEventListener('change',()=>{if(motion.matches)controllers.forEach(c=>c.finish());});
  function init(){const targets=document.querySelectorAll(selector);singleTarget=targets.length===1;
    gpu=motion.matches?null:createGpu();targets.forEach(mount);
    if(controllers.length&&(!latest||latest.phase==='waiting'))fallback=setTimeout(()=>controllers.forEach(c=>c.fallback()),30000);}
  if(document.readyState==='loading')window.MD_ON_READY(init,{once:true});else init();
})();
