window.GN_ECHO_SETTINGS={enabled:!0,opacity:1,strength:3,speed:1.3,width:.08,duration:3},window.MD_ON_READY(async function(){async function ae(n=15e3){const u=performance.now();for(;!window.__GN_THREE__;){if(performance.now()-u>n)throw new Error("[HERO HALFTONE] Shared THREE from GN HEAD was not found");await new Promise(F=>{setTimeout(F,25)})}return window.__GN_THREE__}let a;try{a=await ae()}catch(n){console.error(n);return}if(!window.gsap||!window.CustomEase){console.error("[HERO HALFTONE] GSAP / CustomEase is not loaded");return}const d=window.gsap,k=window.CustomEase;if(d.registerPlugin(k),window.__GN_HERO_HALFTONE_INSTANCE__){try{window.__GN_HERO_HALFTONE_INSTANCE__.destroy?.()}catch(n){console.warn("[HERO HALFTONE] Previous instance cleanup:",n)}window.__GN_HERO_HALFTONE_INSTANCE__=null}k.create("ease-secondary","0.31,0.75,0.22,1");const L=`
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
    `;function G(n){const u=new a.Color(n);return new a.Vector3(u.r,u.g,u.b)}const ie={amplitude:.8,timeSpeed:.0045,lerpSpeed:.03,autoReveal:!0,revealDuration:2,revealDelay:.3,revealEase:"ease-secondary",pixelSize:4,gooeyness:.58,contrast:1.5,bias:0,invert:1,bg:"#E8E8E3",fg:"#fff",dotOpacity:.2,transparentBg:0,waveFrequency:1,waveAmplitude:0,waveTimeSpeed:0,maxDpr:3,targetFrameMs:1e3/60};function re(n,u,F={}){const e={...ie,...F},E=new a.OrthographicCamera(-1,1,1,-1,0,1),o=new a.WebGLRenderer({canvas:u,alpha:!0});o.setClearColor(0,e.transparentBg?0:1);const y=new a.WebGLRenderTarget(1,1,{minFilter:a.NearestFilter,magFilter:a.NearestFilter,format:a.RedFormat,type:a.UnsignedByteType,depthBuffer:!1,stencilBuffer:!1}),D=new a.PlaneGeometry(2,2),v=new a.ShaderMaterial({vertexShader:L,fragmentShader:ne,uniforms:{uTime:{value:0},uAmplitude:{value:e.amplitude},uReveal:{value:0}}}),i=new a.ShaderMaterial({vertexShader:L,fragmentShader:oe,transparent:e.transparentBg===1,depthWrite:!1,uniforms:{uEcho:{value:new a.Vector4(.9,1,.6,.16)},uEchoCount:{value:1},uEchoDuration:{value:2.2},uImpactAge:{value:10},uImpactOrigin:{value:new a.Vector2(.5,.5)},uFieldTex:{value:y.texture},uFieldRes:{value:new a.Vector2(1,1)},uResolution:{value:new a.Vector2(1,1)},uReveal:{value:0},uPixelSize:{value:e.pixelSize},uGooeyness:{value:e.gooeyness},uContrast:{value:e.contrast},uBias:{value:e.bias},uInvert:{value:e.invert},uBg:{value:G(e.bg)},uFg:{value:G(e.fg)},uDotOpacity:{value:e.dotOpacity},uTransparentBg:{value:e.transparentBg},uWaveTime:{value:0},uWaveFrequency:{value:e.waveFrequency},uWaveAmplitude:{value:e.waveAmplitude}}}),x=new a.Scene,T=new a.Scene,V=new a.Mesh(D,v),Y=new a.Mesh(D,i);x.add(V),T.add(Y);const p={currentAmplitude:e.amplitude,currentTimeSpeed:e.timeSpeed},h={reveal:0};function K(){v.uniforms.uReveal.value=h.reveal,i.uniforms.uReveal.value=h.reveal}function ue(){d.to(h,{reveal:1,duration:e.revealDuration,delay:e.revealDelay,ease:e.revealEase,onUpdate:K})}let j=null,O=null,I=null;function N(){const t=n.clientWidth,l=n.clientHeight;if(t===0||l===0)return;const r=n.getBoundingClientRect();j=r,O=I=null;let s=r.width/t;(!Number.isFinite(s)||s<=0)&&(s=1);const b=window.devicePixelRatio||1,c=Math.min(b*s,Math.min(e.maxDpr,1));o.setPixelRatio(c),o.setSize(t,l,!1);const C=Math.max(1,Math.round(t*c)),A=Math.max(1,Math.round(l*c)),w=e.pixelSize*(c/s);i.uniforms.uPixelSize.value=w,i.uniforms.uResolution.value.set(C,A);const ee=Math.ceil(C/w)+1,te=Math.ceil(A/w)+1;y.setSize(ee,te),i.uniforms.uFieldRes.value.set(ee,te)}const Q=new ResizeObserver(N);Q.observe(n);let M=!0,R=!1,_=-1e4,m=null,g=!1;const X=t=>{if(t.x===O&&t.y===I)return;const l=j;l&&(O=t.x,I=t.y,i.uniforms.uImpactOrigin.value.set((t.x-l.left)/l.width,1-(t.y-l.top)/l.height))},se=t=>{X(t.detail),g=!!t.detail.shot,m=null,_=performance.now()};window.addEventListener("gn:character-impact",se),window.addEventListener("gn:echo-preview",t=>{t.detail?(X(t.detail),g=!0,m=t.detail.age):(m!==null&&(_=performance.now()-m*1e3),m=null)});let B=0;function J(t,l){const r=window.GN_ECHO_SETTINGS,s=m??(performance.now()-_)/1e3,b=r.enabled&&s>=0&&s<r.duration;if(!b&&h.reveal<=0||!b&&t-B<1/30)return;l=(t-B)*1e3,B=t,i.uniforms.uEchoCount.value=1,i.uniforms.uEcho.value.set(g?Math.max(1,r.opacity*1.7):r.opacity,r.enabled?r.strength*(g?1.6:1):0,r.speed*(g?1.15:1),r.width*(g?1.3:1)),i.uniforms.uEchoDuration.value=r.duration,i.uniforms.uImpactAge.value=r.enabled?m??(performance.now()-_)/1e3:10;const c=Math.min(l/e.targetFrameMs,3),C=e.amplitude,A=e.timeSpeed,w=1-Math.pow(1-e.lerpSpeed,c);p.currentAmplitude+=(C-p.currentAmplitude)*w,p.currentTimeSpeed+=(A-p.currentTimeSpeed)*w,v.uniforms.uAmplitude.value=p.currentAmplitude,v.uniforms.uTime.value+=p.currentTimeSpeed*c,e.waveAmplitude>0&&e.waveTimeSpeed>0&&(i.uniforms.uWaveTime.value+=e.waveTimeSpeed*c),o.setRenderTarget(y),o.render(x,E),o.setRenderTarget(null),o.render(T,E)}function H(){R||(d.ticker.add(J),R=!0)}function z(){R&&(d.ticker.remove(J),R=!1)}const Z=new IntersectionObserver(([t])=>{M=t.isIntersecting,M?H():z()},{threshold:0});Z.observe(u);function $(){document.hidden?z():M&&H()}document.addEventListener("visibilitychange",$);function ce(){z(),Q.disconnect(),Z.disconnect(),document.removeEventListener("visibilitychange",$),d.killTweensOf(h),x.remove(V),T.remove(Y),D.dispose(),v.dispose(),i.dispose(),y.dispose(),o.dispose(),o.forceContextLoss()}return N(),o.setRenderTarget(y),o.render(x,E),o.setRenderTarget(null),o.render(T,E),u.style.opacity="1",H(),e.autoReveal&&ue(),{destroy:ce,params:e,fieldMaterial:v,halftoneMaterial:i,resize:N,revealState:h,syncReveal:K}}const f=document.querySelector("[data-hero-canvas-container]"),P=f?.closest(".md-background-layer");P&&(P.style.zIndex="0"),f.style.pointerEvents="none";const le=document.querySelector("[data-hero-canvas]"),S=re(f,le,{amplitude:1.53,timeSpeed:.0065,pixelSize:3,gooeyness:0,contrast:.9,bias:-.25,invert:0,fg:"#111111",dotOpacity:1,transparentBg:1,waveAmplitude:.29,waveFrequency:3.9,waveTimeSpeed:0,autoReveal:!1,maxDpr:3});window.__GN_HERO_HALFTONE_INSTANCE__=S;function W(){const n=document.documentElement.dataset.theme==="dark";S.halftoneMaterial.uniforms.uFg.value.setScalar(n?.9:.067)}W(),window.addEventListener("md:theme-change",W);let U=!1;function q(){U||(U=!0,f.dataset.mdBackgroundState="revealing",d.to(f,{opacity:1,duration:3,ease:"sine.inOut",onComplete:()=>{f.dataset.mdBackgroundState="ready"}}),d.timeline({defaults:{ease:"ease-secondary"}}).to(S.revealState,{reveal:1,duration:3,ease:"ease-secondary",onUpdate:S.syncReveal},0))}document.addEventListener("md:text-ready",q,{once:!0}),window.MD_INTRO_SEQUENCE?.phase==="ready"&&q()});
