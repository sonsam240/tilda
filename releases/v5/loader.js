(()=>{if(window.MD_NATIVE_STARTED)return;window.MD_NATIVE_STARTED=true;
const base=new URL('./',document.currentScript.src);
window.MD_ON_READY=fn=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',fn,{once:true}):queueMicrotask(fn);
function script(file){return new Promise((resolve,reject)=>{const el=document.createElement('script');el.src=new URL(file,base);el.onload=resolve;el.onerror=()=>reject(new Error(file));document.head.append(el);});}
window.MD_HYBRID_READY=new Promise(resolve=>window.MD_ON_READY(resolve)).then(async()=>{
 await script('src/ui.js');
 await window.MD_FINISH_LOAD?.();
 document.documentElement.dataset.modelMaterialReady='true';
 document.documentElement.dataset.mdHybrid='ready';
 window.MD_CHARACTER_REVEAL={phase:'ready'};
 window.dispatchEvent(new CustomEvent('md:head-reveal',{detail:{phase:'ready'}}));
 await script('src/background.js');
}).catch(console.error);
})();