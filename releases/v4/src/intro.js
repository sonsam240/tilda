window.MD_GALLERY_TUNING={"durationMs":3000,"staggerMs":150,"easing":"cinema","headOffsetMs":0};
window.MD_GALLERY_PATHS={"version":1,"units":"normalized-viewport","viewport":{"width":1527,"height":1004},"durationMs":3500,"staggerMs":130,"launchOrder":[6,5,4,3,2,1],"paths":[{"project":1,"points":[{"x":0.4998,"y":0.468278},{"x":0.4998,"y":0.575962},{"x":0.50804,"y":0.575962},{"x":0.545941,"y":0.575962},{"x":0.639871,"y":0.575962},{"x":0.664589,"y":0.463178},{"x":0.664589,"y":0.325331},{"x":0.664589,"y":0.074701},{"x":0.437746,"y":0.026892},{"x":0.303495,"y":0.182271},{"x":0.179068,"y":0.327689},{"x":0.064541,"y":0.696791},{"x":0.087462,"y":0.696791}]},{"project":2,"points":[{"x":0.4998,"y":0.468278},{"x":0.4998,"y":0.575962},{"x":0.50804,"y":0.575962},{"x":0.545941,"y":0.575962},{"x":0.639871,"y":0.575962},{"x":0.664589,"y":0.463178},{"x":0.664589,"y":0.325331},{"x":0.664589,"y":0.074701},{"x":0.472454,"y":0.048805},{"x":0.337549,"y":0.156375},{"x":0.196095,"y":0.361554},{"x":0.229477,"y":0.696791},{"x":0.252397,"y":0.696791}]},{"project":3,"points":[{"x":0.4998,"y":0.468278},{"x":0.4998,"y":0.575962},{"x":0.50804,"y":0.575962},{"x":0.545941,"y":0.575962},{"x":0.639871,"y":0.575962},{"x":0.664589,"y":0.463178},{"x":0.664589,"y":0.325331},{"x":0.664589,"y":0.074701},{"x":0.462631,"y":0.060757},{"x":0.356541,"y":0.145418},{"x":0.228184,"y":0.310757},{"x":0.381152,"y":0.696791},{"x":0.417332,"y":0.696791}]},{"project":4,"points":[{"x":0.4998,"y":0.468278},{"x":0.4998,"y":0.575962},{"x":0.50804,"y":0.575962},{"x":0.545941,"y":0.575962},{"x":0.639871,"y":0.575962},{"x":0.664589,"y":0.463178},{"x":0.664589,"y":0.325331},{"x":0.664589,"y":0.074701},{"x":0.460011,"y":0.051793},{"x":0.342133,"y":0.146414},{"x":0.228184,"y":0.36753},{"x":0.363026,"y":0.696791},{"x":0.582268,"y":0.696791}]},{"project":5,"points":[{"x":0.4998,"y":0.468278},{"x":0.4998,"y":0.575962},{"x":0.50804,"y":0.575962},{"x":0.545941,"y":0.575962},{"x":0.639871,"y":0.575962},{"x":0.664589,"y":0.463178},{"x":0.664589,"y":0.325331},{"x":0.664589,"y":0.074701},{"x":0.47673,"y":0.074701},{"x":0.377857,"y":0.122321},{"x":0.278983,"y":0.335357},{"x":0.344899,"y":0.696791},{"x":0.747203,"y":0.696791}]},{"project":6,"points":[{"x":0.4998,"y":0.468278},{"x":0.4998,"y":0.575962},{"x":0.50804,"y":0.575962},{"x":0.545941,"y":0.575962},{"x":0.639871,"y":0.575962},{"x":0.664589,"y":0.463178},{"x":0.664589,"y":0.325331},{"x":0.664589,"y":0.074701},{"x":0.458603,"y":0.074701},{"x":0.35973,"y":0.099764},{"x":0.260856,"y":0.3128},{"x":0.326772,"y":0.696791},{"x":0.912138,"y":0.696791}]}]};
(() => {
  'use strict';
  const imported=window.MD_GALLERY_PATHS;
  const tuning=window.MD_GALLERY_TUNING||{};
  const defaults={size:100,staggerMs:tuning.staggerMs??imported?.staggerMs??130,launchMs:300,orbitMs:1500,landMs:(tuning.durationMs??imported?.durationMs??3500)-1800,easing:tuning.easing||'dynamic',headOffsetMs:tuning.headOffsetMs??-100};
  const clamp=v=>Math.max(0,Math.min(1,v)),mix=(a,b,t)=>a+(b-a)*t;
  const cubic=(a,b,c,d,t)=>{const s=1-t;return s*s*s*a+3*s*s*t*b+3*s*t*t*c+t*t*t*d;};
  function progressAt(p,easing='dynamic'){
    p=clamp(p);
    if(easing==='fast')return 1-Math.pow(1-p,3);
    if(easing==='soft')return Math.sin(p*Math.PI*.5);
    if(easing==='cinema')return p*p*p*(10+p*(-15+6*p));
    if(easing==='linear')return p;
    return clamp((1.4*p+1.8*p*p-(5/3)*p*p*p)/(1.4/2+5/6));
  }
  const cache=new WeakMap();
  function buildPath(head,dest){
    let routes=cache.get(head);if(!routes){routes=new WeakMap();cache.set(head,routes);}if(routes.has(dest))return routes.get(dest);
    const source=imported.paths[dest.laneIndex??0].points,start=source[0],end=source.at(-1);
    const originX=head.originX??head.x,originY=head.originY;
    const sx=(dest.x-originX)/(end.x-start.x),sy=(dest.y-originY)/(end.y-start.y);
    const controls=source.map(p=>({x:originX+(p.x-start.x)*sx,y:originY+(p.y-start.y)*sy}));
    const points=[{...controls[0],length:0}],ends=[];let length=0;
    for(let j=0;j<4;j++){const segment=controls.slice(j*3,j*3+4);for(let i=1;i<=180;i++){const t=i/180,p={x:cubic(...segment.map(p=>p.x),t),y:cubic(...segment.map(p=>p.y),t)},prev=points.at(-1);length+=Math.hypot(p.x-prev.x,p.y-prev.y);points.push({...p,length});}ends.push(length);}
    const path={controls,points,ends,length};routes.set(dest,path);return path;
  }
  function at(path,distance){let lo=0,hi=path.points.length-1;while(hi-lo>1){const mid=(lo+hi)>>1;if(path.points[mid].length<distance)lo=mid;else hi=mid;}const a=path.points[lo],b=path.points[hi],t=clamp((distance-a.length)/Math.max(.00001,b.length-a.length));return {x:mix(a.x,b.x,t),y:mix(a.y,b.y,t)};}
  function frameAt(elapsed,index,head,dest,cfg=defaults){
    const time=elapsed-index*cfg.staggerMs,duration=cfg.launchMs+cfg.orbitMs+cfg.landMs,p=clamp(time/duration);
    if(p>=1)return {x:dest.x,y:dest.y,width:dest.width,height:dest.height,angle:0,opacity:1,done:true,landing:1,expansion:1,z:0};
    const path=buildPath(head,dest),progress=progressAt(p,cfg.easing),distance=path.length*progress,pose=at(path,distance);
    const growthEnd=path.ends[2]*.55,shared=clamp(distance/growthEnd),square=mix(40,cfg.size,1-Math.pow(1-shared,2));
    const landing=clamp((distance-path.ends[2])/(path.length-path.ends[2]));
    // Recede during the overhead arc, then return before opening into the row.
    const depthProgress=clamp((distance-path.ends[0])/(path.ends[2]-path.ends[0]));
    const depthIn=clamp(depthProgress/.25),depthOut=clamp((1-depthProgress)/.25);
    const depthEnvelope=depthIn*depthIn*(3-2*depthIn)*depthOut*depthOut*(3-2*depthOut);
    const z=-360*depthEnvelope;
    // Keep the orbit compact; unfold only as the cards distribute to their slots.
    const opening=clamp((landing-.2)/.74),expansion=opening*opening*(3-2*opening);
    return {...pose,width:mix(square,dest.width,expansion),height:mix(square,dest.height,expansion),angle:0,opacity:clamp(time/35),done:false,landing,expansion,distance,z};
  }
  window.MD_GALLERY_MOTION=Object.freeze({defaults,frameAt,buildPath,progressAt});
})();

function mountOriginalGallery(){    const root =
        document.querySelector(
            '#md-work-slider'
        );
    if (!root) return;
    if (
        root.dataset.mdSliderInit === '1'
    ) {
        return;
    }
    root.dataset.mdSliderInit = '1';
    const viewport =
        root.querySelector(
            '.md-work-slider__viewport'
        );
    if (!viewport) return;
    const originals = [
        ...viewport.querySelectorAll(
            '.md-work-card'
        )
    ];
    if (!originals.length) return;
    /* =========================================================
       ВАЖНО
       TOTAL_COUNT = сколько проектов вообще.
       VISIBLE_COUNT = сколько видно одновременно.
    ========================================================= */
    const TOTAL_COUNT =
        originals.length;
    const VISIBLE_COUNT = Number(root.dataset.visibleCount)||6;
    /* =========================================================
       SETTINGS
    ========================================================= */
    const SETTINGS = {
        /*
        Общая плавность.
        */
        follow: 0.11,
        /*
        Скорость drag.
        */
        dragMultiplier: 0.90,
        /*
        Drag inertia.
        */
        dragThrow: 1.05,
        dragFriction: 0.90,
        maxDragThrow: 55,
        /*
        Wheel speed.
        */
        wheelMultiplier: 0.36,
        /*
        Wheel smoothing.
        */
        wheelEase: 0.10,
        /*
        Wheel inertia.
        */
        wheelFriction: 0.89,
        maxWheelInput: 38,
        /*
        Parallax.
        */
        parallax: 0.18,
        maxParallaxRatio: 0.075,
        /*
        Snap.
        */
        snapEnabled: true,
        snapDelay: 120,
        snapSpeed: 0.10,
        snapVelocityThreshold: 0.10,
        /*
        Auto scroll.
        */
        autoScrollEnabled: true,
        autoScrollDelay: 10000
    };
    /* =========================================================
       VARIABLES
    ========================================================= */
    let cards = [];
    let cardData = [];
    let viewportWidth = 0;
    let cardWidth = 0;
    let gap = 0;
    let step = 0;
    let loopWidth = 0;
    let scaleX = 1;
    let position = 0;
    let target = 0;
    let wheelInput = 0;
    let wheelVelocity = 0;
    let dragging = false;
    let activePointerId = null;
    let dragStartX = 0;
    let dragStartTarget = 0;
    let previousX = 0;
    let previousTime = 0;
    let dragVelocity = 0;
    let dragInertia = 0;
    let dragDistance = 0;
    let lastInteractionTime = 0;
    let snapping = false;
    let snapTarget = 0;
    let autoScrollTimer = null;
    let galleryHovered=false;
    const clipNs='http://www.w3.org/2000/svg';
    const clipSvg=document.createElementNS(clipNs,'svg');clipSvg.setAttribute('width','0');clipSvg.setAttribute('height','0');clipSvg.style.position='absolute';clipSvg.setAttribute('aria-hidden','true');
    const clipDefs=document.createElementNS(clipNs,'defs'),edgeClip=document.createElementNS(clipNs,'clipPath');edgeClip.id='md-gallery-edge-clip';edgeClip.setAttribute('clipPathUnits','userSpaceOnUse');
    const imageClip=document.createElementNS(clipNs,'rect'),captionClip=document.createElementNS(clipNs,'rect');edgeClip.append(imageClip,captionClip);clipDefs.append(edgeClip);clipSvg.append(clipDefs);document.body.append(clipSvg);viewport.style.clipPath='url(#md-gallery-edge-clip)';

    /* =========================================================
       HELPERS
    ========================================================= */
    function clamp(
        value,
        min,
        max
    ) {
        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );
    }
    function lerp(
        a,
        b,
        amount
    ) {
        return (
            a +
            (
                b -
                a
            )
            *
            amount
        );
    }
    /* =========================================================
       CREATE COPIES
    ========================================================= */
    function createCopies() {
        viewport
            .querySelectorAll(
                '[data-md-clone="1"]'
            )
            .forEach(
                item => item.remove()
            );
        /* ORIGINAL */
        originals.forEach(
            (
                card,
                index
            ) => {
                card.dataset.mdSet =
                    '0';
                card.dataset.mdIndex =
                    String(index);
            }
        );
        /* LEFT COPY */
        originals.forEach(
            (
                original,
                index
            ) => {
                const clone =
                    original.cloneNode(true);
                // Register cloned captions independently in the intro sequence.
                clone.querySelectorAll('.scram').forEach(label=>{
                    delete label.dataset.mdScramPrepared;
                    delete label.dataset.mdScramDone;
                    label.classList.remove('md-scram-waiting','md-scram-fading');
                    label.inert=false;
                });
                clone.dataset.mdClone =
                    '1';
                clone.dataset.mdSet =
                    '-1';
                clone.dataset.mdIndex =
                    String(index);
                clone.setAttribute(
                    'aria-hidden',
                    'true'
                );
                clone.tabIndex =
                    -1;
                viewport.appendChild(
                    clone
                );
            }
        );
        /* RIGHT COPY */
        originals.forEach(
            (
                original,
                index
            ) => {
                const clone =
                    original.cloneNode(true);
                // Register cloned captions independently in the intro sequence.
                clone.querySelectorAll('.scram').forEach(label=>{
                    delete label.dataset.mdScramPrepared;
                    delete label.dataset.mdScramDone;
                    label.classList.remove('md-scram-waiting','md-scram-fading');
                    label.inert=false;
                });
                clone.dataset.mdClone =
                    '1';
                clone.dataset.mdSet =
                    '1';
                clone.dataset.mdIndex =
                    String(index);
                clone.setAttribute(
                    'aria-hidden',
                    'true'
                );
                clone.tabIndex =
                    -1;
                viewport.appendChild(
                    clone
                );
            }
        );
        cards = [
            ...viewport.querySelectorAll(
                '.md-work-card'
            )
        ];
        cardData =
            cards.map(
                card => {
                    return {
                        card,
                        set:
                            Number(
                                card.dataset.mdSet
                            ),
                        index:
                            Number(
                                card.dataset.mdIndex
                            ),
                        title:card.querySelector('.md-work-card__title'),
                        number:card.querySelector('.md-work-card__number'),
                        captionSpace:0,
                        image:
                            card.querySelector(
                                '.md-work-card__image-inner'
                            )
                    };
                }
            );
        cards.forEach(card=>{const image=card.querySelector('img');if(image){image.loading='eager';image.decode?.().catch(()=>{});}});
        bindCardEvents();
    }
    /* =========================================================
       AUTOSCALE
    ========================================================= */
    function measureScale() {
        const localWidth =
            root.offsetWidth;
        const visualWidth =
            root
                .getBoundingClientRect()
                .width;
        if (
            localWidth > 0 &&
            visualWidth > 0
        ) {
            scaleX =
                visualWidth /
                localWidth;
        } else {
            scaleX =
                1;
        }
        if (
            !Number.isFinite(scaleX) ||
            scaleX <= 0
        ) {
            scaleX =
                1;
        }
    }
    /* =========================================================
       MEASURE
    ========================================================= */
    function measure() {
        viewportWidth =
            viewport.clientWidth;
        gap =
            parseFloat(
                getComputedStyle(root)
                    .getPropertyValue(
                        '--gap'
                    )
            ) || 8;
        /*
        =====================================================
        ВАЖНО:
        ШИРИНА СЧИТАЕТСЯ НЕ ОТ TOTAL_COUNT.
        На экране всегда ровно 6 карточек.
        =====================================================
        */
        cardWidth =
            (
                viewportWidth -
                gap *
                (
                    VISIBLE_COUNT -
                    1
                )
            )
            /
            VISIBLE_COUNT;
        step =
            cardWidth +
            gap;
        /*
        А длина loop уже считается
        по ВСЕМ проектам.
        */
        loopWidth =
            step *
            TOTAL_COUNT;
        cards.forEach(
            card => {
                card.style.width =
                    `${cardWidth}px`;
            }
        );
        const imageHeight=originals[0]?.querySelector('.md-work-card__image')?.clientHeight||120;
        imageClip.setAttribute('width',viewportWidth);imageClip.setAttribute('height',imageHeight);imageClip.setAttribute('rx','12');imageClip.setAttribute('ry','12');
        captionClip.setAttribute('y',imageHeight);captionClip.setAttribute('width',viewportWidth);captionClip.setAttribute('height',Math.max(0,viewport.clientHeight-imageHeight));
        measureScale();
        cardData.forEach(data=>{data.captionSpace=Math.max(0,(data.number?.offsetLeft||0)-(data.title?.offsetWidth||0)-6);});
    }
    /* =========================================================
       RENDER
    ========================================================= */
    function render() {
        if (
            !cardWidth ||
            !loopWidth
        ) {
            return;
        }
        const maxImageX =
            cardWidth *
            SETTINGS.maxParallaxRatio;
        cardData.forEach(
            data => {
                const baseX =
                    data.set *
                    loopWidth
                    +
                    data.index *
                    step;
                const period=loopWidth*3;
                const x=((baseX+position+loopWidth)%period+period)%period-loopWidth;
                data.card.style.transform =
                    `translate3d(
                        ${x}px,
                        0,
                        0
                    )`;
                // Pin edge captions until their title and number meet.
                if(data.title)data.title.style.transform=`translateX(${clamp(-x,0,data.captionSpace)}px)`;
                if(data.number)data.number.style.transform=`translateX(${-clamp(x+cardWidth-viewportWidth,0,data.captionSpace)}px)`;
                /* =================================================
                   PARALLAX
                ================================================= */
                const centerX =
                    x +
                    cardWidth *
                    0.5;
                const progress =
                    (
                        centerX -
                        viewportWidth *
                        0.5
                    )
                    /
                    (
                        viewportWidth *
                        0.5 +
                        cardWidth *
                        0.5
                    );
                const imageX =
                    clamp(
                        -progress *
                        cardWidth *
                        SETTINGS.parallax,
                        -maxImageX,
                        maxImageX
                    );
                if (
                    data.image
                ) {
                    data.image.style.transform =
                        `translate3d(
                            ${imageX}px,
                            0,
                            0
                        )`;
                }
            }
        );
    }
    /* =========================================================
       LOOP
    ========================================================= */
    function normalizeLoop() {
        while (
            position <=
            -loopWidth*3
        ) {
            position +=
                loopWidth*3;
            target +=
                loopWidth*3;
            snapTarget +=
                loopWidth*3;
            dragStartTarget +=
                loopWidth*3;
        }
        while (
            position >=
            loopWidth*3
        ) {
            position -=
                loopWidth*3;
            target -=
                loopWidth*3;
            snapTarget -=
                loopWidth*3;
            dragStartTarget -=
                loopWidth*3;
        }
    }
    /* =========================================================
       AUTO SCROLL
    ========================================================= */
    root.addEventListener('pointerenter',()=>{galleryHovered=true;stopAutoScrollTimer();target=position;wheelInput=wheelVelocity=dragInertia=0;snapping=false;});
    root.addEventListener('pointerleave',()=>{galleryHovered=false;scheduleAutoScroll();mdWake();});
    function stopAutoScrollTimer() {
        if (autoScrollTimer) {
            clearTimeout(
                autoScrollTimer
            );
            autoScrollTimer = null;
        }
    }
    function scheduleAutoScroll() {
        stopAutoScrollTimer();
        if (
            !SETTINGS.autoScrollEnabled || galleryHovered
        ) {
            return;
        }
        autoScrollTimer =
            setTimeout(
                () => {
                    if (
                        dragging
                    ) {
                        scheduleAutoScroll();
                        return;
                    }
                    snapping = false;
                    wheelInput = 0;
                    wheelVelocity = 0;
                    dragInertia = 0;
                    /*
                    Двигаем ровно на одну карточку влево.
                    Сначала привязываемся к ближайшему шагу,
                    чтобы со временем не накапливалась ошибка.
                    */
                    const baseTarget =
                        Math.round(
                            target /
                            step
                        )
                        *
                        step;
                    target =
                        baseTarget -
                        step;
                    snapTarget =
                        target;
                    mdWake();
                    lastInteractionTime =
                        performance.now();
                    scheduleAutoScroll();
                },
                SETTINGS.autoScrollDelay
            );
    }
    function resetAutoScroll() {
        mdWake();
        if (
            SETTINGS.autoScrollEnabled
        ) {
            scheduleAutoScroll();
        }
    }
    /* =========================================================
       SNAP
    ========================================================= */
    function startSnap() {
        if (
            !SETTINGS.snapEnabled
        ) {
            return;
        }
        snapTarget =
            Math.round(
                target /
                step
            )
            *
            step;
        snapping =
            true;
    }
    /* =========================================================
       TICK
    ========================================================= */
    let mdFrame=0,mdInView=true;
    function mdWake(){if(!mdFrame&&!document.hidden&&mdInView)mdFrame=requestAnimationFrame(tick);}
    function tick() {
        mdFrame=0;if(document.hidden||!mdInView)return;
        const now =
            performance.now();
        /* =====================================================
           WHEEL
        ===================================================== */
        if (
            !dragging &&
            !snapping
        ) {
            wheelVelocity =
                lerp(
                    wheelVelocity,
                    wheelInput,
                    SETTINGS.wheelEase
                );
            wheelInput *=
                SETTINGS.wheelFriction;
            target +=
                wheelVelocity;
            wheelVelocity *=
                SETTINGS.wheelFriction;
            if (
                Math.abs(
                    wheelInput
                ) < 0.001
            ) {
                wheelInput =
                    0;
            }
            if (
                Math.abs(
                    wheelVelocity
                ) < 0.001
            ) {
                wheelVelocity =
                    0;
            }
        }
        /* =====================================================
           DRAG INERTIA
        ===================================================== */
        if (
            !dragging &&
            !snapping &&
            Math.abs(
                dragInertia
            ) > 0.001
        ) {
            target +=
                dragInertia;
            dragInertia *=
                SETTINGS.dragFriction;
        } else if (
            !dragging &&
            !snapping
        ) {
            if (
                Math.abs(
                    dragInertia
                ) < 0.001
            ) {
                dragInertia =
                    0;
            }
        }
        /* =====================================================
           SNAP CHECK
        ===================================================== */
        if (
            SETTINGS.snapEnabled &&
            !dragging &&
            !snapping
        ) {
            const wheelStopped =
                Math.abs(
                    wheelInput
                )
                <
                SETTINGS.snapVelocityThreshold
                &&
                Math.abs(
                    wheelVelocity
                )
                <
                SETTINGS.snapVelocityThreshold;
            const dragStopped =
                Math.abs(
                    dragInertia
                )
                <
                SETTINGS.snapVelocityThreshold;
            const delayPassed =
                now -
                lastInteractionTime
                >
                SETTINGS.snapDelay;
            if (
                wheelStopped &&
                dragStopped &&
                delayPassed
            ) {
                startSnap();
            }
        }
        /* =====================================================
           SNAP MOVE
        ===================================================== */
        if (
            snapping
        ) {
            target =
                lerp(
                    target,
                    snapTarget,
                    SETTINGS.snapSpeed
                );
            if (
                Math.abs(
                    snapTarget -
                    target
                ) < 0.02
            ) {
                target =
                    snapTarget;
                snapping =
                    false;
            }
        }
        /* =====================================================
           FOLLOW
        ===================================================== */
        position =
            lerp(
                position,
                target,
                SETTINGS.follow
            );
        if (
            Math.abs(
                target -
                position
            ) < 0.001
        ) {
            position =
                target;
        }
        normalizeLoop();
        render();
        if(dragging||snapping||Math.abs(target-position)>.001||Math.abs(wheelInput)>.001||Math.abs(wheelVelocity)>.001||Math.abs(dragInertia)>.001||now-lastInteractionTime<SETTINGS.snapDelay+20)mdWake();
    }
    /* =========================================================
       DRAG START
    ========================================================= */
    function pointerDown(
        event
    ) {
        if (
            event.pointerType ===
            'mouse'
            &&
            event.button !== 0
        ) {
            return;
        }
        if (
            event.pointerType ===
            'mouse'
        ) {
            event.preventDefault();
        }
        measureScale();
        dragging =
            true;
        snapping =
            false;
        activePointerId =
            event.pointerId;
        wheelInput =
            0;
        wheelVelocity =
            0;
        dragInertia =
            0;
        dragStartX =
            event.clientX;
        dragStartTarget =
            target;
        previousX =
            event.clientX;
        previousTime =
            performance.now();
        dragVelocity =
            0;
        dragDistance =
            0;
        lastInteractionTime =
            performance.now();
        resetAutoScroll();
        viewport.classList.add(
            'is-dragging'
        );
        try {
            viewport.setPointerCapture(
                event.pointerId
            );
        } catch (error) {}
    }
    /* =========================================================
       DRAG MOVE
    ========================================================= */
    function pointerMove(
        event
    ) {
        if (!dragging) {
            return;
        }
        if (
            activePointerId !== null &&
            event.pointerId !==
            activePointerId
        ) {
            return;
        }
        const now =
            performance.now();
        const screenDistance =
            event.clientX -
            dragStartX;
        const localDistance =
            screenDistance /
            scaleX;
        target =
            dragStartTarget +
            localDistance *
            SETTINGS.dragMultiplier;
        const screenDX =
            event.clientX -
            previousX;
        const localDX =
            screenDX /
            scaleX;
        const dt =
            Math.max(
                8,
                now -
                previousTime
            );
        const instantVelocity =
            localDX /
            dt *
            16.6667;
        dragVelocity =
            lerp(
                dragVelocity,
                instantVelocity,
                0.38
            );
        dragDistance +=
            Math.abs(
                screenDX
            );
        previousX =
            event.clientX;
        previousTime =
            now;
        lastInteractionTime =
            now;
    }
    /* =========================================================
       DRAG END
    ========================================================= */
    function pointerUp(
        event
    ) {
        if (!dragging) {
            return;
        }
        if (
            activePointerId !== null &&
            event.pointerId !==
            activePointerId
        ) {
            return;
        }
        dragging =
            false;
        activePointerId =
            null;
        viewport.classList.remove(
            'is-dragging'
        );
        dragInertia =
            clamp(
                dragVelocity *
                SETTINGS.dragThrow,
                -SETTINGS.maxDragThrow,
                SETTINGS.maxDragThrow
            );
        lastInteractionTime =
            performance.now();
        try {
            viewport.releasePointerCapture(
                event.pointerId
            );
        } catch (error) {}
    }
    /* =========================================================
       GLOBAL WHEEL
    ========================================================= */
    function onWheel(
        event
    ) {
        snapping =
            false;
        let delta;
        if (
            Math.abs(
                event.deltaX
            )
            >
            Math.abs(
                event.deltaY
            )
        ) {
            delta =
                event.deltaX;
        } else {
            delta =
                event.deltaY;
        }
        if (
            event.deltaMode === 1
        ) {
            delta *=
                16;
        }
        else if (
            event.deltaMode === 2
        ) {
            delta *=
                window.innerHeight;
        }
        /*
        Tilda AutoScale.
        */
        delta /=
            scaleX;
        /*
        Scroll down = slider left.
        */
        delta *=
            -SETTINGS.wheelMultiplier;
        const impulse =
            clamp(
                delta,
                -SETTINGS.maxWheelInput,
                SETTINGS.maxWheelInput
            );
        if(Math.abs(impulse)>.01)window.dispatchEvent(new CustomEvent('md:gallery-scroll-sound',{detail:{speed:Math.abs(impulse),direction:Math.sign(impulse)}}));
        wheelInput +=
            impulse;
        wheelInput =
            clamp(
                wheelInput,
                -SETTINGS.maxWheelInput * 2,
                SETTINGS.maxWheelInput * 2
            );
        lastInteractionTime =
            performance.now();
        resetAutoScroll();
    }
    /* =========================================================
       CARD EVENTS
    ========================================================= */
    const bound =
        new WeakSet();
    function bindCardEvents() {
        cards.forEach(
            card => {
                if (
                    bound.has(
                        card
                    )
                ) {
                    return;
                }
                bound.add(
                    card
                );
                card.addEventListener(
                    'click',
                    event => {
                        if (
                            dragDistance >
                            6
                        ) {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }
                );
                card.addEventListener(
                    'dragstart',
                    event => {
                        event.preventDefault();
                    }
                );
                card
                    .querySelectorAll(
                        'img'
                    )
                    .forEach(
                        img => {
                            img.draggable =
                                false;
                        }
                    );
            }
        );
    }
    /* =========================================================
       RESIZE
    ========================================================= */
    let resizeTimer;
    window.addEventListener(
        'resize',
        () => {
            clearTimeout(
                resizeTimer
            );
            resizeTimer =
                setTimeout(
                    () => {
                        measure();
                        render();
                    },
                    60
                );
        }
    );
    /* =========================================================
       TILDA AUTOSCALE
    ========================================================= */
    if (
        typeof ResizeObserver !==
        'undefined'
    ) {
        const observer =
            new ResizeObserver(
                () => {
                    measureScale();
                }
            );
        observer.observe(
            root
        );
    }
    /* =========================================================
       EVENTS
    ========================================================= */
    viewport.addEventListener(
        'pointerdown',
        pointerDown,
        {
            passive: false
        }
    );
    window.addEventListener(
        'pointermove',
        pointerMove,
        {
            passive: true
        }
    );
    window.addEventListener(
        'pointerup',
        pointerUp,
        {
            passive: true
        }
    );
    window.addEventListener(
        'pointercancel',
        pointerUp,
        {
            passive: true
        }
    );
    window.addEventListener(
        'wheel',
        onWheel,
        {
            passive: true
        }
    );
    /* =========================================================
       INIT
    ========================================================= */
    createCopies();
    measure();
    render();
    mdWake();
    scheduleAutoScroll();

 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(mdFrame);mdFrame=0;stopAutoScrollTimer();}else if(mdInView){mdWake();scheduleAutoScroll();}});
 if(typeof IntersectionObserver!=='undefined'){new IntersectionObserver(entries=>{mdInView=entries[0].isIntersecting;if(mdInView&&!document.hidden){mdWake();scheduleAutoScroll();}else{cancelAnimationFrame(mdFrame);mdFrame=0;stopAutoScrollTimer();}}).observe(root);}

}

(() => {
  'use strict';
  if(window.__MD_TEXT_SEQUENCE__)return;window.__MD_TEXT_SEQUENCE__=true;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const records=[];let started=false,finished=false,watchdog,frame=0;
  const pools={narrow:'il1|!·:;',medium:'abcdefgjkrsuvxz?=+-',wide:'WMQOHD@&%#*'};
  const characterStepMs=30,lineStepMs=200;
  window.MD_INTRO_SEQUENCE={phase:'waiting'};
  function prepare(){
    for(const host of document.querySelectorAll('.scram')){
      if(host.dataset.mdScramPrepared==='1'||host.parentElement?.closest('.scram'))continue;
      if(host.matches('[data-elem-id="1791120047222000001"]')){host.dataset.mdScramPrepared='1';continue;}
      // Groups may contain several atoms (for example the city clocks).
      const targets=host.matches('.tn-atom')?[host]:[...host.querySelectorAll('.tn-atom')];
      host.dataset.mdScramPrepared='1';
      for(const target of targets.length?targets:[host]){
        target.classList.add('md-scram-waiting');
        const label=target.querySelector('.tn-atom__button-text')||target;
        records.push({host,target,label,inert:host.inert,chars:[],opacity:target.style.opacity});
      }
      host.inert=true;
    }
  }
  function finishAll(){
    if(finished)return;finished=true;clearTimeout(watchdog);cancelAnimationFrame(frame);
    records.forEach(r=>{
      r.layer?.remove();
      r.sources?.forEach(source=>source.replaceWith(...source.childNodes));
      if(r.position!==undefined)r.target.style.position=r.position;
      r.target.style.opacity=r.opacity;
      r.target.classList.remove('md-scram-waiting','md-scram-fading');r.host.inert=r.inert;r.host.dataset.mdScramDone='1';
    });
    window.MD_INTRO_SEQUENCE={phase:'ready'};document.dispatchEvent(new CustomEvent('md:text-ready'));
  }
  function splitRecord(record, attach=true){
    const target=record.target, bounds=target.getBoundingClientRect(), style=getComputedStyle(target);
    const scaleX=bounds.width/(parseFloat(style.width)||target.offsetWidth||1);
    const scaleY=bounds.height/(parseFloat(style.height)||target.offsetHeight||1);
    const walker=document.createTreeWalker(record.label,NodeFilter.SHOW_TEXT);
    const nodes=[];while(walker.nextNode()){
      if(walker.currentNode.textContent.trim()&&!walker.currentNode.parentElement.closest('script,style,canvas,svg'))nodes.push(walker.currentNode);
    }
    record.sources=[];record.position=target.style.position;
    const layer=document.createElement('span');layer.className='md-scramble-layer';layer.setAttribute('aria-hidden','true');
    record.layer=layer;
    // Measure the untouched text with Range, retaining its actual right-aligned lines.
    for(const node of nodes){
      const font=getComputedStyle(node.parentElement);let offset=0;
      for(const original of Array.from(node.textContent)){
        const range=document.createRange();range.setStart(node,offset);offset+=original.length;range.setEnd(node,offset);
        if(/\s/u.test(original))continue;
        const rect=range.getBoundingClientRect();
        if(!rect.width||!rect.height)continue;
        const span=document.createElement('span');span.className='md-scramble-char';span.textContent=original;
        const width=rect.width/scaleX,height=rect.height/scaleY;
        Object.assign(span.style,{left:(rect.left-bounds.left)/scaleX+'px',top:(rect.top-bounds.top)/scaleY+'px',width:width+'px',height:height+'px',font:font.font,letterSpacing:font.letterSpacing,lineHeight:height+'px',color:font.color});
        layer.append(span);
        record.chars.push({span,original,top:Math.round(rect.top/3)*3,width,steps:4+Math.floor(Math.random()*3),lastFrame:-1});
      }
    }
    record.attach=()=>{
      for(const node of nodes){
        const source=document.createElement('span');source.className='md-scramble-source';
        node.replaceWith(source);source.append(node);record.sources.push(source);
      }
      if(style.position==='static')target.style.position='relative';
      target.append(layer);
    };
    if(attach)record.attach();
    const lineCounts=new Map();
    for(const char of record.chars){
      if(!lineCounts.has(char.top))lineCounts.set(char.top,{index:lineCounts.size,count:0});
      const line=lineCounts.get(char.top);
      char.delay=line.index*lineStepMs+line.count++*characterStepMs;
      char.pool=pools[char.width<=6?'narrow':char.width<=10?'medium':'wide'];
    }
  }
  function paintCharacter(char,elapsed){
    if(char.settled)return;
    const step=Math.floor((elapsed-char.delay)/characterStepMs);
    if(step<0||step===char.lastFrame)return;
    const active=step<char.steps;
    if(char.lastFrame<0)char.span.classList.toggle('md-scramble-glow',active);
    char.span.style.opacity=active?String(.75+.25*Math.sin(Math.PI*(step+1)/(char.steps+1))):'1';
    if(!active)char.span.classList.remove('md-scramble-glow');
    char.lastFrame=step;
    // Reuse the text node; never replace glyph DOM during playback.
    char.span.firstChild.data=active?char.pool[Math.floor(Math.random()*char.pool.length)]:char.original;
    char.settled=!active;
  }
  // Shared by the page intro and project popovers; preserve the measured text layout.
  window.MD_SCRAMBLE={animate(target){
    const record={target,label:target,chars:[],sources:[]};
    if(reduced.matches)return {finished:Promise.resolve(),cancel(){}};
    splitRecord(record);
    let raf=0,done=false,resolve;
    const finished=new Promise(r=>{resolve=r;});
    const duration=Math.max(0,...record.chars.map(c=>c.delay+c.steps*characterStepMs));
    const startTime=performance.now();
    function finish(){
      if(done)return;done=true;cancelAnimationFrame(raf);
      record.layer?.remove();record.sources.forEach(source=>source.replaceWith(...source.childNodes));
      target.style.position=record.position;resolve();
    }
    function tick(now){
      const elapsed=now-startTime;
      for(const char of record.chars)paintCharacter(char,elapsed);
      if(elapsed>=duration){finish();return;}raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
    return {finished,cancel:finish};
  }};
  function start(){
    if(started||finished)return;started=true;clearTimeout(watchdog);prepare();
    if(reduced.matches){finishAll();return;}
    const setupStart=performance.now();
    const galleryViewport=document.querySelector('.md-work-slider__viewport')?.getBoundingClientRect();
    const left=Math.max(0,galleryViewport?.left||0),right=Math.min(innerWidth,galleryViewport?.right??innerWidth);
    const skipped=[];
    // Repeated carousel sets outside the viewport keep their final text.
    for(let i=records.length-1;i>=0;i--){
      const card=records[i].host.closest('.md-work-card');
      if(!card)continue;
      const rect=card.getBoundingClientRect();
      if(rect.right<=left||rect.left>=right)skipped.push(...records.splice(i,1));
    }
    records.forEach(record=>splitRecord(record,false));
    // Batch writes after reads to avoid forcing layout once per label.
    records.forEach(record=>record.attach());
    skipped.forEach(record=>{
      record.target.classList.remove('md-scram-waiting','md-scram-fading');
      record.host.inert=record.inert;record.host.dataset.mdScramDone='1';
    });
    document.documentElement.dataset.mdTextSetupMs=(performance.now()-setupStart).toFixed(1);
    document.documentElement.dataset.mdTextGlyphs=String(records.reduce((n,r)=>n+r.chars.length,0));
    document.documentElement.dataset.mdTextSkippedLabels=String(skipped.length);
    records.forEach(record=>{record.firstDelay=record.chars.length?Math.min(...record.chars.map(c=>c.delay)):0;});
    const duration=Math.max(750,...records.flatMap(r=>r.chars.map(c=>c.delay+c.steps*characterStepMs)));
    const now=performance.now();window.MD_INTRO_SEQUENCE={phase:'revealing',start:now,duration};
    window.dispatchEvent(new CustomEvent('md:text-reveal',{detail:window.MD_INTRO_SEQUENCE}));
    document.documentElement.dataset.mdTextStartedAt=now.toFixed(1);
    records.forEach(r=>r.target.classList.remove('md-scram-waiting'));
    function tick(time){
      const elapsed=time-now;
      for(const record of records){
        if(record.host.id==='md-sound-toggle'&&!record.soundReady&&elapsed>=record.firstDelay){record.soundReady=true;record.host.classList.add('md-sound-ready');}
        if(!record.chars.length&&!record.fadeDone){record.target.style.opacity=String(Math.min(1,elapsed/450));record.fadeDone=elapsed>=450;}
        for(const char of record.chars)paintCharacter(char,elapsed);
      }
      if(elapsed>=duration){finishAll();return;}
      frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
  }
  document.addEventListener('md:gallery-ready',start);
  reduced.addEventListener?.('change',e=>{if(e.matches&&started)finishAll();});
  function init(){prepare();watchdog=setTimeout(()=>{if(!started){finishAll();window.dispatchEvent(new CustomEvent('md:text-reveal',{detail:{phase:'error'}}));}},35000);if(document.querySelector('#md-work-slider')?.dataset.mdIntro==='ready')start();}
  if(document.readyState==='loading')window.MD_ON_READY(init,{once:true});else init();
})();

/* GN liquid button: WebGL volume, shared GPU context, no binary symbols. */
(() => {
  'use strict';
  if(window.__GN_TALK_BUTTON__)return;
  window.__GN_TALK_BUTTON__=true;
  const selector='.gn-talk, .tn-elem[data-elem-id="1791120047222000001"]';
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const controllers=[];
  let latest=window.MD_INTRO_SEQUENCE,fallback=0,gpu,singleTarget=false;
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
    // XY corner radius follows CSS independently of the shallow Z bevel.
    float radius=clamp(uRadius,0.,min(halfSize.x,halfSize.y));
    vec2 q=abs(p.xy)-(halfSize.xy-vec2(radius));
    float outline=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;
    float bevel=min(1.,halfSize.z*.4);
    vec2 d=vec2(outline+bevel,abs(p.z)-halfSize.z+bevel);
    float box=length(max(d,0.))+min(max(d.x,d.y),0.)-bevel;
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
    canvas.className='gn-talk-webgl';canvas.style.display='block';canvas.setAttribute('aria-hidden','true');
    const ctx=direct?null:canvas.getContext('2d');const host=atom.parentElement;host.appendChild(canvas);
    atom.dataset.gnTalkSurface=direct?'direct-webgl':'shared-copy';
    if(getComputedStyle(host).position==='static')host.classList.add('gn-talk-relative');
    let animation=null,raf=0,revealed=false,texture=null,width=0,height=0,metrics=null,radius=4,base=[0,0,0],text=[1,1,1];
    let pauseAt=0;

    function finish(){
      if(raf)cancelAnimationFrame(raf);raf=0;animation=null;revealed=true;
      atom.classList.add('md-talk-return');atom.classList.remove('md-talk-hidden');canvas.style.opacity='0';
      atom.dataset.gnTalkState='ready';atom.dataset.gnTalkProgress='1.000';
    }
    function prepare(){
      if(!gpu||gpu.gl.isContextLost()||(!direct&&!ctx))return false;
      const measured=measurePixels(atom),{w,h}=measured;
      if(texture&&width===w&&height===h&&metrics?.pw===measured.pw&&metrics?.ph===measured.ph)return true;
      width=w;height=h;metrics=measured;
      Object.assign(canvas.style,{left:(atom.offsetLeft-8)+'px',top:(atom.offsetTop-8)+'px',width:(w+16)+'px',height:(h+16)+'px'});
      atom.dataset.gnTalkBuffer=`${metrics.pw}x${metrics.ph}`;
      const cs=getComputedStyle(atom),label=atom.querySelector('.tn-atom__button-text')||atom,ls=getComputedStyle(label);
      if(!animation){base=color(cs.backgroundColor);const cssRadius=parseFloat(cs.borderRadius);radius=Number.isFinite(cssRadius)?cssRadius:4;}
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
      if(raw>=1){paint(1,(now-animation.start)/1000);finish();return;}
      if(!prepare()){finish();return;}
      paint(1-(1-raw)*(1-raw),(now-animation.start)/1000);
      if(animation)raf=requestAnimationFrame(frame);
    }
    function play(start,duration){
      if(motion.matches||!prepare()){atom.dataset.gnTalkGpu=motion.matches?'reduced-motion':'unavailable';finish();return;}
      if(raf)cancelAnimationFrame(raf);
      animation={start,duration:Math.max(50,duration)};revealed=false;
      atom.classList.add('md-talk-hidden');canvas.style.opacity='1';
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
      if(document.hidden){pauseAt=performance.now();if(raf)cancelAnimationFrame(raf);raf=0;}
      else if(animation&&!raf){if(pauseAt){animation.start+=performance.now()-pauseAt;pauseAt=0;}raf=requestAnimationFrame(frame);}
    }};
    controllers.push(controller);
    if(motion.matches||!gpu||(!direct&&!ctx))atom.dataset.gnTalkGpu=motion.matches?'reduced-motion':'unavailable';
    // Warm the small shader/label before the character starts its reveal.
    if(prepare())paint(0,0,false);
    atom.dataset.gnTalkState='waiting';atom.classList.add('md-talk-hidden');canvas.style.opacity='0';sync(latest);
    if(document.fonts?.ready)document.fonts.ready.then(()=>{width=0;if(animation)prepare();});
  }
  window.addEventListener('md:text-reveal',event=>{
    latest=event.detail;
    if(fallback&&latest?.phase!=='waiting')clearTimeout(fallback);
    controllers.forEach(c=>c.sync(latest));
  });
  document.addEventListener('visibilitychange',()=>controllers.forEach(c=>c.visibility()));
  motion.addEventListener('change',()=>{if(motion.matches)controllers.forEach(c=>c.finish());});
  function init(){const targets=document.querySelectorAll(selector);singleTarget=targets.length===1;
    gpu=motion.matches?null:createGpu();targets.forEach(mount);
    if(controllers.length&&(!latest||latest.phase==='waiting'))fallback=setTimeout(()=>controllers.forEach(c=>c.fallback()),35000);}
  if(document.readyState==='loading')window.MD_ON_READY(init,{once:true});else init();
})();

(() => {
  'use strict';
  const SETTINGS={...window.MD_GALLERY_MOTION.defaults,flyCount:6,headSelector:'#gn-head-wrap',headCenterX:.5,headCenterY:.5};
  let root,viewport,originals,layer,flights=[],frame=0,start=0,started=false,finished=false,headReady=false,headAnchor,imagesReady=false,pauseAt=0,timeout,headDelay;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function restore(){
    if(finished||!root)return;finished=true;window.MD_GALLERY_LOOK_TARGET=null;window.MD_GALLERY_APPROACH=true;
    cancelAnimationFrame(frame);frame=0;clearTimeout(timeout);clearTimeout(headDelay);layer?.remove();rearLayer?.remove();if(headLayer)headLayer.style.zIndex=headLayerZ;
    root.dataset.mdIntro='ready';root.inert=false;root.setAttribute('aria-busy','false');
    root.dataset.mdIntroProgress='1.000';
    mountOriginalGallery();
    root.dispatchEvent(new CustomEvent('md:gallery-ready',{bubbles:true}));
    window.removeEventListener('md:head-reveal',onHead);
    window.removeEventListener('resize',onResize);window.removeEventListener('scroll',onScroll);
  }
  function prepareCells(){
    const count=Number(root.dataset.visibleCount)||6;
    const gap=parseFloat(getComputedStyle(root).getPropertyValue('--gap'))||8;
    const width=Math.max(1,(viewport.clientWidth-gap*(count-1))/count),step=width+gap;
    originals.forEach((card,i)=>{
      card.style.width=width+'px';card.style.transform=`translate3d(${i*step}px,0,0)`;
      const progress=(i*step+width*.5-viewport.clientWidth*.5)/(viewport.clientWidth*.5+width*.5);
      const offset=clamp(-progress*width*.18,-width*.075,width*.075);
      card.dataset.mdCropRatio=String(offset/width);
      card.querySelector('.md-work-card__image-inner').style.transform=`translate3d(${offset}px,0,0)`;
    });
  }
  function dimensions(){
    const head=document.querySelector(SETTINGS.headSelector)?.getBoundingClientRect();
    const h=head&&head.width&&head.height?head:{left:0,top:0,width:innerWidth,height:innerHeight};
    const headX=h.left+h.width*(headAnchor?.relativeX??SETTINGS.headCenterX),headY=h.top+h.height*(headAnchor?.relativeY??SETTINGS.headCenterY);
    const headSize=h.height*(headAnchor?.relativeHeight??.292);
    const bounds=viewport.getBoundingClientRect();
    const top=Math.max(75,h.top+h.height*.055);
    const chin=headY+headSize*.5;
    const bottom=Math.min(bounds.top-45,chin+headSize*.66);
    const radius=Math.max(50,(bottom-top)*.5);
    const orbit={x:headX,y:(top+bottom)*.5,originX:headX,originY:chin+30,
      headX,headY,headSize,rx:Math.min(radius,innerWidth-headX-65),ry:radius,top,bottom,left:bounds.left,right:bounds.right};
    root.dataset.mdHeadCenter=`${headX.toFixed(1)},${headY.toFixed(1)}`;
    flights.forEach(f=>{
      const rect=f.card.querySelector('.md-work-card__image').getBoundingClientRect();
      f.destination={x:rect.left+rect.width*.5,y:rect.top+rect.height*.5,width:rect.width,height:rect.height,laneIndex:f.cardIndex};
      f.outside=rect.right<=bounds.left||rect.left>=bounds.right;
      f.crop=Number(f.card.dataset.mdCropRatio)||0;
      f.radius=parseFloat(getComputedStyle(f.card.querySelector('.md-work-card__image')).borderRadius)||12;
      f.radius*=rect.width/Math.max(1,f.card.clientWidth);
    });
    orbit.row=flights[0]?.destination.y;
    orbit.firstX=flights[0]?.destination.x;
    orbit.lastX=flights.at(-1)?.destination.x;
    return orbit;
  }
  function tick(now){
    frame=0;if(finished||document.hidden)return;
    const elapsed=now-start;let allDone=true;
    for(const f of flights){
      if(f.landed)continue;
      const pose=window.MD_GALLERY_MOTION.frameAt(elapsed,f.index,orbit,f.destination,SETTINGS);
      if(f.cardIndex===5)window.MD_GALLERY_LOOK_TARGET=pose.done?null:{x:pose.x,y:pose.y,headX:orbit.headX,headY:orbit.headY,headSize:orbit.headSize,weight:1-(pose.landing||0)*(pose.landing||0)*(3-2*(pose.landing||0))};
      if(f.cardIndex===5 && (pose.landing||0)>.35)window.MD_GALLERY_APPROACH=true;
      if(pose.done){f.landed=true;f.card.dataset.mdLanded='1';f.node.remove();continue;}
      allDone=false;
      const flightLayer=pose.z<-1?rearLayer:layer;
      if(f.node.parentNode!==flightLayer)flightLayer.appendChild(f.node);
      f.node.style.transform=`translate3d(${pose.x-pose.width*.5}px,${pose.y-pose.height*.5}px,0) perspective(900px) translateZ(${pose.z||0}px) rotate(${pose.angle}deg)`;
      if(f.lastWidth!==pose.width){f.node.style.width=pose.width+'px';f.lastWidth=pose.width;}
      if(f.lastHeight!==pose.height){f.node.style.height=pose.height+'px';f.lastHeight=pose.height;}
      const landing=pose.landing||0;
      const cropBlend=pose.expansion||0;
      f.inner.style.transform=`translate3d(${f.crop*pose.width*cropBlend}px,0,0)`;
      const corner=Math.max(12,12+(f.radius-12)*cropBlend);
      f.node.style.borderRadius=corner+'px';
      f.node.style.clipPath=`inset(0 round ${corner}px)`;
      f.node.style.opacity=String(pose.opacity*(f.outside?1-clamp((landing-.45)/.55,0,1):1));
    }
    root.dataset.mdIntroProgress=String(Math.min(1,elapsed/(SETTINGS.launchMs+SETTINGS.orbitMs+SETTINGS.landMs+(flights.length-1)*SETTINGS.staggerMs)).toFixed(3));
    if(allDone){restore();return;}frame=requestAnimationFrame(tick);
  }
  let orbit,rearLayer,headLayer,headLayerZ;
  function tryStart(){
    if(!root||started||finished||!headReady||!imagesReady)return;
    clearTimeout(timeout);
    if(document.hidden)return;
    if(motion.matches){restore();return;}
    if(originals.slice(0,SETTINGS.flyCount).some(card=>!card.querySelector('img')?.naturalWidth)){restore();return;}
    started=true;clearTimeout(timeout);prepareCells();root.dataset.mdIntro='flying';
    layer=document.createElement('div');layer.className='md-gallery-flight-layer';layer.setAttribute('aria-hidden','true');document.body.appendChild(layer);layer.style.zIndex='10000001';
    rearLayer=layer.cloneNode(false);rearLayer.style.zIndex='9999998';document.body.appendChild(rearLayer);
    headLayer=document.querySelector(SETTINGS.headSelector)?.closest('.tn-elem');
    if(headLayer){headLayerZ=headLayer.style.zIndex;headLayer.style.zIndex='9999999';}
    const count=Math.min(SETTINGS.flyCount,originals.length);
    flights=originals.slice(0,count).map((card,index)=>{
      const node=document.createElement('div');node.className='md-gallery-flight';node.style.opacity='0';
      node.style.zIndex=String(count-index);
      const inner=document.createElement('div');inner.className='md-gallery-flight__inner';
      const img=card.querySelector('img').cloneNode(false);img.alt='';img.removeAttribute('loading');img.removeAttribute('id');img.draggable=false;
      inner.appendChild(img);node.appendChild(inner);layer.appendChild(node);
      return {node,inner,card,index:count-1-index,cardIndex:index,landed:false};
    });
    orbit=dimensions();start=performance.now();root.dataset.mdIntroStartedAt=start.toFixed(1);frame=requestAnimationFrame(tick);
  }
  function onHead(event){
    const phase=event.detail?.phase;
    if(phase==='release'||phase==='ready'){
      headAnchor=event.detail.head||headAnchor;if(root&&phase==='ready')root.dataset.mdHeadReadyAt=performance.now().toFixed(1);
      const ready=()=>{headReady=true;tryStart();};
      if(phase==='ready'&&SETTINGS.headOffsetMs>0&&!headReady&&!headDelay)headDelay=setTimeout(ready,SETTINGS.headOffsetMs);else if(SETTINGS.headOffsetMs<=0)ready();
    }
    if(phase==='error')restore();
  }
  function onResize(){if(started&&!finished){restore();}else if(root){prepareCells();}}
  function onScroll(){if(started&&!finished)orbit=dimensions();}
  window.addEventListener('md:head-reveal',onHead);
  function init(){
    if(window.MD_PATH_EDITOR)return;
    root=document.getElementById('md-work-slider');if(!root||root.dataset.mdGalleryIntroInit==='1')return;
    root.dataset.mdGalleryIntroInit='1';viewport=root.querySelector('.md-work-slider__viewport');
    if(!viewport)return;
    originals=[...viewport.querySelectorAll('.md-work-card:not([data-md-clone="1"])')];
    if(!originals.length){restore();return;}
    root.inert=true;prepareCells();
    timeout=setTimeout(restore,30000);
    window.addEventListener('resize',onResize,{passive:true});window.addEventListener('scroll',onScroll,{passive:true});
    document.addEventListener('visibilitychange',()=>{
      if(finished)return;
      if(!started){if(!document.hidden)tryStart();return;}
      if(document.hidden){pauseAt=performance.now();cancelAnimationFrame(frame);frame=0;}
      else {if(pauseAt){start+=performance.now()-pauseAt;pauseAt=0;}frame=requestAnimationFrame(tick);}
    });
    motion.addEventListener?.('change',event=>{if(event.matches)restore();});
    const images=originals.slice(0,SETTINGS.flyCount).map(card=>card.querySelector('img')).filter(Boolean);
    const loaded=images.map(img=>new Promise(resolve=>{
      const done=()=>{if(img.decode)img.decode().catch(()=>{}).then(resolve);else resolve();};
      if(img.complete)done();else{img.addEventListener('load',done,{once:true});img.addEventListener('error',resolve,{once:true});}
    }));
    Promise.race([Promise.all(loaded),new Promise(resolve=>setTimeout(resolve,6000))]).then(()=>{imagesReady=true;tryStart();});
    headReady=headReady||window.MD_CHARACTER_REVEAL?.phase==='ready';
    headAnchor=headAnchor||window.MD_CHARACTER_REVEAL?.head;
    if(motion.matches){restore();return;}tryStart();
  }
  if(document.readyState==='loading')window.MD_ON_READY(init,{once:true});else init();
})();
