window.GN_ECHO_SETTINGS={enabled:true,opacity:1,strength:3,speed:1.3,width:.08,duration:3};
window.MD_ON_READY( async function () {

    async function waitForSharedThree(timeout = 15000) {
        const started = performance.now();

        while (!window.__GN_THREE__) {
            if (performance.now() - started > timeout) {
                throw new Error(
                    "[HERO HALFTONE] Shared THREE from GN HEAD was not found"
                );
            }

            await new Promise(resolve => {
                setTimeout(resolve, 25);
            });
        }

        return window.__GN_THREE__;
    }

    let THREE;

    try {
        THREE = await waitForSharedThree();
    } catch (error) {
        console.error(error);
        return;
    }

    if (!window.gsap || !window.CustomEase) {
        console.error("[HERO HALFTONE] GSAP / CustomEase is not loaded");
        return;
    }

    const gsap = window.gsap;
    const CustomEase = window.CustomEase;

    gsap.registerPlugin(CustomEase);

    if (window.__GN_HERO_HALFTONE_INSTANCE__) {
        try {
            window.__GN_HERO_HALFTONE_INSTANCE__.destroy?.();
        } catch (error) {
            console.warn("[HERO HALFTONE] Previous instance cleanup:", error);
        }

        window.__GN_HERO_HALFTONE_INSTANCE__ = null;
    }

    CustomEase.create(
        "ease-secondary",
        "0.31,0.75,0.22,1"
    );


    const vertexShader = `
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
    `;


    const fieldFragmentShader = `
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
    `;


    const halftoneFragmentShader = `
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
    `;



    function colorToVector(
        color
    ) {

        const c =
            new THREE.Color(
                color
            );


        return new THREE.Vector3(
            c.r,
            c.g,
            c.b
        );
    }



    const defaults = {

        amplitude:
            0.8,

        timeSpeed:
            0.0045,

        lerpSpeed:
            0.03,

        autoReveal:
            true,

        revealDuration:
            2,

        revealDelay:
            0.3,

        revealEase:
            "ease-secondary",

        pixelSize:
            4,

        gooeyness:
            0.58,

        contrast:
            1.5,

        bias:
            0,

        invert:
            1,

        bg:
            "#E8E8E3",

        fg:
            "#fff",

        dotOpacity:
            0.2,

        transparentBg:
            0,

        waveFrequency:
            1,

        waveAmplitude:
            0,

        waveTimeSpeed:
            0,

        maxDpr:
            3,

        targetFrameMs:
            1000 / 60
    };



    function createHalftoneShader(
        container,
        canvas,
        options = {}
    ) {

        const params = {
            ...defaults,
            ...options
        };


        const camera =
            new THREE.OrthographicCamera(
                -1,
                1,
                1,
                -1,
                0,
                1
            );


        const renderer =
            new THREE.WebGLRenderer({

                canvas:
                    canvas,

                alpha:
                    true
            });


        renderer.setClearColor(
            0,

            params.transparentBg
                ? 0
                : 1
        );


        const fieldTarget =
            new THREE.WebGLRenderTarget(

                1,
                1,

                {

                    minFilter:
                        THREE.NearestFilter,

                    magFilter:
                        THREE.NearestFilter,

                    format:
                        THREE.RedFormat,

                    type:
                        THREE.UnsignedByteType,

                    depthBuffer:
                        false,

                    stencilBuffer:
                        false
                }
            );


        const geometry =
            new THREE.PlaneGeometry(
                2,
                2
            );


        const fieldMaterial =
            new THREE.ShaderMaterial({

                vertexShader:
                    vertexShader,

                fragmentShader:
                    fieldFragmentShader,

                uniforms: {

                    uTime: {
                        value:
                            0
                    },

                    uAmplitude: {
                        value:
                            params.amplitude
                    },

                    uReveal: {
                        value:
                            0
                    }
                }
            });


        const halftoneMaterial =
            new THREE.ShaderMaterial({

                vertexShader:
                    vertexShader,

                fragmentShader:
                    halftoneFragmentShader,

                transparent:
                    params.transparentBg ===
                    1,

                depthWrite:
                    false,

                uniforms: {

                    uEcho:{value:new THREE.Vector4(.9,1,.6,.16)},uEchoCount:{value:1},uEchoDuration:{value:2.2},uImpactAge:{value:10},uImpactOrigin:{value:new THREE.Vector2(.5,.5)},
                    uFieldTex: {
                        value:
                            fieldTarget.texture
                    },

                    uFieldRes: {
                        value:
                            new THREE.Vector2(
                                1,
                                1
                            )
                    },

                    uResolution: {
                        value:
                            new THREE.Vector2(
                                1,
                                1
                            )
                    },

                    uReveal: {
                        value:
                            0
                    },

                    uPixelSize: {
                        value:
                            params.pixelSize
                    },

                    uGooeyness: {
                        value:
                            params.gooeyness
                    },

                    uContrast: {
                        value:
                            params.contrast
                    },

                    uBias: {
                        value:
                            params.bias
                    },

                    uInvert: {
                        value:
                            params.invert
                    },

                    uBg: {
                        value:
                            colorToVector(
                                params.bg
                            )
                    },

                    uFg: {
                        value:
                            colorToVector(
                                params.fg
                            )
                    },

                    uDotOpacity: {
                        value:
                            params.dotOpacity
                    },

                    uTransparentBg: {
                        value:
                            params.transparentBg
                    },

                    uWaveTime: {
                        value:
                            0
                    },

                    uWaveFrequency: {
                        value:
                            params.waveFrequency
                    },

                    uWaveAmplitude: {
                        value:
                            params.waveAmplitude
                    }
                }
            });



        const fieldScene =
            new THREE.Scene();


        const halftoneScene =
            new THREE.Scene();


        const fieldMesh =
            new THREE.Mesh(
                geometry,
                fieldMaterial
            );


        const halftoneMesh =
            new THREE.Mesh(
                geometry,
                halftoneMaterial
            );


        fieldScene.add(
            fieldMesh
        );


        halftoneScene.add(
            halftoneMesh
        );



        const animationState = {

            currentAmplitude:
                params.amplitude,

            currentTimeSpeed:
                params.timeSpeed
        };


        const revealState = {

            reveal:
                0
        };


        function syncReveal() {

            fieldMaterial
                .uniforms
                .uReveal
                .value =
                    revealState.reveal;


            halftoneMaterial
                .uniforms
                .uReveal
                .value =
                    revealState.reveal;
        }



        function autoReveal() {

            gsap.to(

                revealState,

                {

                    reveal:
                        1,

                    duration:
                        params.revealDuration,

                    delay:
                        params.revealDelay,

                    ease:
                        params.revealEase,

                    onUpdate:
                        syncReveal
                }
            );
        }



        let impactBounds=null,impactX=null,impactY=null;
        function resize() {

            const width =
                container.clientWidth;


            const height =
                container.clientHeight;


            if (
                width === 0 ||
                height === 0
            ) {

                return;
            }


            const rect =
                container.getBoundingClientRect();


            impactBounds=rect;impactX=impactY=null;
            let zoom =
                rect.width /
                width;


            if (
                !Number.isFinite(zoom) ||
                zoom <= 0
            ) {

                zoom =
                    1;
            }


            const deviceDpr =
                window.devicePixelRatio ||
                1;


            const renderDpr =

                Math.min(

                    deviceDpr *
                    zoom,

                    params.maxDpr
                );


            renderer.setPixelRatio(
                renderDpr
            );


            renderer.setSize(
                width,
                height,
                false
            );


            const renderWidth =

                Math.max(

                    1,

                    Math.round(

                        width *
                        renderDpr

                    )
                );


            const renderHeight =

                Math.max(

                    1,

                    Math.round(

                        height *
                        renderDpr

                    )
                );


            const renderPixelSize =

                params.pixelSize *
                (
                    renderDpr /
                    zoom
                );


            halftoneMaterial
                .uniforms
                .uPixelSize
                .value =

                    renderPixelSize;


            halftoneMaterial
                .uniforms
                .uResolution
                .value
                .set(

                    renderWidth,

                    renderHeight
                );


            const fieldWidth =

                Math.ceil(

                    renderWidth /
                    renderPixelSize

                ) +

                1;


            const fieldHeight =

                Math.ceil(

                    renderHeight /
                    renderPixelSize

                ) +

                1;


            fieldTarget.setSize(

                fieldWidth,

                fieldHeight

            );


            halftoneMaterial
                .uniforms
                .uFieldRes
                .value
                .set(

                    fieldWidth,

                    fieldHeight
                );
        }



        const resizeObserver =
            new ResizeObserver(
                resize
            );


        resizeObserver.observe(
            container
        );



        let visible =
            true;


        let tickerRunning =
            false;


        let impactStarted=-10000,previewImpactAge=null,shotEcho=false;
        const setImpactOrigin=detail=>{if(detail.x===impactX&&detail.y===impactY)return;const rect=impactBounds;if(!rect)return;impactX=detail.x;impactY=detail.y;halftoneMaterial.uniforms.uImpactOrigin.value.set((detail.x-rect.left)/rect.width,1-(detail.y-rect.top)/rect.height);};
        const impactListener=event=>{setImpactOrigin(event.detail);shotEcho=!!event.detail.shot;previewImpactAge=null;impactStarted=performance.now();};
        window.addEventListener('gn:character-impact',impactListener);
        window.addEventListener('gn:echo-preview',event=>{
            if(event.detail){setImpactOrigin(event.detail);shotEcho=true;previewImpactAge=event.detail.age;}
            else{if(previewImpactAge!==null)impactStarted=performance.now()-previewImpactAge*1000;previewImpactAge=null;}
        });
        function render(
            time,
            deltaTime
        ) {
            const echoConfig=window.GN_ECHO_SETTINGS;
            halftoneMaterial.uniforms.uEchoCount.value=1;
            halftoneMaterial.uniforms.uEcho.value.set(shotEcho?Math.max(1,echoConfig.opacity*1.7):echoConfig.opacity,echoConfig.enabled?echoConfig.strength*(shotEcho?1.6:1):0,echoConfig.speed*(shotEcho?1.15:1),echoConfig.width*(shotEcho?1.3:1));
            halftoneMaterial.uniforms.uEchoDuration.value=echoConfig.duration;
            halftoneMaterial.uniforms.uImpactAge.value=echoConfig.enabled?(previewImpactAge??(performance.now()-impactStarted)/1000):10;

            const frameScale =

                Math.min(

                    deltaTime /
                    params.targetFrameMs,

                    3
                );


            const targetAmplitude =
                params.amplitude;


            const targetTimeSpeed =
                params.timeSpeed;


            const lerp =

                1 -

                Math.pow(

                    1 -
                        params.lerpSpeed,

                    frameScale
                );


            animationState.currentAmplitude +=

                (
                    targetAmplitude -

                    animationState.currentAmplitude
                ) *

                lerp;


            animationState.currentTimeSpeed +=

                (
                    targetTimeSpeed -

                    animationState.currentTimeSpeed
                ) *

                lerp;


            fieldMaterial
                .uniforms
                .uAmplitude
                .value =

                    animationState.currentAmplitude;



            fieldMaterial
                .uniforms
                .uTime
                .value +=

                    animationState.currentTimeSpeed *

                    frameScale;



            if (

                params.waveAmplitude >
                    0 &&

                params.waveTimeSpeed >
                    0

            ) {

                halftoneMaterial
                    .uniforms
                    .uWaveTime
                    .value +=

                        params.waveTimeSpeed *

                        frameScale;
            }



            renderer.setRenderTarget(
                fieldTarget
            );


            renderer.render(
                fieldScene,
                camera
            );


            renderer.setRenderTarget(
                null
            );


            renderer.render(
                halftoneScene,
                camera
            );
        }



        function startTicker() {

            if (
                tickerRunning
            ) {

                return;
            }


            gsap.ticker.add(
                render
            );


            tickerRunning =
                true;
        }



        function stopTicker() {

            if (
                !tickerRunning
            ) {

                return;
            }


            gsap.ticker.remove(
                render
            );


            tickerRunning =
                false;
        }



        const intersectionObserver =
            new IntersectionObserver(

                ([entry]) => {

                    visible =
                        entry.isIntersecting;


                    if (
                        visible
                    ) {

                        startTicker();
                    }

                    else {

                        stopTicker();
                    }
                },

                {
                    threshold:
                        0
                }
            );


        intersectionObserver.observe(
            canvas
        );



        function visibilityChange() {

            if (
                document.hidden
            ) {

                stopTicker();
            }

            else if (
                visible
            ) {

                startTicker();
            }
        }


        document.addEventListener(
            "visibilitychange",
            visibilityChange
        );



        function destroy() {

            stopTicker();


            resizeObserver.disconnect();


            intersectionObserver.disconnect();


            document.removeEventListener(
                "visibilitychange",
                visibilityChange
            );


            gsap.killTweensOf(
                revealState
            );


            fieldScene.remove(
                fieldMesh
            );


            halftoneScene.remove(
                halftoneMesh
            );


            geometry.dispose();


            fieldMaterial.dispose();


            halftoneMaterial.dispose();


            fieldTarget.dispose();


            renderer.dispose();


            renderer.forceContextLoss();
        }



        resize();


        renderer.setRenderTarget(
            fieldTarget
        );


        renderer.render(
            fieldScene,
            camera
        );


        renderer.setRenderTarget(
            null
        );


        renderer.render(
            halftoneScene,
            camera
        );


        canvas.style.opacity =
            "1";


        startTicker();


        if (
            params.autoReveal
        ) {

            autoReveal();
        }



        return {

            destroy:
                destroy,

            params:
                params,

            fieldMaterial:
                fieldMaterial,

            halftoneMaterial:
                halftoneMaterial,

            resize:
                resize,

            revealState:
                revealState,

            syncReveal:
                syncReveal
        };
    }



    const heroContainer =
        document.querySelector(
            "[data-hero-canvas-container]"
        );


    const backgroundLayer=heroContainer?.closest('.tn-elem');
    if(backgroundLayer)backgroundLayer.style.zIndex='0';
    heroContainer.style.pointerEvents='none';
    const heroCanvas =
        document.querySelector(
            "[data-hero-canvas]"
        );


    const heroShader =
        createHalftoneShader(

            heroContainer,

            heroCanvas,

            {

                amplitude:
                    1.53,

                timeSpeed:
                    0.0065,

                pixelSize:
                    3,

                gooeyness:
                    0,

                contrast:
                    0.9,

                bias:
                    -0.25,

                invert:
                    0,


                /* ЦВЕТ ТОЧЕК */
                fg:
                    "#111111",


                /* ПРОЗРАЧНОСТЬ ТОЧЕК */
                dotOpacity:
                   1,


                transparentBg:
                    1,

                waveAmplitude:
                    0.29,

                waveFrequency:
                    3.9,

                waveTimeSpeed:
                    0,

                autoReveal:
                    false,

                maxDpr:
                    3
            }
        );

    window.__GN_HERO_HALFTONE_INSTANCE__ = heroShader;
    function syncThemeDots(){
      const dark=document.documentElement.dataset.theme==='dark';
      heroShader.halftoneMaterial.uniforms.uFg.value.setScalar(dark?0.9:0.067);
    }
    syncThemeDots();
    window.addEventListener('md:theme-change',syncThemeDots);




    let backgroundStarted=false;
    function revealBackground(){
      if(backgroundStarted)return; backgroundStarted=true;
      heroContainer.dataset.mdBackgroundState='revealing';
      gsap.to(heroContainer,{opacity:1,duration:3,ease:'sine.inOut',onComplete:()=>{heroContainer.dataset.mdBackgroundState='ready';}});
    gsap.timeline({

        defaults: {
            ease:
                "ease-secondary"
        }

    })

    .to(

        heroShader.revealState,

        {

            reveal:
                1,

            duration:
                3,

            ease:
                "ease-secondary",

            onUpdate:
                heroShader.syncReveal
        },

        0
    );

    }
    document.addEventListener('md:text-ready',revealBackground,{once:true});
    if(window.MD_INTRO_SEQUENCE?.phase==='ready')revealBackground();
});
