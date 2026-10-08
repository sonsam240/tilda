window.GN_ECHO_SETTINGS={enabled:!0,opacity:1,strength:3,speed:1.3,width:.08,duration:3},window.MD_ON_READY(async function(){async function ae(n=15e3){const u=performance.now();for(;!window.__GN_THREE__;){if(performance.now()-u>n)throw new Error("[HERO HALFTONE] Shared THREE from GN HEAD was not found");await new Promise(C=>{setTimeout(C,25)})}return window.__GN_THREE__}let a;try{a=await ae()}catch(n){console.error(n);return}if(!window.gsap||!window.CustomEase){console.error("[HERO HALFTONE] GSAP / CustomEase is not loaded");return}const s=window.gsap,k=window.CustomEase;if(s.registerPlugin(k),window.__GN_HERO_HALFTONE_INSTANCE__){try{window.__GN_HERO_HALFTONE_INSTANCE__.destroy?.()}catch(n){console.warn("[HERO HALFTONE] Previous instance cleanup:",n)}window.__GN_HERO_HALFTONE_INSTANCE__=null}k.create("ease-secondary","0.31,0.75,0.22,1");const L=`
        varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position =
                projectionMatrix *
                modelViewMatrix *
                vec4(
                    position,
                    1.0
                );
        }
    `,ne=`
        precision highp float;

        uniform float uTime;
        uniform float uAmplitude;
        uniform float uReveal;

        varying vec2 vUv;


        void main() {

            vec2 c =
                2.0 *
                vUv -
                1.0;


            float ds =
                uAmplitude *
                uReveal;


            c +=
                ds *
                0.4 *
                sin(
                    c.yx +
                    vec2(
                        1.2,
                        3.4
                    ) +
                    uTime
                );


            c +=
                ds *
                0.2 *
                sin(
                    5.2 *
                    c.yx +
                    vec2(
                        3.5,
                        0.4
                    ) +
                    uTime
                );


            c +=
                ds *
                0.3 *
                sin(
                    3.5 *
                    c.yx +
                    vec2(
                        1.2,
                        3.1
                    ) +
                    uTime
                );


            c +=
                ds *
                1.6 *
                sin(
                    0.4 *
                    c.yx +
                    vec2(
                        0.8,
                        2.4
                    ) +
                    uTime
                );


            float L =
                length(c);


            float v =
                0.0;


            for (
                int i = 0;
                i < 4;
                i++
            ) {

                v =
                    mix(
                        v,

                        float(i) /
                        3.0,

                        cos(
                            float(i) *
                            L
                        )
                    );
            }


            gl_FragColor =
                vec4(
                    clamp(
                        v,
                        0.0,
                        1.0
                    ),

                    0.0,
                    0.0,
                    1.0
                );
        }
    `,oe=`
        precision highp float;


        uniform vec4 uEcho;
        uniform float uEchoDuration;
        uniform float uEchoCount;
        uniform float uImpactAge;
        uniform vec2 uImpactOrigin;
        uniform sampler2D uFieldTex;

        uniform vec2 uFieldRes;
        uniform vec2 uResolution;

        uniform float uReveal;


        uniform float uPixelSize;

        uniform float uGooeyness;

        uniform float uContrast;

        uniform float uBias;

        uniform int uInvert;

        uniform vec3 uBg;

        uniform vec3 uFg;

        uniform float uDotOpacity;

        uniform int uTransparentBg;


        uniform float uWaveTime;

        uniform float uWaveFrequency;

        uniform float uWaveAmplitude;


        varying vec2 vUv;



        float lumaToRadius(
            float luma,
            float pixelSize,
            float biasOffset
        ) {

            float v =
                clamp(
                    (
                        luma -
                        0.5 +
                        uBias +
                        biasOffset
                    ) *

                    uContrast +

                    0.5,

                    0.0,
                    1.0
                );


            if (
                uInvert ==
                1
            ) {

                v =
                    1.0 -
                    v;
            }


            return

                v *
                pixelSize *
                0.6 +

                pixelSize *
                0.05;
        }



        float smin(
            float a,
            float b,
            float k
        ) {

            if (
                k <=
                0.001
            ) {

                return
                    min(
                        a,
                        b
                    );
            }


            float h =
                max(
                    k -
                    abs(
                        a -
                        b
                    ),

                    0.0

                ) /
                k;


            return

                min(
                    a,
                    b
                ) -

                h *
                h *
                k *
                0.25;
        }



        void main() {

            vec2 pixelCoord =
                vUv *
                uResolution;


            vec2 baseCellIndex =
                floor(
                    pixelCoord /
                    uPixelSize
                );


            float minDist =
                1.0e5;


            float smoothK =
                uGooeyness *
                1.5;


            const int R =
                1;


            for (
                int dx = -R;
                dx <= R;
                dx++
            ) {

                for (
                    int dy = -R;
                    dy <= R;
                    dy++
                ) {

                    vec2 cellIndex =

                        baseCellIndex +

                        vec2(
                            float(dx),
                            float(dy)
                        );


                    if (

                        mod(
                            cellIndex.x +
                            cellIndex.y,

                            2.0
                        ) >

                        0.5

                    ) {

                        continue;
                    }


                    vec2 cellCenter =

                        (
                            cellIndex +
                            0.5
                        ) *

                        uPixelSize;


                    vec2 fieldUv =

                        (
                            cellIndex +
                            0.5
                        ) /

                        uFieldRes;


                    float luma =

                        texture2D(
                            uFieldTex,
                            fieldUv
                        ).r;


                    float cellY =

                        cellCenter.y /

                        uResolution.y;


                    float wavePhase =

                        cellY *

                        uWaveFrequency *

                        6.2831853 -

                        uWaveTime;


                    float waveBias =

                        sin(
                            wavePhase
                        ) *

                        uWaveAmplitude;


                    float dist =

                        length(
                            pixelCoord -
                            cellCenter
                        );


                    float radius =

                        lumaToRadius(
                            luma,
                            uPixelSize,
                            waveBias
                        );


                    minDist =

                        smin(

                            minDist,

                            dist -
                            radius,

                            smoothK *
                            uPixelSize

                        );
                }
            }


            float aa =

                max(

                    fwidth(
                        minDist
                    ),

                    0.0001
                );


            float shape =

                1.0 -

                smoothstep(

                    -aa,
                    aa,

                    minDist
                );


            vec3 dotColor=uFg;
            float echo=0.0;
            // Skip echo math entirely outside its visible lifetime.
            if(uEcho.y>0.0 && uImpactAge>=0.0 && uImpactAge<uEchoDuration){
                vec2 echoDelta=(vUv-uImpactOrigin)*uResolution/min(uResolution.x,uResolution.y);
                float echoDistance=length(echoDelta);
                float bandDistance=(echoDistance-uImpactAge*uEcho.z)/max(.01,uEcho.w);
                float echoBand=exp(-bandDistance*bandDistance);
                float echoFade=1.0-smoothstep(uEchoDuration*.2,uEchoDuration,uImpactAge);
                echo=echoBand*echoFade;
                vec3 rainbow=.5+.5*cos(echoDistance*14.0-uImpactAge*5.0+vec3(0.0,2.094,4.189));
                rainbow=mix(rainbow,vec3(.45,.08,1.0),.3);
                dotColor=mix(uFg,rainbow,clamp(echo*uEcho.y,0.0,1.0));
            }

            if (
                uTransparentBg ==
                1
            ) {

                gl_FragColor =

                    vec4(

                        dotColor,

                        shape *
                        uReveal *
                        uDotOpacity * mix(.1,uEcho.x,echo)

                    );
            }

            else {

                vec3 color =

                    mix(
                        uBg,
                        dotColor,
                        shape
                    );


                gl_FragColor =

                    vec4(

                        color *
                        uReveal,

                        1.0

                    );
            }
        }
    `;function G(n){const u=new a.Color(n);return new a.Vector3(u.r,u.g,u.b)}const ie={amplitude:.8,timeSpeed:.0045,lerpSpeed:.03,autoReveal:!0,revealDuration:2,revealDelay:.3,revealEase:"ease-secondary",pixelSize:4,gooeyness:.58,contrast:1.5,bias:0,invert:1,bg:"#E8E8E3",fg:"#fff",dotOpacity:.2,transparentBg:0,waveFrequency:1,waveAmplitude:0,waveTimeSpeed:0,maxDpr:3,targetFrameMs:1e3/60};function re(n,u,C={}){const e={...ie,...C},E=new a.OrthographicCamera(-1,1,1,-1,0,1),i=new a.WebGLRenderer({canvas:u,alpha:!0});i.setClearColor(0,e.transparentBg?0:1);const h=new a.WebGLRenderTarget(1,1,{minFilter:a.NearestFilter,magFilter:a.NearestFilter,format:a.RedFormat,type:a.UnsignedByteType,depthBuffer:!1,stencilBuffer:!1}),F=new a.PlaneGeometry(2,2),d=new a.ShaderMaterial({vertexShader:L,fragmentShader:ne,uniforms:{uTime:{value:0},uAmplitude:{value:e.amplitude},uReveal:{value:0}}}),r=new a.ShaderMaterial({vertexShader:L,fragmentShader:oe,transparent:e.transparentBg===1,depthWrite:!1,uniforms:{uEcho:{value:new a.Vector4(.9,1,.6,.16)},uEchoCount:{value:1},uEchoDuration:{value:2.2},uImpactAge:{value:10},uImpactOrigin:{value:new a.Vector2(.5,.5)},uFieldTex:{value:h.texture},uFieldRes:{value:new a.Vector2(1,1)},uResolution:{value:new a.Vector2(1,1)},uReveal:{value:0},uPixelSize:{value:e.pixelSize},uGooeyness:{value:e.gooeyness},uContrast:{value:e.contrast},uBias:{value:e.bias},uInvert:{value:e.invert},uBg:{value:G(e.bg)},uFg:{value:G(e.fg)},uDotOpacity:{value:e.dotOpacity},uTransparentBg:{value:e.transparentBg},uWaveTime:{value:0},uWaveFrequency:{value:e.waveFrequency},uWaveAmplitude:{value:e.waveAmplitude}}}),x=new a.Scene,T=new a.Scene,V=new a.Mesh(F,d),Y=new a.Mesh(F,r);x.add(V),T.add(Y);const m={currentAmplitude:e.amplitude,currentTimeSpeed:e.timeSpeed},g={reveal:0};function K(){d.uniforms.uReveal.value=g.reveal,r.uniforms.uReveal.value=g.reveal}function ue(){s.to(g,{reveal:1,duration:e.revealDuration,delay:e.revealDelay,ease:e.revealEase,onUpdate:K})}let j=null,A=null,D=null;function O(){const t=n.clientWidth,l=n.clientHeight;if(t===0||l===0)return;const _=n.getBoundingClientRect();j=_,A=D=null;let o=_.width/t;(!Number.isFinite(o)||o<=0)&&(o=1);const w=window.devicePixelRatio||1,p=Math.min(w*o,Math.min(e.maxDpr,1));i.setPixelRatio(p),i.setSize(t,l,!1);const b=Math.max(1,Math.round(t*p)),y=Math.max(1,Math.round(l*p)),z=e.pixelSize*(p/o);r.uniforms.uPixelSize.value=z,r.uniforms.uResolution.value.set(b,y);const ee=Math.ceil(b/z)+1,te=Math.ceil(y/z)+1;h.setSize(ee,te),r.uniforms.uFieldRes.value.set(ee,te)}const Q=new ResizeObserver(O);Q.observe(n);let I=!0,R=!1,N=-1e4,f=null,v=!1;const X=t=>{if(t.x===A&&t.y===D)return;const l=j;l&&(A=t.x,D=t.y,r.uniforms.uImpactOrigin.value.set((t.x-l.left)/l.width,1-(t.y-l.top)/l.height))},se=t=>{X(t.detail),v=!!t.detail.shot,f=null,N=performance.now()};window.addEventListener("gn:character-impact",se),window.addEventListener("gn:echo-preview",t=>{t.detail?(X(t.detail),v=!0,f=t.detail.age):(f!==null&&(N=performance.now()-f*1e3),f=null)});let M=0;function J(t,l){if(t-M<1/30)return;const _=(t-M)*1e3;M=t,l=_;const o=window.GN_ECHO_SETTINGS;r.uniforms.uEchoCount.value=1,r.uniforms.uEcho.value.set(v?Math.max(1,o.opacity*1.7):o.opacity,o.enabled?o.strength*(v?1.6:1):0,o.speed*(v?1.15:1),o.width*(v?1.3:1)),r.uniforms.uEchoDuration.value=o.duration,r.uniforms.uImpactAge.value=o.enabled?f??(performance.now()-N)/1e3:10;const w=Math.min(l/e.targetFrameMs,3),p=e.amplitude,b=e.timeSpeed,y=1-Math.pow(1-e.lerpSpeed,w);m.currentAmplitude+=(p-m.currentAmplitude)*y,m.currentTimeSpeed+=(b-m.currentTimeSpeed)*y,d.uniforms.uAmplitude.value=m.currentAmplitude,d.uniforms.uTime.value+=m.currentTimeSpeed*w,e.waveAmplitude>0&&e.waveTimeSpeed>0&&(r.uniforms.uWaveTime.value+=e.waveTimeSpeed*w),i.setRenderTarget(h),i.render(x,E),i.setRenderTarget(null),i.render(T,E)}function B(){R||(s.ticker.add(J),R=!0)}function H(){R&&(s.ticker.remove(J),R=!1)}const Z=new IntersectionObserver(([t])=>{I=t.isIntersecting,I?B():H()},{threshold:0});Z.observe(u);function $(){document.hidden?H():I&&B()}document.addEventListener("visibilitychange",$);function ce(){H(),Q.disconnect(),Z.disconnect(),document.removeEventListener("visibilitychange",$),s.killTweensOf(g),x.remove(V),T.remove(Y),F.dispose(),d.dispose(),r.dispose(),h.dispose(),i.dispose(),i.forceContextLoss()}return O(),i.setRenderTarget(h),i.render(x,E),i.setRenderTarget(null),i.render(T,E),u.style.opacity="1",B(),e.autoReveal&&ue(),{destroy:ce,params:e,fieldMaterial:d,halftoneMaterial:r,resize:O,revealState:g,syncReveal:K}}const c=document.querySelector("[data-hero-canvas-container]"),P=c?.closest(".md-background-layer");P&&(P.style.zIndex="0"),c.style.pointerEvents="none";const le=document.querySelector("[data-hero-canvas]"),S=re(c,le,{amplitude:1.53,timeSpeed:.0065,pixelSize:3,gooeyness:0,contrast:.9,bias:-.25,invert:0,fg:"#111111",dotOpacity:1,transparentBg:1,waveAmplitude:.29,waveFrequency:3.9,waveTimeSpeed:0,autoReveal:!1,maxDpr:3});window.__GN_HERO_HALFTONE_INSTANCE__=S;function W(){const n=document.documentElement.dataset.theme==="dark";S.halftoneMaterial.uniforms.uFg.value.setScalar(n?.9:.067)}W(),window.addEventListener("md:theme-change",W);let U=!1;function q(){U||(U=!0,c.dataset.mdBackgroundState="revealing",s.to(c,{opacity:1,duration:3,ease:"sine.inOut",onComplete:()=>{c.dataset.mdBackgroundState="ready"}}),s.timeline({defaults:{ease:"ease-secondary"}}).to(S.revealState,{reveal:1,duration:3,ease:"ease-secondary",onUpdate:S.syncReveal},0))}document.addEventListener("md:text-ready",q,{once:!0}),window.MD_INTRO_SEQUENCE?.phase==="ready"&&q()});
