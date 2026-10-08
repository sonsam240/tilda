import * as THREE from 'https://sonsam240.github.io/tilda/releases/v4/vendor/three@0.160.1/build/three.module.js';

// Единый экземпляр THREE для остальных блоков на странице.
// Отдельный hero-код использует именно его и не загружает второй Three.js.
window.__GN_THREE__ = THREE;
import { GLTFLoader } from 'https://sonsam240.github.io/tilda/releases/v4/vendor/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'https://sonsam240.github.io/tilda/releases/v4/vendor/three@0.160.1/examples/jsm/libs/meshopt_decoder.module.js';
import {
    computeBoundsTree,
    disposeBoundsTree,
    acceleratedRaycast
} from 'https://sonsam240.github.io/tilda/releases/v4/vendor/three-mesh-bvh@0.8.0/build/index.module.js';

// BVH extension для быстрых raycast по тяжёлой геометрии головы.
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree;
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree;
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// Set window.GN_MODEL_URLS before this block, or replace the fallback URLs.
const GN_MODEL_URLS = window.GN_MODEL_URLS || {};
const MODEL_URL = GN_MODEL_URLS.head ||
    'https://sonsam240.github.io/tilda/releases/v4/assets/head.glb';

const LEFT_HAND_URL = GN_MODEL_URLS.left ||
    'https://sonsam240.github.io/tilda/releases/v4/assets/left-hand.glb';

const RIGHT_HAND_URL = GN_MODEL_URLS.right ||
    'https://sonsam240.github.io/tilda/releases/v4/assets/right-hand.glb';

const MATCAP_URL =
    'https://sonsam240.github.io/tilda/releases/v4/assets/0ed391c465b2.jpg';

const SETTINGS = {
    modelSize: 2.95,
    modelOffsetY: -0.30,
    modelScaleX: 0.90,
    modelScaleY: 1.00,
    modelScaleZ: 1.00,
    cameraZ: 19,

    handLeftX: -1.00,
    handLeftY: -1.40,
    handLeftZ: 0.80,
    handLeftRotX: 0.00,
    handLeftRotY: 0.00,
    handLeftRotZ: 0.00,
    handLeftScale: 0.60,
    handLeftGrip: 0.00,

    handRightX: 1.00,
    handRightY: -1.40,
    handRightZ: 0.80,
    handRightRotX: 0.00,
    handRightRotY: 0.00,
    handRightRotZ: 0.00,
    handRightScale: 0.60,
    handRightGrip: 0.00,

    handsSize: 2.10,
    handKeyframeDuration: 0.60,

    eyeEase: 0.12,

    // Keyframe controls: голова / глаза / моргание.
    headAnimRotX: 0.00,
    headAnimRotY: 0.00,
    headAnimRotZ: 0.00,
    headAnimScale: 1.00,

    eyeFollowEnabled: true,
    eyeAnimRotX: 0.125,
    eyeAnimRotY: 0.00,

    autoBlinkEnabled: true,
    blinkPose: 0.00,

    // Встроенные facial clips новой головы — ручной scrub 0..1 для keyframes.
    mouthOpenClosePose: 0.00,
    speechOPose: 0.00,

    // Поворот головы за курсором.
    // Пока выключен — логику оставляем для дальнейшей настройки.
    headFollowEnabled: true,
    headFollowX: 1.25,
    headFollowY: 0.85,
    headEase: 0.065,
    maxHeadRotateX: 0.95,
    maxHeadRotateY: 1.15,

    // Твои рабочие диапазоны.
    rotXMin: 0.000,   // максимум вверх
    rotXMax: 0.250,   // максимум вниз — временная настройка для новой маски

    rotYMin: -0.730,  // максимум влево
    rotYMax:  0.730,  // максимум вправо

    blinkTimeScale: 1,
    blinkMinDelay: 2.5,
    blinkMaxDelay: 4.2,

    // Стикеры по клику/тапу.
    stickerSize: 0.48,

    // Бензиновая / iridescent текстура из логики колибри.
    oilEnabled: true,
    oilMix: 1.50,
    oilIridescence: 0.00,
    oilScale: 0.70,
    oilShift: -1.80,
    oilFlowSpeed: 0.10,
    oilFlowAmount: 1.60,
    oilFlowScale: 3.14,
    oilFlowSecondary: 0.00,
    oilEdgeRainbow: 8.00,
    oilSaturation: 0.20,
    oilBrightness: 0.88,
    // Радужная вспышка при успешном ударе/наклейке.
    oilImpactDuration: 0.40,
    oilImpactSaturation: 0.00,
    oilImpactBrightness: 0.00,
    oilImpactStrength: 0.50,
    oilImpactSpeed: 0.00,

    // Частицы при успешном тапе.
    tapParticleEnabled: true,
    tapParticleCount: 18,
    tapParticleSize: 0.06,
    tapParticleColor: '#ffffff',
    tapParticleSpeed: 1.35,
    tapParticleSpread: 0.85,
    tapParticleLife: 0.78,
    tapParticleOpacity: 0.90,
    tapParticleGravity: 0.35,
    tapParticleRainbowSat: 1.00,
    tapParticleRainbowBright: 1.00,
    tapParticleHueSpread: 1.00,

    // Цветной мягкий ореол при ударе вокруг всей модели.
    impactHaloEnabled: false,
    impactHaloSize: 2.35,
    impactHaloRingRadius: 0.60,
    impactHaloThickness: 0.40,
    impactHaloSoftness: 0.60,
    impactHaloOpacity: 1.00,
    impactHaloColor: '#ffffff',
    impactHaloRainbow: 1.00,
    impactHaloBright: 3.00,
    impactHaloExpand: 4.00,
    impactHaloLife: 2.50,
    impactHaloHueShift: 1.00,
    impactHaloSaturation: 0.26,

    // Положение карточки проекта относительно контейнера головы.
    thoughtCardX: 0.54,
    thoughtCardY: 0.20,
    // Небольшой зазор между quad-стикером и поверхностью головы.
    stickerSurfaceOffset: 0.008,
    stickerLife: 4.8,
    stickerHoldTime: 2.8,
    stickerDissolveDuration: 1.45,
    stickerMaxCount: 24,

    // Визуальная интенсивность стикеров.
    stickerOpacity: 1.00,
    stickerBrightness: 1.00,
    stickerSaturation: 0.75,
    stickerContrast: 0.85,
    stickerSmokeIntensity: 1.00,

    // Liquid-glass reveal при загрузке модели.
    revealEnabled: true,
    revealDuration: 3.10,
    revealDelay: 0.25,
    revealBand: 0.70,
    revealEdgeNoise: 1.20,
    revealWobble: 0.25,
    revealRefract: 1.00,
    revealGlassAlpha: 1.00,
    revealGlassBrightness: 2.50,
    revealTintStrength: 1.50,
    revealGlowStrength: 4.00,
    revealTint: '#0011ff',
    revealGlowColor: '#5900ff',
    revealHighlightColor: '#ffffff',

    // Binary digits that scramble directly on the reveal surface.
    binaryLoadingEnabled: true,
    binaryCellScale: 7.20,
    binaryScrollSpeed: 0.00,
    binaryScrambleSpeed: 10.00,
    binaryOpacity: 0.88,
    binaryBlend: 1.00,
    binaryFadeStart: 0.80,
    binaryFadeEnd: 1.00,

    // Материал головы поверх исходного MatCap.
    modelColor: '#12151c',
    modelMaterialMode: 0,
    modelZoom: 1,
    lightingColor: '#ffffff',
    lightingIntensity: 0.7,
    lightingAmbient: 0.3,
    lightingAzimuth: -21.8,
    lightingElevation: 33,
    groundShadowEnabled: true,
    groundShadowColor: '#000000',
    groundShadowOpacity: 0.22,
    groundShadowFloorSize: 24,
    groundShadowOffsetX: 0,
    groundShadowOffsetY: -0.35,
    groundShadowSoftness: 0.7,
    modelMatcapStrength: 0.20,
    modelBrightness: 1.00,
    modelMetalness: 0.22,
    modelRoughness: 0.27,
    modelMatte: 0.00,

    // Белки глаз и их тень.
    eyeColor: '#ffffff',
    eyePupilColor: '#16181d',
    eyeRimShadow: 0.00,
    eyeBottomShadow: 0.36,
    eyeShadowSoftness: 0.00,
    eyeMatcapStrength: 0.00,
    eyeBrightness: 0.90,
    eyeMetalness: 0.00,
    eyeRoughness: 0.00,
    eyeMatte: 0.00,

    // Дополнительная серьга поверх модели.
    earringEnabled: true,
    earringColor: '#c8c8c8',
    earringMetalness: 0.50,
    earringRoughness: 1.00,
    earringClearcoat: 1.00,
    earringClearcoatRoughness: 1.00,
    earringBrightness: 2.00,
    earringRadius: 0.04,
    earringDepth: 0.06,
    earringScale: 1.00,
    earringPosX: 0.61,
    earringPosY: -0.38,
    earringPosZ: 0.07,
    earringRotX: 0.00,
    earringRotY: 0.40,
    earringRotZ: 0.00,

    // Recoil головы при успешном приклеивании.
    recoilDistance: 1.50,
    recoilAngle: 0.90,
    recoilSpring: 20.0,
    recoilDamping: 3.50,

    // Curved patch projection.
    stickerSurfaceOffset: 0.004,
    stickerPatchSegments: 14,
    stickerMaskTextureSize: 128,
    stickerMaskBlurRadius: 2,
    stickerProjectCast: 0.45,

    // Регулируемая область прилипания, normalized 0..1.
    stickMinX: 0.12,
    stickMaxX: 0.88,
    stickMinY: 0.08,
    stickMaxY: 0.70,
    stickMinZ: 0.32,
    stickMaxZ: 1.00,

    // Доп. запрет вокруг глаз.
    eyeBlockRadius: 0.16,
    hairTopFrontZ: 0.84,
    hairSideY: 0.43,
    hairSideX: 0.70,
    hairSideFrontZ: 0.72,
    hairBackZ: 0.34,

    maxPixelRatio: 2,
    maxPixelRatioMobile: 1.5,
    maxRenderPixels: 2500000
};

const container =
    document.querySelector('#gn-head-wrap');

const canvas =
    document.querySelector('#gn-head-canvas');

// Production: панелей больше нет вообще.
// Удаляем даже если старый HTML панели остался в другом Tilda-блоке
// или браузер держит старую разметку страницы.
[
    document.getElementById('gn-material-panel'),
    document.getElementById('gn-oil-panel')
].forEach(panel => {
    if (panel) {
        panel.remove();
    }
});

let thought =
    document.querySelector('#gn-thought');

if (!thought) {
    thought = document.createElement('div');
    thought.id = 'gn-thought';
    thought.setAttribute('aria-hidden', 'true');

    thought.innerHTML = `
        <div class="gn-thought-card">
            <div class="gn-thought-title gn-type-item"
                 data-type-text="R-MAX HOME"
                 data-type-role="title"></div>

            <div class="gn-thought-services">
                <div class="gn-thought-service gn-type-item"
                     data-type-prefix="//"
                     data-type-text="Website Development"
                     data-type-role="service">
                    <span class="gn-thought-service-prefix"></span><span class="gn-thought-service-text"></span>
                </div>

                <div class="gn-thought-service gn-type-item"
                     data-type-prefix="//"
                     data-type-text="Corporate Identity Development"
                     data-type-role="service">
                    <span class="gn-thought-service-prefix"></span><span class="gn-thought-service-text"></span>
                </div>

                <div class="gn-thought-service gn-type-item"
                     data-type-prefix="//"
                     data-type-text="Logo Development"
                     data-type-role="service">
                    <span class="gn-thought-service-prefix"></span><span class="gn-thought-service-text"></span>
                </div>
            </div>

            <div class="gn-thought-description gn-type-item"
                 data-type-role="description"
                 data-type-text="Development of a website, corporate identity, and logo for R-MAX HOME. The goal was to create a cohesive visual identity for the brand, emphasize its premium positioning, and clearly present the company's projects, services, and approach."></div>
        </div>
    `;

    document.body.appendChild(thought);

    console.log(
        '[GN HEAD] thought element created:',
        thought
    );
}

if (!container || !canvas) {
    throw new Error('[GN HEAD] container/canvas not found');
}

const containerParent =
    container.parentElement;

if (
    containerParent &&
    getComputedStyle(containerParent).position === 'static'
) {
    containerParent.style.position = 'relative';
}

/* =========================================================
   THOUGHT TRIGGER
========================================================= */

let thoughtVisible = false;
let thoughtScriptLock = false;
const thoughtDefaultHTML = thought ? thought.innerHTML : '';

let thoughtTypeRun = 0;
let thoughtTypingTimers = [];
let thoughtScrambleControllers = [];

function clearThoughtTyping() {
    thoughtScrambleControllers.forEach(controller => controller.cancel());
    thoughtScrambleControllers = [];
    thoughtTypeRun++;

    thoughtTypingTimers.forEach(
        timer => clearTimeout(timer)
    );

    thoughtTypingTimers = [];

    if (!thought) {
        return;
    }

    thought
        .querySelectorAll('[data-type-text]')
        .forEach(el => {
            el.classList.remove(
                'gn-type-cursor'
            );

            if (
                el.dataset.typeRole ===
                'service'
            ) {
                const prefix =
                    el.querySelector(
                        '.gn-thought-service-prefix'
                    );

                const text =
                    el.querySelector(
                        '.gn-thought-service-text'
                    );

                if (prefix) {
                    prefix.textContent = '';
                }

                if (text) {
                    text.textContent = '';
                }
            } else {
                el.textContent = '';
            }
        });
}

function cancelThoughtTypingKeepText() {
    thoughtScrambleControllers.forEach(controller => controller.cancel());
    thoughtScrambleControllers = [];
    thoughtTypeRun++;

    thoughtTypingTimers.forEach(
        timer => clearTimeout(timer)
    );

    thoughtTypingTimers = [];

    if (!thought) {
        return;
    }

    thought
        .querySelectorAll('.gn-type-cursor')
        .forEach(el =>
            el.classList.remove('gn-type-cursor')
        );
}

// =========================================================
// THOUGHT CARD DISSOLVE
// DOM-аналог shader dissolve у стикеров:
// FBM noise + moving threshold + smooth edge.
// =========================================================

let thoughtDissolveRun = 0;
let thoughtDissolveFrame = 0;
let thoughtDissolveResolve = null;

const thoughtMaskCanvas = document.createElement('canvas');
const thoughtMaskCtx = thoughtMaskCanvas.getContext('2d', {
    alpha: true,
    willReadFrequently: false
});

const THOUGHT_MASK_W = 144;
const THOUGHT_MASK_H = 96;

thoughtMaskCanvas.width = THOUGHT_MASK_W;
thoughtMaskCanvas.height = THOUGHT_MASK_H;

const thoughtMaskImage =
    thoughtMaskCtx.createImageData(
        THOUGHT_MASK_W,
        THOUGHT_MASK_H
    );

function thoughtSmokeHash(x, y) {
    const v =
        Math.sin(
            x * 127.1 +
            y * 311.7
        ) * 43758.5453123;

    return v - Math.floor(v);
}

function thoughtSmokeNoise(x, y) {
    const ix = Math.floor(x);
    const iy = Math.floor(y);
    let fx = x - ix;
    let fy = y - iy;

    fx = fx * fx * (3 - 2 * fx);
    fy = fy * fy * (3 - 2 * fy);

    const a = thoughtSmokeHash(ix, iy);
    const b = thoughtSmokeHash(ix + 1, iy);
    const c = thoughtSmokeHash(ix, iy + 1);
    const d = thoughtSmokeHash(ix + 1, iy + 1);

    const ab = a + (b - a) * fx;
    const cd = c + (d - c) * fx;

    return ab + (cd - ab) * fy;
}

function thoughtSmokeFbm(x, y) {
    let value = 0;
    let amplitude = 0.5;

    for (let i = 0; i < 5; i++) {
        value +=
            amplitude *
            thoughtSmokeNoise(x, y);

        x = x * 2.03 + 17.17;
        y = y * 2.03 + 17.17;
        amplitude *= 0.5;
    }

    return value;
}

function thoughtSmoothstep(edge0, edge1, x) {
    const t = Math.max(
        0,
        Math.min(
            1,
            (x - edge0) /
            Math.max(0.00001, edge1 - edge0)
        )
    );

    return t * t * (3 - 2 * t);
}

let thoughtNoiseField = null;
const thoughtMaskCache = new Map();
const THOUGHT_MASK_STEPS = 48;

function prepareThoughtNoiseField() {
    if (thoughtNoiseField) return;
    const w = THOUGHT_MASK_W, h = THOUGHT_MASK_H;
    thoughtNoiseField = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
        const v = y / Math.max(1, h - 1), fy = v - 0.5;
        for (let x = 0; x < w; x++) {
            const fx = x / Math.max(1, w - 1) - 0.5;
            const n1 = thoughtSmokeFbm(fx * 2.75, fy * 2.75);
            const n2 = thoughtSmokeFbm(fx * 6.20 + n1 * 0.7, fy * 6.20 + n1 * 0.7);
            const n3 = thoughtSmokeFbm(fx * 12, fy * 12);
            thoughtNoiseField[y * w + x] = n1 * 0.56 + n2 * 0.29 + n3 * 0.15 + (v - 0.5) * 0.10;
        }
    }
}

function renderThoughtDissolveMask(dissolve, time) {
    if (!thought) return;
    const step = Math.round(Math.max(0, Math.min(1, dissolve)) * THOUGHT_MASK_STEPS);
    let maskUrl = thoughtMaskCache.get(step);
    if (!maskUrl) {
        const data = thoughtMaskImage.data;
        if (step > 0 && step < THOUGHT_MASK_STEPS) prepareThoughtNoiseField();
        const threshold = -0.10 + 1.20 * step / THOUGHT_MASK_STEPS;
        for (let i = 0, ptr = 0; i < THOUGHT_MASK_W * THOUGHT_MASK_H; i++) {
            const alpha = step === 0 ? 1 : step === THOUGHT_MASK_STEPS ? 0 :
                thoughtSmoothstep(threshold - 0.12, threshold + 0.12, thoughtNoiseField[i]);
            data[ptr++] = 255; data[ptr++] = 255; data[ptr++] = 255;
            data[ptr++] = Math.round(alpha * 255);
        }
        thoughtMaskCtx.putImageData(thoughtMaskImage, 0, 0);
        maskUrl = 'url("' + thoughtMaskCanvas.toDataURL('image/png') + '")';
        thoughtMaskCache.set(step, maskUrl);
    }
    if (thought.style.maskImage !== maskUrl) {
        thought.style.webkitMaskImage = maskUrl;
        thought.style.maskImage = maskUrl;
    }
}

function easeThoughtDissolve(t) {
    t = Math.max(0, Math.min(1, t));

    // Более мягкая S-кривая: медленнее стартует и заканчивается,
    // поэтому граница дыма не "щёлкает" в начале/конце.
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function animateThoughtDissolve(mode = 'show', durationOverride = null) {
    const runId = ++thoughtDissolveRun;

    if (thoughtDissolveFrame) {
        cancelAnimationFrame(thoughtDissolveFrame);
        thoughtDissolveFrame = 0;
    }

    if (thoughtDissolveResolve) {
        thoughtDissolveResolve(false);
        thoughtDissolveResolve = null;
    }

    const duration =
        Number.isFinite(durationOverride)
            ? Math.max(120, durationOverride)
            : mode === 'show'
                ? 1180
                : 1420;

    const start = performance.now();
    const timeOffset = 0;

    return new Promise(resolve => {
        thoughtDissolveResolve = resolve;
        const tick = now => {
            if (runId !== thoughtDissolveRun) {
                resolve(false);
                return;
            }

            const raw =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (now - start) / duration
                    )
                );

            const p = easeThoughtDissolve(raw);

            // show: 1 -> 0, hide: 0 -> 1
            const dissolve =
                mode === 'show'
                    ? 1 - p
                    : p;

            renderThoughtDissolveMask(
                dissolve,
                timeOffset + (now - start) * 0.001
            );

            if (raw < 1) {
                thoughtDissolveFrame =
                    requestAnimationFrame(tick);
            } else {
                thoughtDissolveFrame = 0;
                thoughtDissolveResolve = null;
                resolve(true);
            }
        };

        thoughtDissolveFrame =
            requestAnimationFrame(tick);
    });
}

window.GN_INFO_REPOSITION=placeThoughtCard;
function placeThoughtCard() {
    if (!thought) {
        return;
    }

    const rect =
        container.getBoundingClientRect();

    let left =
        rect.left +
        rect.width *
        SETTINGS.thoughtCardX + (window.GN_INFO_LAYOUT?.x || 0);

    let top =
        rect.top +
        rect.height *
        SETTINGS.thoughtCardY + (window.GN_INFO_LAYOUT?.y || 0);

    const w =
        thought.offsetWidth ||
        466;

    const h =
        thought.offsetHeight ||
        250;

    left =
        Math.min(
            window.innerWidth -
            w -
            20,
            Math.max(
                20,
                left
            )
        );

    top =
        Math.min(
            window.innerHeight -
            h -
            20,
            Math.max(
                20,
                top
            )
        );

    thought.style.left =
        `${left}px`;

    thought.style.top =
        `${top}px`;
}

async function waitThought(ms) {
    return await new Promise(
        resolve => {
            const timer =
                setTimeout(
                    resolve,
                    ms
                );

            thoughtTypingTimers.push(
                timer
            );
        }
    );
}

async function typeSingleThoughtNode(el, runId) {
    if(runId !== thoughtTypeRun || !thoughtVisible)return;
    const fullText=el.dataset.typeText || '';
    if(el.dataset.typeRole === 'service'){
        const prefix=el.querySelector('.gn-thought-service-prefix');
        const text=el.querySelector('.gn-thought-service-text');
        if(prefix)prefix.textContent=el.dataset.typePrefix || '';
        if(text)text.textContent=fullText;
    }else el.textContent=fullText;
    el.classList.remove('gn-type-cursor');
    if(!window.MD_SCRAMBLE)return;
    const controller=window.MD_SCRAMBLE.animate(el);
    thoughtScrambleControllers.push(controller);
    await controller.finished;
    thoughtScrambleControllers=thoughtScrambleControllers.filter(item=>item!==controller);
}

async function typeThoughtText() {
    if (!thought) {
        return;
    }

    const runId =
        ++thoughtTypeRun;

    const nodes = [
        ...thought.querySelectorAll(
            '[data-type-text]'
        )
    ];

    // Все строки начинают печататься одновременно.
    await Promise.all(
        nodes.map(
            el =>
                typeSingleThoughtNode(
                    el,
                    runId
                )
        )
    );
}


async function showThought() {
    if(thought && getComputedStyle(thought).display==='none')return;
    if (
        thoughtScriptLock ||
        thoughtVisible ||
        !thought
    ) {
        return;
    }

    thoughtVisible = true;
    clearThoughtTyping();

    thought.classList.remove('is-hiding');
    thought.classList.add('is-visible');

    // Сначала ставим карточку в правильную позицию.
    thought.style.visibility = 'hidden';
    placeThoughtCard();

    // Начальное состояние = полностью растворено.
    renderThoughtDissolveMask(1, 0);

    thought.style.visibility = 'visible';
    thought.setAttribute(
        'aria-hidden',
        'false'
    );

    // Плашка собирается тем же noise-threshold способом, что стикеры.
    animateThoughtDissolve('show');

    // Печать запускаем, когда форма уже начала собираться.
    const timer =
        setTimeout(
            () => {
                if (thoughtVisible) {
                    typeThoughtText();
                }
            },
            520
        );

    thoughtTypingTimers.push(timer);
}

async function hideThought() {
    if(thought && getComputedStyle(thought).display==='none')return;
    if (
        thoughtScriptLock ||
        !thoughtVisible ||
        !thought
    ) {
        return;
    }

    thoughtVisible = false;
    cancelThoughtTypingKeepText();

    thought.classList.remove('is-visible');
    thought.classList.add('is-hiding');

    const completed =
        await animateThoughtDissolve('hide', 380);

    // Если за время исчезновения снова навели мышь,
    // новая анимация уже отменила этот run.
    if (
        !completed ||
        thoughtVisible
    ) {
        return;
    }

    thought.classList.remove('is-hiding');
    thought.style.visibility = 'hidden';

    // Очищаем строки только когда карточка уже полностью скрыта.
    clearThoughtTyping();
    thought.setAttribute(
        'aria-hidden',
        'true'
    );
}

// =========================================================
// WAIT FOR .trigger
// Сначала ждём реальное появление элемента в DOM,
// только после этого навешиваем события.
// =========================================================

let thoughtTriggerBound = false;
const thoughtBoundElements = new WeakSet();
let thoughtTouchTimer = 0;

function bindThoughtTriggerElement(trigger) {
    if (
        !trigger ||
        thoughtBoundElements.has(trigger)
    ) {
        return false;
    }

    thoughtBoundElements.add(trigger);

    trigger.addEventListener(
        'mouseenter',
        showThought
    );

    trigger.addEventListener(
        'mouseleave',
        hideThought
    );

    trigger.addEventListener(
        'focus',
        showThought
    );

    trigger.addEventListener(
        'blur',
        hideThought
    );

    trigger.addEventListener(
        'touchstart',
        () => {
            clearTimeout(
                thoughtTouchTimer
            );

            showThought();

            thoughtTouchTimer =
                window.setTimeout(
                    hideThought,
                    1500
                );
        },
        {
            passive: true
        }
    );

    thoughtTriggerBound = true;

    console.log(
        '[GN HEAD] .trigger found and bound:',
        trigger
    );

    return true;
}

function findAndBindThoughtTriggers() {
    const triggers =
        document.querySelectorAll(
            '.trigger'
        );

    if (!triggers.length) {
        return false;
    }

    let boundAny = false;

    triggers.forEach(trigger => {
        if (
            bindThoughtTriggerElement(
                trigger
            )
        ) {
            boundAny = true;
        }
    });

    return boundAny;
}

// 1. Пробуем сразу.
findAndBindThoughtTriggers();

// 2. Если Tilda добавит .trigger позже — отслеживаем DOM.
const thoughtTriggerObserver =
    new MutationObserver(
        mutations => {
            for (
                const mutation of mutations
            ) {
                for (
                    const node of mutation.addedNodes
                ) {
                    if (
                        !node ||
                        node.nodeType !== 1
                    ) {
                        continue;
                    }

                    if (
                        node.matches?.('.trigger')
                    ) {
                        bindThoughtTriggerElement(
                            node
                        );
                    }

                    const nested =
                        node.querySelectorAll?.(
                            '.trigger'
                        );

                    if (
                        nested &&
                        nested.length
                    ) {
                        nested.forEach(
                            bindThoughtTriggerElement
                        );
                    }
                }
            }
        }
    );

thoughtTriggerObserver.observe(
    document.documentElement,
    {
        childList: true,
        subtree: true
    }
);

// 3. Доп. страховка для Tilda/Zero Block:
// иногда класс появляется уже после вставки самого элемента.
const thoughtTriggerPoll =
    window.setInterval(
        () => {
            const found =
                findAndBindThoughtTriggers();

            if (
                thoughtTriggerBound ||
                found
            ) {
                // Не выключаем observer — он нужен,
                // если на странице позже появятся ещё .trigger.
                clearInterval(
                    thoughtTriggerPoll
                );
            }
        },
        250
    );

/* =========================================================
   RENDERER
========================================================= */

const renderer =
    new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });

renderer.outputColorSpace =
    THREE.SRGBColorSpace;

renderer.setClearColor(
    0xffffff,
    0
);

/* =========================================================
   SCENE
========================================================= */

const scene =
    new THREE.Scene();

const camera =
    new THREE.PerspectiveCamera(
        35,
        1,
        0.5,
        100
    );

camera.position.set(
    0,
    0,
    SETTINGS.cameraZ
);

const headRig =
    new THREE.Group();

scene.add(headRig);

const SLEEP_ANIMATION_INDEX = 3;
const FLYIN_ANIMATION_INDEX = 4;
let flyinScenarioPlaying = false;
let flyinScenarioCompleted = false;
let flyinScenarioRunId = 0;
const sleepFxGroup = new THREE.Group();
const sleepLetters = [];
let sleepFloatOffset = 0;
let sleepFloatAmplitude = 0.16;
let sleepMicroRotX = 0;
let sleepMicroRotY = 0;
let sleepMicroRotZ = 0;
let sleepSpeechActive = false;

let sleepScenarioPlaying = false;
let sleepScenarioCompleted = false;
let sleepScenarioRunId = 0;

sleepFxGroup.visible = false;
headRig.add(sleepFxGroup);

function createSleepLetterTexture(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width * 0.5, canvas.height * 0.54);
    ctx.rotate(-0.22);
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '700 260px Arial, Helvetica, sans-serif';
    ctx.fillText(text, 0, 0);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
}

function initSleepEffect() {
    const defs = [
        { text: 'Z', size: 0.42 },
        { text: 'z', size: 0.36 },
        { text: 'z', size: 0.30 }
    ];

    defs.forEach((def, index) => {
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(def.size, def.size),
            new THREE.MeshBasicMaterial({
                map: createSleepLetterTexture(def.text),
                transparent: true,
                depthWrite: false,
                toneMapped: false,
                side: THREE.DoubleSide
            })
        );

        mesh.renderOrder = 40 + index;
        sleepFxGroup.add(mesh);
        sleepLetters.push(mesh);
    });
}

function updateSleepEffect(time) {
    const isAnim4 = activeHandAnimation === SLEEP_ANIMATION_INDEX;
    const idleSleep = isAnim4 && !sleepScenarioPlaying && !sleepScenarioCompleted;

    sleepFxGroup.visible = idleSleep;

    if (!isAnim4) {
        sleepFloatOffset = 0;
        sleepMicroRotX = 0;
        sleepMicroRotY = 0;
        sleepMicroRotZ = 0;
        return;
    }

    // Левитация остаётся и после пробуждения, но становится намного слабее.
    sleepFloatOffset = Math.sin(time * 1.55) * sleepFloatAmplitude;

    const motionK = sleepSpeechActive ? 1.45 : (sleepScenarioPlaying ? 1.00 : 0.72);
    sleepMicroRotX = Math.sin(time * 1.18 + 0.7) * 0.010 * motionK;
    sleepMicroRotY = Math.sin(time * 0.91 + 1.8) * 0.014 * motionK;
    sleepMicroRotZ = Math.sin(time * 1.34 + 2.4) * 0.009 * motionK;

    // Zzz только в состоянии сна. Сдвигаем левее от головы.
    sleepFxGroup.position.set(-0.20, 0.86, 0.72);
    sleepFxGroup.rotation.set(0.00, 0.32, -0.18);

    if (!idleSleep) {
        return;
    }

    const cycle = time / 2.0;

    sleepLetters.forEach((mesh, index) => {
        const p = cycle - index * 0.22;
        const phase = p - Math.floor(p);
        const fadeIn = THREE.MathUtils.smoothstep(phase, 0.02, 0.18);
        const fadeOut = 1.0 - THREE.MathUtils.smoothstep(phase, 0.64, 0.96);
        const alpha = THREE.MathUtils.clamp(fadeIn * fadeOut, 0, 1);

        mesh.visible = alpha > 0.01;
        mesh.material.opacity = alpha * 0.95;

        const driftX = Math.sin((phase + index * 0.16) * Math.PI * 2) * 0.025;
        const driftZ = phase * 0.10;
        const liftY = phase * 0.72;
        const scale = 0.82 + phase * 0.30;

        mesh.position.set(index * 0.16 + driftX, liftY, driftZ);
        mesh.rotation.set(-0.24, 0.44, -0.30 - phase * 0.16);
        mesh.scale.setScalar(scale);
    });
}

initSleepEffect();

/* =========================================================
   LIQUID-GLASS REVEAL
   Один общий reveal для головы / глаз / pupil / серьги.
   Материалы при этом остаются исходными.
========================================================= */

const gnRevealState = {
    p: SETTINGS.revealEnabled ? 0 : 1
};

let gnRevealAnimation = null;

// Hook is assigned later, after Natural_Blink has been initialized.
// This avoids starting/replaying the reveal before the eyelids exist.
let gnRevealBeforeReplay = null;
const gnRevealShaders = new Set();
const gnRevealBounds = new THREE.Box3();

const GN_REVEAL_NOISE_GLSL = `
float gnRevealHash13(vec3 p3) {
    p3 = fract(p3 * 0.1031);
    p3 += dot(p3, p3.zyx + 31.32);
    return fract((p3.x + p3.y) * p3.z);
}

float gnRevealNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);

    float n000 = gnRevealHash13(i);
    float n100 = gnRevealHash13(i + vec3(1.0, 0.0, 0.0));
    float n010 = gnRevealHash13(i + vec3(0.0, 1.0, 0.0));
    float n110 = gnRevealHash13(i + vec3(1.0, 1.0, 0.0));
    float n001 = gnRevealHash13(i + vec3(0.0, 0.0, 1.0));
    float n101 = gnRevealHash13(i + vec3(1.0, 0.0, 1.0));
    float n011 = gnRevealHash13(i + vec3(0.0, 1.0, 1.0));
    float n111 = gnRevealHash13(i + vec3(1.0, 1.0, 1.0));

    return mix(
        mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
        mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
        f.z
    );
}
`;


function createGnBinaryAtlasTexture() {
    const canvas =
        document.createElement(
            'canvas'
        );

    canvas.width = 512;
    canvas.height = 256;

    const ctx =
        canvas.getContext(
            '2d',
            {
                alpha: true
            }
        );

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Реальный шрифт вместо procedural rectangles:
    // цифры будут сглаженными и без пиксельного мусора.
    ctx.font =
        '700 184px Arial, Helvetica, sans-serif';

    ctx.fillStyle =
        '#ffffff';

    ctx.shadowColor =
        'rgba(255,255,255,0.20)';

    ctx.shadowBlur = 3;

    ctx.fillText(
        '0',
        128,
        136
    );

    ctx.fillText(
        '1',
        384,
        136
    );

    const texture =
        new THREE.CanvasTexture(
            canvas
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    texture.minFilter =
        THREE.LinearFilter;

    texture.magFilter =
        THREE.LinearFilter;

    texture.generateMipmaps =
        false;

    texture.wrapS =
        THREE.ClampToEdgeWrapping;

    texture.wrapT =
        THREE.ClampToEdgeWrapping;

    texture.needsUpdate =
        true;

    return texture;
}

const gnBinaryAtlasTexture =
    createGnBinaryAtlasTexture();

function installGnRevealShader(shader, deformSurface = true) {
    shader.uniforms.uGnReveal = {
        value: gnRevealState.p
    };
    shader.uniforms.uGnRevealTime = {
        value: 0
    };
    shader.uniforms.uGnRevealMinY = {
        value: -1
    };
    shader.uniforms.uGnRevealMaxY = {
        value: 1
    };
    shader.uniforms.uGnRevealBand = {
        value: SETTINGS.revealBand
    };
    shader.uniforms.uGnRevealEdgeNoise = {
        value: deformSurface
            ? SETTINGS.revealEdgeNoise
            : 0.0
    };
    shader.uniforms.uGnRevealWobble = {
        value: deformSurface
            ? SETTINGS.revealWobble
            : 0.0
    };
    shader.uniforms.uGnRevealRefract = {
        value: SETTINGS.revealRefract
    };
    shader.uniforms.uGnRevealGlassAlpha = {
        value: SETTINGS.revealGlassAlpha
    };
    shader.uniforms.uGnRevealGlassBrightness = {
        value: SETTINGS.revealGlassBrightness
    };
    shader.uniforms.uGnRevealTintStrength = {
        value: SETTINGS.revealTintStrength
    };
    shader.uniforms.uGnRevealGlowStrength = {
        value: SETTINGS.revealGlowStrength
    };
    shader.uniforms.uGnBinaryCellScale = {
        value: SETTINGS.binaryCellScale
    };
    shader.uniforms.uGnBinaryScrollSpeed = {
        value: SETTINGS.binaryScrollSpeed
    };
    shader.uniforms.uGnBinaryScrambleSpeed = {
        value: SETTINGS.binaryScrambleSpeed
    };
    shader.uniforms.uGnBinaryOpacity = {
        value: SETTINGS.binaryOpacity
    };
    shader.uniforms.uGnBinaryBlend = {
        value: SETTINGS.binaryBlend
    };
    shader.uniforms.uGnBinaryAtlas = {
        value: gnBinaryAtlasTexture
    };
    shader.uniforms.uGnRevealTint = {
        value: new THREE.Color(SETTINGS.revealTint)
    };
    shader.uniforms.uGnRevealGlowColor = {
        value: new THREE.Color(SETTINGS.revealGlowColor)
    };
    shader.uniforms.uGnRevealHighlightColor = {
        value: new THREE.Color(SETTINGS.revealHighlightColor)
    };

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        uniform float uGnReveal;
        uniform float uGnRevealTime;
        uniform float uGnRevealMinY;
        uniform float uGnRevealMaxY;
        uniform float uGnRevealBand;
        uniform float uGnRevealWobble;

        varying vec3 vGnRevealWorldPos;
        varying vec3 vGnRevealViewPos;
        varying vec3 vGnRevealNormal;

        ${GN_REVEAL_NOISE_GLSL}`
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        vec4 gnRevealWorldBefore =
            modelMatrix * vec4(transformed, 1.0);

        float gnRevealSpan =
            (uGnRevealMaxY - uGnRevealMinY) +
            2.0 * uGnRevealBand;

        float gnRevealFront =
            uGnRevealMinY -
            uGnRevealBand +
            gnRevealSpan * uGnReveal;

        float gnRevealMolten =
            smoothstep(
                gnRevealFront - uGnRevealBand,
                gnRevealFront,
                gnRevealWorldBefore.y
            );

        if (gnRevealMolten > 0.0 && uGnReveal < 0.9999) {
            float gnRevealRipple =
                gnRevealNoise(
                    gnRevealWorldBefore.xyz * 2.2 +
                    vec3(
                        0.0,
                        -uGnRevealTime * 1.6,
                        0.0
                    )
                ) - 0.5;

            transformed +=
                normalize(objectNormal) *
                gnRevealRipple *
                uGnRevealWobble *
                gnRevealMolten;
        }

        vGnRevealWorldPos =
            (modelMatrix * vec4(transformed, 1.0)).xyz;

        vGnRevealViewPos =
            (modelViewMatrix * vec4(transformed, 1.0)).xyz;

        vGnRevealNormal =
            normalize(normalMatrix * objectNormal);

        #include <project_vertex>
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        uniform float uGnReveal;
        uniform float uGnRevealTime;
        uniform float uGnRevealMinY;
        uniform float uGnRevealMaxY;
        uniform float uGnRevealBand;
        uniform float uGnRevealEdgeNoise;
        uniform float uGnRevealRefract;
        uniform float uGnRevealGlassAlpha;
        uniform float uGnRevealGlassBrightness;
        uniform float uGnRevealTintStrength;
        uniform float uGnRevealGlowStrength;
        uniform float uGnBinaryCellScale;
        uniform float uGnBinaryScrollSpeed;
        uniform float uGnBinaryScrambleSpeed;
        uniform float uGnBinaryOpacity;
        uniform float uGnBinaryBlend;
        uniform sampler2D uGnBinaryAtlas;
        uniform vec3 uGnRevealTint;
        uniform vec3 uGnRevealGlowColor;
        uniform vec3 uGnRevealHighlightColor;

        float gnHash21(vec2 p) {
            p = fract(p * vec2(123.34, 345.45));
            p += dot(p, p + 34.345);
            return fract(p.x * p.y);
        }

        varying vec3 vGnRevealWorldPos;
        varying vec3 vGnRevealViewPos;
        varying vec3 vGnRevealNormal;

        ${GN_REVEAL_NOISE_GLSL}`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>

        if (uGnReveal <= 0.001) discard;
        float gnRevealGlass = 0.0;
        float gnRevealEdge = 0.0;

        if (uGnReveal < 0.9999) {
            float gnRevealSpan =
                (uGnRevealMaxY - uGnRevealMinY) +
                2.0 * uGnRevealBand;

            float gnRevealFront =
                uGnRevealMinY -
                uGnRevealBand +
                gnRevealSpan * uGnReveal;

            float gnRevealWave =
                gnRevealNoise(
                    vec3(
                        vGnRevealWorldPos.x * 2.4,
                        vGnRevealWorldPos.z * 2.4,
                        uGnRevealTime * 0.9
                    )
                ) - 0.5;

            gnRevealEdge =
                vGnRevealWorldPos.y +
                gnRevealWave *
                uGnRevealEdgeNoise *
                (1.0 - uGnReveal) -
                gnRevealFront;

            if (gnRevealEdge > 0.0) {
                discard;
            }

            gnRevealGlass =
                smoothstep(
                    -uGnRevealBand,
                    0.0,
                    gnRevealEdge
                );
        }
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <opaque_fragment>',
        `
        if (gnRevealGlass > 0.001) {
            vec3 gnRevealN =
                normalize(vGnRevealNormal);

            vec3 gnRevealV =
                normalize(-vGnRevealViewPos);

            float gnRevealFres =
                pow(
                    1.0 -
                    abs(dot(gnRevealN, gnRevealV)),
                    2.0
                );

            float gnRevealNoiseA =
                gnRevealNoise(
                    vGnRevealWorldPos.xyz * 3.1 +
                    vec3(
                        uGnRevealTime * 1.4,
                        0.0,
                        0.0
                    )
                );

            float gnRevealNoiseB =
                gnRevealNoise(
                    vGnRevealWorldPos.xyz * 3.1 +
                    vec3(
                        0.0,
                        uGnRevealTime * 1.4,
                        7.3
                    )
                );

            vec2 gnRevealRip =
                (vec2(
                    gnRevealNoiseA,
                    gnRevealNoiseB
                ) - 0.5) *
                uGnRevealRefract *
                gnRevealGlass;

            vec3 gnRevealLiquid =
                mix(outgoingLight * 0.08, uGnRevealGlowColor, 0.8) *
                uGnRevealGlassBrightness;

            gnRevealLiquid +=
                uGnRevealTint *
                (
                    0.12 +
                    gnRevealFres * 0.62
                ) *
                uGnRevealTintStrength;

            gnRevealLiquid =
                mix(
                    gnRevealLiquid,
                    uGnRevealHighlightColor,
                    gnRevealFres * 0.22
                );

            // -------------------------------------------------
            // CLEAN 0 / 1 SCRAMBLE ON THE LIQUID SURFACE
            // -------------------------------------------------
            float gnBinaryMask = 0.0;

            if (uGnBinaryOpacity > 0.001) {
                // Один стабильный projection plane вместо triplanar.
                // Это убирает швы, мелкий мусор и лишние пиксельные фрагменты.
                vec2 gnBinaryUv =
                    vGnRevealWorldPos.xy *
                    uGnBinaryCellScale;

                vec2 gnBinaryCell =
                    floor(gnBinaryUv);

                vec2 gnBinaryLocal =
                    fract(gnBinaryUv) -
                    0.5;

                // Больше внутреннего воздуха в каждой ячейке:
                // сами знаки визуально меньше и чище.
                gnBinaryLocal *=
                    vec2(
                        1.30,
                        1.18
                    );

                // Каждая ячейка перебирает 0/1 независимо:
                // разная фаза + немного разная скорость.
                float gnCellSeed =
                    gnHash21(
                        gnBinaryCell +
                        vec2(37.1, 91.7)
                    );

                float gnBinaryPhase =
                    floor(
                        uGnRevealTime *
                        (
                            uGnBinaryScrambleSpeed +
                            gnCellSeed * 5.0
                        ) +
                        gnCellSeed * 23.0
                    );

                float gnBinaryBit =
                    step(
                        0.5,
                        gnHash21(
                            gnBinaryCell +
                            vec2(
                                gnBinaryPhase * 13.0,
                                gnBinaryPhase * 29.0
                            )
                        )
                    );

                // Переводим local cell 0..1 в одну из двух половин atlas:
                // левая = 0, правая = 1.
                vec2 gnGlyphUv =
                    gnBinaryLocal +
                    0.5;

                gnGlyphUv =
                    clamp(
                        gnGlyphUv,
                        vec2(0.001),
                        vec2(0.999)
                    );

                gnGlyphUv.x =
                    gnGlyphUv.x * 0.5 +
                    step(
                        0.5,
                        gnBinaryBit
                    ) * 0.5;

                float gnBinaryGlyph =
                    texture2D(
                        uGnBinaryAtlas,
                        gnGlyphUv
                    ).a;

                // Только синяя liquid-зона. Без дополнительных random masks.
                float gnBinaryZone =
                    smoothstep(
                        0.18,
                        0.72,
                        gnRevealGlass
                    );

                float gnBinaryRevealFade =
                    1.0 -
                    smoothstep(
                        0.80,
                        1.00,
                        uGnReveal
                    );

                gnBinaryMask =
                    gnBinaryGlyph *
                    gnBinaryZone *
                    uGnBinaryOpacity *
                    gnBinaryRevealFade;
            }

            float gnRevealLine =
                pow(
                    smoothstep(
                        -uGnRevealBand * 0.28,
                        0.0,
                        gnRevealEdge
                    ),
                    3.0
                );

            float gnRevealShimmer =
                0.8 +
                0.2 *
                sin(
                    uGnRevealTime * 6.0 +
                    vGnRevealWorldPos.x * 4.0
                );

            if (gnBinaryMask > 0.001) {
                vec3 gnBinaryColor =
                    vec3(1.0);

                // Strong white glyph + a little of the existing reveal glow.
                vec3 gnBinaryEnergy =
                    uGnRevealGlowColor *
                    0.18 *
                    uGnRevealGlowStrength;

                gnRevealLiquid +=
                    gnBinaryEnergy *
                    gnBinaryMask;

                gnRevealLiquid =
                    mix(
                        gnRevealLiquid,
                        vec3(1.65),
                        clamp(
                            gnBinaryMask *
                            uGnBinaryBlend,
                            0.0,
                            1.0
                        )
                    );
            }

            outgoingLight =
                mix(
                    outgoingLight,
                    gnRevealLiquid,
                    gnRevealGlass
                );

            outgoingLight +=
                uGnRevealGlowColor *
                gnRevealLine *
                gnRevealShimmer *
                uGnRevealGlowStrength;

            diffuseColor.a =
                mix(
                    diffuseColor.a,
                    uGnRevealGlassAlpha,
                    gnRevealGlass
                );
        }

        #include <opaque_fragment>
        `
    );

    gnRevealShaders.add(shader);
}

function updateGnRevealUniformSettings() {
    gnRevealShaders.forEach(shader => {
        const u = shader.uniforms;

        if (!u?.uGnReveal) {
            return;
        }

        u.uGnRevealBand.value =
            SETTINGS.revealBand;

        const maskOnly =
            shader.__gnRevealMaskOnly === true;

        // Голова получает полный liquid effect.
        // Глаза + зрачки получают только ровную синхронную маску.
        u.uGnRevealEdgeNoise.value =
            maskOnly
                ? 0.0
                : SETTINGS.revealEdgeNoise;

        u.uGnRevealWobble.value =
            maskOnly
                ? 0.0
                : SETTINGS.revealWobble;

        u.uGnRevealRefract.value =
            maskOnly
                ? 0.0
                : SETTINGS.revealRefract;

        u.uGnRevealGlassAlpha.value =
            SETTINGS.revealGlassAlpha;

        u.uGnRevealGlassBrightness.value =
            SETTINGS.revealGlassBrightness;

        u.uGnRevealTintStrength.value =
            SETTINGS.revealTintStrength;

        u.uGnRevealGlowStrength.value =
            SETTINGS.revealGlowStrength;

        if (u.uGnBinaryCellScale) {
            u.uGnBinaryCellScale.value =
                SETTINGS.binaryCellScale;

            u.uGnBinaryScrollSpeed.value =
                SETTINGS.binaryScrollSpeed;

            u.uGnBinaryScrambleSpeed.value =
                SETTINGS.binaryScrambleSpeed;

            const gnBinaryFadeT =
                THREE.MathUtils.clamp(
                    (
                        Number(gnRevealState.p || 0) -
                        SETTINGS.binaryFadeStart
                    ) /
                    Math.max(
                        0.0001,
                        SETTINGS.binaryFadeEnd -
                        SETTINGS.binaryFadeStart
                    ),
                    0,
                    1
                );

            u.uGnBinaryOpacity.value =
                SETTINGS.binaryLoadingEnabled
                    ? SETTINGS.binaryOpacity * (1 - gnBinaryFadeT)
                    : 0;

            u.uGnBinaryBlend.value =
                SETTINGS.binaryBlend;
        }

        u.uGnRevealTint.value.set(
            SETTINGS.revealTint
        );

        u.uGnRevealGlowColor.value.set(
            SETTINGS.revealGlowColor
        );

        u.uGnRevealHighlightColor.value.set(
            SETTINGS.revealHighlightColor
        );
    });
}

function syncGnRevealPalette() {
    // Принудительно синхронизируем палитру со всеми уже скомпилированными
    // reveal-shaders. Нужен отдельный helper, чтобы цвет применялся сразу
    // при изменении color input, а не только после следующего rebuild материала.
    updateGnRevealUniformSettings();

    // Если shader ещё не успел скомпилироваться, заставляем материалы
    // пересобраться с текущими SETTINGS при первом render.
    if (!headMaterialShader) {
        headMatcapMaterial.needsUpdate = true;
    }

    if (!eyeWhiteShader) {
        eyeWhiteMaterial.needsUpdate = true;
    }
}

/* MD_GALLERY_HEAD_BRIDGE_V2 */
  (()=>{
    let phase='waiting',released=false;
    function headAnchor(){
      try{
        if(!model)return undefined;
        camera.updateMatrixWorld();model.updateWorldMatrix(true,true);
        const box=new THREE.Box3().setFromObject(model),center=box.getCenter(new THREE.Vector3()).project(camera);
        let minY=Infinity,maxY=-Infinity;
        for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){
          const p=new THREE.Vector3(x,y,z).project(camera);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);
        }
        return {relativeX:(center.x+1)*.5,relativeY:(1-center.y)*.5,relativeHeight:(maxY-minY)*.5};
      }catch{return undefined;}
    }
    function publish(next){
      phase=next;
      const state=next==='revealing'?{phase:next,start:gnRevealAnimation.start,duration:gnRevealAnimation.duration}:{phase:next};
      if(next==='ready')state.head=headAnchor();
      window.MD_CHARACTER_REVEAL=state;
      window.dispatchEvent(new CustomEvent('md:head-reveal',{detail:state}));
    }
    const replay=replayGnReveal;
    replayGnReveal=function(...args){released=false;const result=replay(...args);publish(gnRevealAnimation?.active?'revealing':'ready');return result;};
    const complete=completeGnReveal;
    completeGnReveal=function(...args){const result=complete(...args);publish('ready');return result;};
    const update=updateGnRevealAnimation;
    updateGnRevealAnimation=function(now){const result=update(now);const offset=window.MD_GALLERY_MOTION?.defaults.headOffsetMs??-100;if(!released&&offset<0&&gnRevealAnimation?.active&&now>=gnRevealAnimation.start+gnRevealAnimation.duration+offset){released=true;window.dispatchEvent(new CustomEvent('md:head-reveal',{detail:{phase:'release',head:headAnchor()}}));}if(!gnRevealAnimation&&gnRevealState.p>=1&&phase==='revealing')publish('ready');return result;};
    publish('waiting');
  })();
  function replayGnReveal(
    delay = SETTINGS.revealDelay
) {
    // Close the REAL Natural_Blink pose first, if the blink system is ready.
    if (typeof gnRevealBeforeReplay === 'function') {
        gnRevealBeforeReplay();
    }

    gnRevealState.p =
        SETTINGS.revealEnabled
            ? 0
            : 1;

    gnRevealAnimation = {
        active:
            SETTINGS.revealEnabled,

        start:
            performance.now() +
            Math.max(0, delay) * 1000,

        duration:
            Math.max(
                0.05,
                SETTINGS.revealDuration
            ) * 1000
    };
}

function completeGnReveal() {
    gnRevealAnimation = null;
    gnRevealState.p = 1;
}

function setGnRevealProgress(value) {
    gnRevealAnimation = null;

    gnRevealState.p =
        THREE.MathUtils.clamp(
            Number(value) || 0,
            0,
            1
        );
}

function updateGnRevealAnimation(now) {
    if (
        !gnRevealAnimation ||
        !gnRevealAnimation.active
    ) {
        return;
    }

    if (gnRevealAnimation.lastFrame != null) {
        const gap = now - gnRevealAnimation.lastFrame;
        if (gap > 100) gnRevealAnimation.start += gap - 50;
    }
    gnRevealAnimation.lastFrame = now;

    if (
        now <
        gnRevealAnimation.start
    ) {
        gnRevealState.p = 0;
        return;
    }

    const raw =
        THREE.MathUtils.clamp(
            (
                now -
                gnRevealAnimation.start
            ) /
            gnRevealAnimation.duration,
            0,
            1
        );

    // power2.out
    const eased =
        1 -
        Math.pow(
            1 - raw,
            2
        );

    gnRevealState.p =
        eased;

    if (raw >= 1) {
        gnRevealAnimation = null;
        gnRevealState.p = 1;
    }
}

/* =========================================================
   MATCAP
========================================================= */

const textureLoader =
    new THREE.TextureLoader();

textureLoader.setCrossOrigin('anonymous');

const loader = new GLTFLoader();
loader.setCrossOrigin('anonymous');

loader.setMeshoptDecoder(MeshoptDecoder);

const [matcap, gltf] = await Promise.all([
    textureLoader.loadAsync(MATCAP_URL),
    loader.loadAsync(MODEL_URL)
]);

matcap.colorSpace =
    THREE.SRGBColorSpace;

matcap.anisotropy =
    Math.min(
        16,
        renderer.capabilities.getMaxAnisotropy()
    );

const headMatcapMaterial =
    new THREE.MeshMatcapMaterial({
        matcap,
        color: 0xffffff,
        transparent: true,
        depthWrite: true,
        depthTest: true
    });

let headMaterialShader = null;

headMatcapMaterial.onBeforeCompile = shader => {
    headMaterialShader = shader;

    // Голова получает ПОЛНЫЙ liquid-glass reveal:
    // deformation + liquid tint + edge glow + highlight.
    installGnRevealShader(
        shader,
        true
    );

    const lightA=THREE.MathUtils.degToRad(SETTINGS.lightingAzimuth),lightE=THREE.MathUtils.degToRad(SETTINGS.lightingElevation);
    shader.uniforms.uGNLightDirection = {value: new THREE.Vector3(Math.sin(lightA)*Math.cos(lightE),Math.sin(lightE),Math.cos(lightA)*Math.cos(lightE))};
    shader.uniforms.uGNLightColor = {value: new THREE.Color(SETTINGS.lightingColor)};
    shader.uniforms.uGNLightIntensity = {value: SETTINGS.lightingIntensity};
    shader.uniforms.uGNAmbient = {value: SETTINGS.lightingAmbient};
    shader.uniforms.uModelMaterialMode = {value: SETTINGS.modelMaterialMode};
    shader.uniforms.uModelColor = {
        value: new THREE.Color(SETTINGS.modelColor)
    };
    shader.uniforms.uModelMatcapStrength = {
        value: SETTINGS.modelMatcapStrength
    };
    shader.uniforms.uModelBrightness = {
        value: SETTINGS.modelBrightness
    };
    shader.uniforms.uModelMetalness = {
        value: SETTINGS.modelMetalness
    };
    shader.uniforms.uModelRoughness = {
        value: SETTINGS.modelRoughness
    };
    shader.uniforms.uModelMatte = {
        value: SETTINGS.modelMatte
    };

    shader.uniforms.uOilEnabled = { value: SETTINGS.oilEnabled ? 1.0 : 0.0 };
    shader.uniforms.uOilMix = { value: SETTINGS.oilMix };
    shader.uniforms.uOilIridescence = { value: SETTINGS.oilIridescence };
    shader.uniforms.uOilScale = { value: SETTINGS.oilScale };
    shader.uniforms.uOilShift = { value: SETTINGS.oilShift };
    shader.uniforms.uOilFlowSpeed = { value: SETTINGS.oilFlowSpeed };
    shader.uniforms.uOilFlowAmount = { value: SETTINGS.oilFlowAmount };
    shader.uniforms.uOilFlowScale = { value: SETTINGS.oilFlowScale };
    shader.uniforms.uOilFlowSecondary = { value: SETTINGS.oilFlowSecondary };
    shader.uniforms.uOilEdgeRainbow = { value: SETTINGS.oilEdgeRainbow };
    shader.uniforms.uOilSaturation = { value: SETTINGS.oilSaturation };
    shader.uniforms.uOilBrightness = { value: SETTINGS.oilBrightness };
    shader.uniforms.uOilTime = { value: 0.0 };
    shader.uniforms.uOilImpact = { value: 0.0 };
    shader.uniforms.uOilImpactSaturation = { value: SETTINGS.oilImpactSaturation };
    shader.uniforms.uOilImpactBrightness = { value: SETTINGS.oilImpactBrightness };
    shader.uniforms.uOilImpactStrength = { value: SETTINGS.oilImpactStrength };
    shader.uniforms.uOilImpactSpeed = { value: SETTINGS.oilImpactSpeed };

    // Impact palette: same blue/lilac family as the loading highlight.
    shader.uniforms.uOilImpactColorA = {
        value: new THREE.Color(SETTINGS.revealTint)
    };
    shader.uniforms.uOilImpactColorB = {
        value: new THREE.Color(SETTINGS.revealGlowColor)
    };
    shader.uniforms.uOilImpactHighlight = {
        value: new THREE.Color(SETTINGS.revealHighlightColor)
    };

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vGnOilPos;`
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vGnOilPos = transformed;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        uniform vec3 uGNLightDirection,uGNLightColor;
        uniform float uGNLightIntensity,uGNAmbient;
        uniform float uModelMaterialMode;
        uniform vec3 uModelColor;
        uniform float uModelMatcapStrength;
        uniform float uModelBrightness;
        uniform float uModelMetalness;
        uniform float uModelRoughness;
        uniform float uModelMatte;
        uniform float uOilEnabled;
        uniform float uOilMix;
        uniform float uOilIridescence;
        uniform float uOilScale;
        uniform float uOilShift;
        uniform float uOilFlowSpeed;
        uniform float uOilFlowAmount;
        uniform float uOilFlowScale;
        uniform float uOilFlowSecondary;
        uniform float uOilEdgeRainbow;
        uniform float uOilSaturation;
        uniform float uOilBrightness;
        uniform float uOilTime;
        uniform float uOilImpact;
        uniform float uOilImpactSaturation;
        uniform float uOilImpactBrightness;
        uniform float uOilImpactStrength;
        uniform float uOilImpactSpeed;
        uniform vec3 uOilImpactColorA;
        uniform vec3 uOilImpactColorB;
        uniform vec3 uOilImpactHighlight;
        varying vec3 vGnOilPos;

        vec3 gnOilPalette(float t) {
            vec3 a = vec3(0.50);
            vec3 b = vec3(0.50);
            vec3 c = vec3(1.0);
            vec3 d = vec3(0.00, 0.33, 0.67);
            return a + b * cos(6.28318530718 * (c * t + d));
        }

        vec3 gnOilSaturation(vec3 c, float amount) {
            float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
            return mix(vec3(l), c, amount);
        }`
    );

    const outgoingPattern =
        /vec3\s+outgoingLight\s*=\s*diffuseColor\.rgb\s*\*\s*matcapColor(?:\.rgb)?\s*;/;

    shader.fragmentShader = shader.fragmentShader.replace(
        outgoingPattern,
        `
        float gnSurfaceTexture = 0.0;
        vec3 gnMatcapTone = vec3(1.0);
        vec3 gnMatcap = matcapColor.rgb;
        float gnLum = dot(gnMatcap, vec3(0.2126, 0.7152, 0.0722));

        // A lit base keeps shape and color when MatCap contribution is zero.
        vec3 gnNormal = normalize(normal);
        vec3 gnLightDirection = normalize(uGNLightDirection);
        float gnLightFacing = max(dot(gnNormal, gnLightDirection), 0.0);
        vec3 gnDiffuseColor = vec3(uGNAmbient) + uGNLightColor * uGNLightIntensity * gnLightFacing;
        float gnDiffuseLight = dot(gnDiffuseColor,vec3(0.2126,0.7152,0.0722));
        float gnDefaultLight = 0.30 + 0.70 * max(dot(gnNormal,normalize(vec3(-0.4,0.7,1.0))),0.0);
        vec3 gnMatcapRelight = gnDiffuseColor / max(gnDefaultLight,0.05);
        float gnRoughness = clamp(uModelRoughness, 0.0, 1.0);
        float gnMetalness = clamp(uModelMetalness, 0.0, 1.0);
        float gnMatteAmount = clamp(uModelMatte, 0.0, 1.0);
        vec3 gnHalfDirection = normalize(gnLightDirection + normalize(vViewPosition));
        float gnSpecular = pow(max(dot(gnNormal, gnHalfDirection), 0.0), mix(180.0, 3.0, gnRoughness));
        gnSpecular *= (1.0 - gnRoughness) * (1.0 - gnMatteAmount) * mix(0.04, 0.8, gnMetalness);
        vec3 gnBase = gnDiffuseColor + uGNLightColor * uGNLightIntensity * gnSpecular;
        // MatCap contains baked reflections. Fade those out, rather than multiplying their brightness.
        float gnReflectionWeight = (1.0 - gnRoughness) * (1.0 - gnRoughness) * gnMetalness * (1.0 - gnMatteAmount);
        vec3 gnControlledMatcap = mix(gnMatcapTone * gnDiffuseLight, gnMatcap, gnReflectionWeight);
        // MatCap mode keeps the actual image; lighting mode uses adjustable shading.
        vec3 gnSurface = gnSurfaceTexture > 0.5
            ? mix(vec3(1.0), gnMatcap, clamp(uModelMatcapStrength, 0.0, 1.0)) * gnBase
            : uModelMaterialMode < 0.5
            ? mix(gnBase, gnMatcap * gnMatcapRelight, clamp(uModelMatcapStrength, 0.0, 1.0))
            : gnMatcapTone * gnBase;

        vec3 outgoingLight =
            diffuseColor.rgb *
            uModelColor *
            gnSurface *
            uModelBrightness;

        if (uOilEnabled > 0.5) {
            vec3 gnN = normalize(normal);
            vec3 gnV = normalize(vViewPosition);
            float gnFacing = clamp(1.0 - abs(dot(gnN, -gnV)), 0.0, 1.0);
            float gnFresnel = pow(gnFacing, 3.0);

            // Те же две flow-волны, что в материале колибри.
            float gnFlowA = sin(
                vGnOilPos.y * uOilFlowScale +
                vGnOilPos.x * uOilFlowScale * 0.55 +
                uOilTime * (uOilFlowSpeed + uOilImpact * uOilImpactSpeed) * 6.28318530718
            );
            float gnFlowB = sin(
                vGnOilPos.z * uOilFlowScale * 1.35 -
                vGnOilPos.x * uOilFlowScale * 0.35 -
                uOilTime * (uOilFlowSpeed + uOilImpact * uOilImpactSpeed * 0.72) * 4.39822971503
            );
            float gnFlow =
                (gnFlowA * 0.5 + gnFlowB * 0.5 * uOilFlowSecondary) *
                uOilFlowAmount;

            float gnIriPos =
                gnFacing * uOilScale +
                uOilShift +
                gnFlow;

            vec3 gnOil = gnOilPalette(gnIriPos);

            // В покое оставляем исходную бензиновую палитру.
            // Во время удара НЕ усиливаем rainbow — переводим её
            // в ту же blue/lilac гамму, что loading highlight.
            float gnImpactPhase =
                0.5 +
                0.5 *
                sin(
                    gnIriPos * 4.2 +
                    gnFlow * 0.55 +
                    uOilTime * 1.35
                );

            vec3 gnImpactPalette =
                mix(
                    uOilImpactColorA,
                    uOilImpactColorB,
                    gnImpactPhase
                );

            // Небольшой белый highlight, чтобы вспышка не стала плоской.
            float gnImpactHighlight =
                pow(
                    clamp(
                        gnFresnel + gnFacing * 0.32,
                        0.0,
                        1.0
                    ),
                    2.2
                );

            gnImpactPalette =
                mix(
                    gnImpactPalette,
                    uOilImpactHighlight,
                    gnImpactHighlight * 0.14
                );

            // 0.74 — заметно уводит impact в сине-сиреневый,
            // но сохраняет немного исходной "бензиновой" глубины.
            gnOil =
                mix(
                    gnOil,
                    gnImpactPalette,
                    uOilImpact * 0.74
                );

            float gnImpactSat =
                mix(
                    uOilSaturation,
                    max(
                        uOilSaturation,
                        0.72 + uOilImpactSaturation * 0.35
                    ),
                    uOilImpact
                );

            float gnImpactBrightness =
                1.0 +
                uOilImpactBrightness *
                uOilImpact;

            gnOil =
                gnOilSaturation(
                    gnOil,
                    gnImpactSat
                ) *
                uOilBrightness *
                gnImpactBrightness;

            float gnEdge =
                pow(gnFacing, 2.8) *
                (uOilEdgeRainbow +
                 uOilImpact * uOilImpactStrength * 1.2);

            float gnStrength = clamp(
                uOilMix *
                    (uOilIridescence +
                     gnFresnel * 0.55 +
                     gnEdge * 0.20) +
                uOilImpact * uOilImpactStrength,
                0.0,
                1.0
            );

            vec3 gnOilSurface =
                outgoingLight * mix(vec3(0.72), gnOil * 1.22, 0.72) +
                gnOil * gnEdge * 0.18 * (1.0 - gnRoughness) * (1.0 - clamp(uModelMatte, 0.0, 1.0));

            outgoingLight = mix(outgoingLight, gnOilSurface, gnStrength);
        }
        `
    );
};

headMatcapMaterial.customProgramCacheKey = () =>
    'gn-head-matcap-oil-reveal-v3';

function updateHeadMaterialUniforms() {
    if (!headMaterialShader) {
        headMatcapMaterial.needsUpdate = true;
        return;
    }

    const azimuth=THREE.MathUtils.degToRad(SETTINGS.lightingAzimuth),elevation=THREE.MathUtils.degToRad(SETTINGS.lightingElevation);
    headMaterialShader.uniforms.uGNLightDirection.value.set(Math.sin(azimuth)*Math.cos(elevation),Math.sin(elevation),Math.cos(azimuth)*Math.cos(elevation));
    headMaterialShader.uniforms.uGNLightColor.value.set(SETTINGS.lightingColor);
    headMaterialShader.uniforms.uGNLightIntensity.value=SETTINGS.lightingIntensity;
    headMaterialShader.uniforms.uGNAmbient.value=SETTINGS.lightingAmbient;
    headMaterialShader.uniforms.uModelMaterialMode.value = SETTINGS.modelMaterialMode;
    headMaterialShader.uniforms.uModelColor.value.set(
        SETTINGS.modelColor
    );
    headMaterialShader.uniforms.uModelMatcapStrength.value =
        SETTINGS.modelMatcapStrength;
    headMaterialShader.uniforms.uModelBrightness.value =
        SETTINGS.modelBrightness;
    headMaterialShader.uniforms.uModelMetalness.value =
        SETTINGS.modelMetalness;
    headMaterialShader.uniforms.uModelRoughness.value =
        SETTINGS.modelRoughness;
    headMaterialShader.uniforms.uModelMatte.value =
        SETTINGS.modelMatte;

    const u = headMaterialShader.uniforms;
    u.uOilEnabled.value = SETTINGS.oilEnabled ? 1.0 : 0.0;
    u.uOilMix.value = SETTINGS.oilMix;
    u.uOilIridescence.value = SETTINGS.oilIridescence;
    u.uOilScale.value = SETTINGS.oilScale;
    u.uOilShift.value = SETTINGS.oilShift;
    u.uOilFlowSpeed.value = SETTINGS.oilFlowSpeed;
    u.uOilFlowAmount.value = SETTINGS.oilFlowAmount;
    u.uOilFlowScale.value = SETTINGS.oilFlowScale;
    u.uOilFlowSecondary.value = SETTINGS.oilFlowSecondary;
    u.uOilEdgeRainbow.value = SETTINGS.oilEdgeRainbow;
    u.uOilSaturation.value = SETTINGS.oilSaturation;
    u.uOilBrightness.value = SETTINGS.oilBrightness;
    u.uOilImpactSaturation.value = SETTINGS.oilImpactSaturation;
    u.uOilImpactBrightness.value = SETTINGS.oilImpactBrightness;
    u.uOilImpactStrength.value = SETTINGS.oilImpactStrength;
    u.uOilImpactSpeed.value = SETTINGS.oilImpactSpeed;

    if (u.uOilImpactColorA) {
        u.uOilImpactColorA.value.set(
            SETTINGS.revealTint
        );

        u.uOilImpactColorB.value.set(
            SETTINGS.revealGlowColor
        );

        u.uOilImpactHighlight.value.set(
            SETTINGS.revealHighlightColor
        );
    }
}

const eyeWhiteMaterial =
    new THREE.MeshMatcapMaterial({
        matcap,
        color: new THREE.Color(SETTINGS.eyeColor),
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
        side: THREE.FrontSide
    });

let eyeWhiteShader = null;

eyeWhiteMaterial.onBeforeCompile = shader => {
    eyeWhiteShader = shader;

    // Белки глаз не деформируем: только синхронная clean reveal-mask.
    // Так не появляется шум и один глаз не перекашивает во время загрузки.
    installGnPupilRevealShader(
        shader
    );

    shader.uniforms.uEyeRimShadow = {
        value: SETTINGS.eyeRimShadow
    };
    shader.uniforms.uEyeBottomShadow = {
        value: SETTINGS.eyeBottomShadow
    };
    shader.uniforms.uEyeShadowSoftness = {
        value: SETTINGS.eyeShadowSoftness
    };
    shader.uniforms.uEyeMatcapStrength = {
        value: SETTINGS.eyeMatcapStrength
    };
    shader.uniforms.uEyeBrightness = {
        value: SETTINGS.eyeBrightness
    };
    shader.uniforms.uEyeMetalness = {
        value: SETTINGS.eyeMetalness
    };
    shader.uniforms.uEyeRoughness = {
        value: SETTINGS.eyeRoughness
    };
    shader.uniforms.uEyeMatte = {
        value: SETTINGS.eyeMatte
    };

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vGnEyeNormal;`
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vGnEyeNormal = normalize(normalMatrix * normal);`
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vGnOilPos;`
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        vGnOilPos = transformed;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vGnEyeNormal;
        uniform float uEyeRimShadow;
        uniform float uEyeBottomShadow;
        uniform float uEyeShadowSoftness;
        uniform float uEyeMatcapStrength;
        uniform float uEyeBrightness;
        uniform float uEyeMetalness;
        uniform float uEyeRoughness;
        uniform float uEyeMatte;`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `vec4 diffuseColor = vec4( diffuse, opacity );

        vec3 gnEyeN = normalize(vGnEyeNormal);
        float gnEdgeBase = clamp(1.0 - abs(gnEyeN.z), 0.0, 1.0);
        float gnExponent = mix(3.4, 0.72, clamp(uEyeShadowSoftness, 0.0, 1.0));
        float gnRim = pow(gnEdgeBase, gnExponent);
        float gnBottom = smoothstep(0.02, 0.92, -gnEyeN.y);

        float gnEyeShadow = clamp(
            gnRim * uEyeRimShadow +
            gnBottom * uEyeBottomShadow,
            0.0,
            0.72
        );`
    );

    const eyeOutgoingPattern =
        /vec3\s+outgoingLight\s*=\s*diffuseColor\.rgb\s*\*\s*matcapColor(?:\.rgb)?\s*;/;

    shader.fragmentShader = shader.fragmentShader.replace(
        eyeOutgoingPattern,
        `
        vec3 gnEyeMatcap = matcapColor.rgb;
        float gnEyeLum = dot(gnEyeMatcap, vec3(0.2126, 0.7152, 0.0722));

        vec3 gnEyeRoughMix = mix(
            gnEyeMatcap,
            vec3(gnEyeLum),
            clamp(uEyeRoughness, 0.0, 1.0) * 0.48
        );

        float gnEyeHighlight = smoothstep(0.48, 0.95, gnEyeLum);
        vec3 gnEyeMetalMix = gnEyeRoughMix * mix(
            vec3(1.0),
            vec3(0.76 + gnEyeHighlight * 0.72),
            clamp(uEyeMetalness, 0.0, 1.0)
        );

        vec3 gnEyeMatteMix = mix(
            gnEyeMetalMix,
            vec3(mix(gnEyeLum, 1.0, 0.16)),
            clamp(uEyeMatte, 0.0, 1.0) * 0.82
        );

        vec3 gnEyeSurface = mix(
            vec3(1.0),
            gnEyeMatteMix,
            clamp(uEyeMatcapStrength, 0.0, 1.5)
        );

        vec3 outgoingLight =
            diffuseColor.rgb *
            gnEyeSurface *
            uEyeBrightness;

        outgoingLight *= (1.0 - gnEyeShadow);
        `
    );
};

eyeWhiteMaterial.customProgramCacheKey = () =>
    'gn-eye-white-shadow-reveal-v3';

function updateEyeWhiteUniforms() {
    eyeWhiteMaterial.color.set(SETTINGS.eyeColor);

    if (!eyeWhiteShader) {
        eyeWhiteMaterial.needsUpdate = true;
        return;
    }

    eyeWhiteShader.uniforms.uEyeRimShadow.value =
        SETTINGS.eyeRimShadow;
    eyeWhiteShader.uniforms.uEyeBottomShadow.value =
        SETTINGS.eyeBottomShadow;
    eyeWhiteShader.uniforms.uEyeShadowSoftness.value =
        SETTINGS.eyeShadowSoftness;
    eyeWhiteShader.uniforms.uEyeMatcapStrength.value =
        SETTINGS.eyeMatcapStrength;
    eyeWhiteShader.uniforms.uEyeBrightness.value =
        SETTINGS.eyeBrightness;
    eyeWhiteShader.uniforms.uEyeMetalness.value =
        SETTINGS.eyeMetalness;
    eyeWhiteShader.uniforms.uEyeRoughness.value =
        SETTINGS.eyeRoughness;
    eyeWhiteShader.uniforms.uEyeMatte.value =
        SETTINGS.eyeMatte;
}

/*
   PUPIL REVEAL
   Для зрачков НЕ используем общий liquid shader:
   MeshBasicMaterial не гарантирует normal/objectNormal в той же форме,
   из-за чего прошлый патч мог не скомпилироваться и зрачки исчезали.

   Здесь отдельный лёгкий reveal:
   - сохраняет исходный чёрный MeshBasicMaterial;
   - не деформирует геометрию;
   - только синхронно отсекает пиксели выше liquid-front;
   - не вмешивается в gaze / blink / eye animations.
*/
function installGnPupilRevealShader(shader) {
    // Отмечаем этот shader как MASK ONLY:
    // без waviness/refraction/wobble на глазах и зрачках.
    shader.__gnRevealMaskOnly = true;

    shader.uniforms.uGnReveal = {
        value: gnRevealState.p
    };
    shader.uniforms.uGnRevealTime = {
        value: 0
    };
    shader.uniforms.uGnRevealMinY = {
        value: -1
    };
    shader.uniforms.uGnRevealMaxY = {
        value: 1
    };
    shader.uniforms.uGnRevealBand = {
        value: SETTINGS.revealBand
    };
    shader.uniforms.uGnRevealEdgeNoise = {
        value: SETTINGS.revealEdgeNoise
    };

    // Эти uniforms добавляем тоже, чтобы общий updater панели
    // мог безопасно работать со всеми reveal-shaders одинаково.
    shader.uniforms.uGnRevealWobble = {
        value: 0
    };
    shader.uniforms.uGnRevealRefract = {
        value: SETTINGS.revealRefract
    };
    shader.uniforms.uGnRevealGlassAlpha = {
        value: SETTINGS.revealGlassAlpha
    };
    shader.uniforms.uGnRevealGlassBrightness = {
        value: SETTINGS.revealGlassBrightness
    };
    shader.uniforms.uGnRevealTintStrength = {
        value: SETTINGS.revealTintStrength
    };
    shader.uniforms.uGnRevealGlowStrength = {
        value: SETTINGS.revealGlowStrength
    };
    shader.uniforms.uGnRevealTint = {
        value: new THREE.Color(SETTINGS.revealTint)
    };
    shader.uniforms.uGnRevealGlowColor = {
        value: new THREE.Color(SETTINGS.revealGlowColor)
    };
    shader.uniforms.uGnRevealHighlightColor = {
        value: new THREE.Color(SETTINGS.revealHighlightColor)
    };

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `#include <common>
        varying vec3 vGnPupilWorldPos;`
    );

    shader.vertexShader = shader.vertexShader.replace(
        '#include <project_vertex>',
        `
        vGnPupilWorldPos =
            (modelMatrix * vec4(transformed, 1.0)).xyz;

        #include <project_vertex>
        `
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `#include <common>
        uniform float uGnReveal;
        uniform float uGnRevealTime;
        uniform float uGnRevealMinY;
        uniform float uGnRevealMaxY;
        uniform float uGnRevealBand;
        uniform float uGnRevealEdgeNoise;

        varying vec3 vGnPupilWorldPos;

        ${GN_REVEAL_NOISE_GLSL}`
    );

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>

        if (uGnReveal < 0.9999) {
            float gnPupilSpan =
                (uGnRevealMaxY - uGnRevealMinY) +
                2.0 * uGnRevealBand;

            float gnPupilFront =
                uGnRevealMinY -
                uGnRevealBand +
                gnPupilSpan * uGnReveal;

            float gnPupilWave =
                gnRevealNoise(
                    vec3(
                        vGnPupilWorldPos.x * 2.4,
                        vGnPupilWorldPos.z * 2.4,
                        uGnRevealTime * 0.9
                    )
                ) - 0.5;

            float gnPupilEdge =
                vGnPupilWorldPos.y +
                gnPupilWave *
                uGnRevealEdgeNoise *
                (1.0 - uGnReveal) -
                gnPupilFront;

            if (gnPupilEdge > 0.0) {
                discard;
            }
        }
        `
    );

    gnRevealShaders.add(shader);
}

const pupilMaterial =
    new THREE.MeshBasicMaterial({
        color: new THREE.Color(SETTINGS.eyePupilColor),
        transparent: false,
        opacity: 1,
        depthWrite: true,
        depthTest: true,
        side: THREE.FrontSide,
        toneMapped: false
    });

pupilMaterial.onBeforeCompile = shader => {
    installGnPupilRevealShader(
        shader
    );
};

pupilMaterial.customProgramCacheKey = () =>
    'gn-pupil-reveal-mask-v2';

/* =========================================================
   STICKER ASSETS
========================================================= */


const STICKER_URLS = [
    'https://sonsam240.github.io/tilda/releases/v4/assets/6c6710c5f80e.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/5b27c4b85156.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/921dca589279.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/f63e86c27085.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/d1bb73fff75c.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/3dfa056755d9.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/sticker-rainbow.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/sticker-404.png',
    'https://sonsam240.github.io/tilda/releases/v4/assets/sticker-cssda.png'
]

const stickerTextures = [];

let stickerTextureLoadPromise = null;

function loadStickerTexturesDeferred() {
    if (stickerTextureLoadPromise) {
        return stickerTextureLoadPromise;
    }

    stickerTextureLoadPromise =
        Promise.all(
            STICKER_URLS.map(async url => {
                const texture =
                    await textureLoader.loadAsync(
                        url
                    );

                texture.colorSpace =
                    THREE.SRGBColorSpace;

                texture.anisotropy =
                    Math.min(
                        16,
                        renderer.capabilities.getMaxAnisotropy()
                    );

                return texture;
            })
        )
        .then(textures => {
            stickerTextures.push(
                ...textures
            );
        })
        .catch(error => {
            console.warn(
                '[GN HEAD] sticker textures deferred load:',
                error
            );
        });

    return stickerTextureLoadPromise;
}



/* =========================================================
   MODEL
========================================================= */

const model =
    gltf.scene;

headRig.add(model);

/* =========================================================
   1. СНАЧАЛА ИЩЕМ ГЛАЗА ПО ИСХОДНЫМ МАТЕРИАЛАМ
      НИЧЕГО ПОКА НЕ ПЕРЕТИРАЕМ
========================================================= */

const allMeshes = [];
const clickableMeshes = [];

model.traverse(obj => {
    if (obj.isMesh) {
        allMeshes.push(obj);
        clickableMeshes.push(obj);
    }
});

function getOriginalMaterialName(mesh) {
    if (!mesh || !mesh.material) {
        return '';
    }

    if (Array.isArray(mesh.material)) {
        return mesh.material
            .map(mat => mat?.name || '')
            .join(' | ');
    }

    return mesh.material.name || '';
}

// Сохраняем исходные имена материалов ДО их замены.
// Иначе после назначения MatCap нельзя надёжно понять,
// где глаз / pupil.
allMeshes.forEach(mesh => {
    mesh.userData.gnOriginalMaterialName =
        getOriginalMaterialName(mesh);
});


const headMesh =
    allMeshes.find(mesh => {
        const name =
            (mesh.name || '')
                .toLowerCase();

        const matName =
            (
                mesh.userData.gnOriginalMaterialName ||
                getOriginalMaterialName(mesh)
            )
            .toLowerCase();

        return (
            name.includes('head_rebuilt') ||
            name === 'head' ||
            (
                name.includes('head') &&
                matName.includes('clay')
            )
        );
    })
    ||
    allMeshes.find(mesh => {
        const matName =
            (
                mesh.userData.gnOriginalMaterialName ||
                getOriginalMaterialName(mesh)
            )
            .toLowerCase();

        return matName.includes('clay');
    })
    ||
    null;

console.log(
    '[GN HEAD] headMesh:',
    headMesh?.name,
    headMesh
);

const eyeMeshes =
    allMeshes.filter(mesh =>
        getOriginalMaterialName(mesh)
            .toLowerCase()
            .includes('eye white')
    );

const pupilMeshes =
    allMeshes.filter(mesh =>
        getOriginalMaterialName(mesh)
            .toLowerCase()
            .includes('pupil')
    );

function sortByWorldX(objects) {
    return [...objects]
        .map(obj => {
            const pos =
                new THREE.Vector3();

            obj.getWorldPosition(pos);

            return {
                obj,
                x: pos.x
            };
        })
        .sort((a, b) => a.x - b.x)
        .map(item => item.obj);
}

const sortedEyes =
    sortByWorldX(
        eyeMeshes
    );

const sortedPupils =
    sortByWorldX(
        pupilMeshes
    );

const eyeballLeft =
    sortedEyes[0] || null;

const eyeballRight =
    sortedEyes[
        sortedEyes.length - 1
    ] || null;

const pupilLeft =
    sortedPupils[0] || null;

const pupilRight =
    sortedPupils[
        sortedPupils.length - 1
    ] || null;

function discoverGaze(
    eyeball,
    pupil
) {
    if (!eyeball) {
        return null;
    }

    // В рабочей debug-панели использовалась именно эта логика.
    if (
        pupil &&
        eyeball.parent === pupil.parent
    ) {
        return eyeball.parent;
    }

    return eyeball.parent || null;
}

const gazeLeft =
    discoverGaze(
        eyeballLeft,
        pupilLeft
    );

const gazeRight =
    discoverGaze(
        eyeballRight,
        pupilRight
    );

console.log(
    '[GN HEAD] FOUND',
    {
        eyeballLeft:
            eyeballLeft?.name,
        eyeballRight:
            eyeballRight?.name,
        pupilLeft:
            pupilLeft?.name,
        pupilRight:
            pupilRight?.name,
        gazeLeft:
            gazeLeft?.name,
        gazeRight:
            gazeRight?.name
    }
);

/* =========================================================
   2. ТОЛЬКО ПОСЛЕ DISCOVERY МЕНЯЕМ МАТЕРИАЛЫ
========================================================= */

allMeshes.forEach(mesh => {
    mesh.frustumCulled = false;

    const originalName =
        (
            mesh.userData.gnOriginalMaterialName ||
            getOriginalMaterialName(mesh)
        )
        .toLowerCase();

    if (
        originalName.includes('eye white')
    ) {
        mesh.material =
            eyeWhiteMaterial;

        return;
    }

    if (
        originalName.includes('pupil')
    ) {
        mesh.material =
            pupilMaterial;

        return;
    }

    mesh.material =
        headMatcapMaterial;
});

/* =========================================================
   CENTER MODEL
========================================================= */

model.updateMatrixWorld(true);

const box =
    new THREE.Box3()
        .setFromObject(model);

const size =
    new THREE.Vector3();

const center =
    new THREE.Vector3();

box.getSize(size);
box.getCenter(center);

model.position.x -=
    center.x;

model.position.y -=
    center.y;

model.position.z -=
    center.z;

const maxDimension =
    Math.max(
        size.x,
        size.y,
        size.z
    );

function updateModelScale() {
    const baseScale =
        SETTINGS.modelSize /
        Math.max(
            maxDimension,
            0.0001
        );

    headRig.scale.set(
        baseScale * SETTINGS.modelScaleX,
        baseScale * SETTINGS.modelScaleY,
        baseScale * SETTINGS.modelScaleZ
    );
}

updateModelScale();

function updateModelSize() {
    updateModelScale();
}

/* ========================= HANDS ========================= */

let leftHandRig = null;
let rightHandRig = null;

// Пока true, keyframe-анимация имеет приоритет над cursor-follow.
let characterKeyframePlaying = false;
let characterAnimationRunId = 0;

let leftHandMixer = null;
let rightHandMixer = null;
let leftHandAction = null;
let rightHandAction = null;
let leftHandClip = null;
let rightHandClip = null;

// Все дополнительные clips из GLB, кроме основного Grip.
// Каждый получает собственный scrub 0..1 и входит в keyframes.
const handExtraAnimations = {
    left: [],
    right: []
};

const HAND_POSE_KEYS = [
    'handLeftX',
    'handLeftY',
    'handLeftZ',
    'handLeftRotX',
    'handLeftRotY',
    'handLeftRotZ',
    'handLeftScale',
    'handLeftGrip',

    'handRightX',
    'handRightY',
    'handRightZ',
    'handRightRotX',
    'handRightRotY',
    'handRightRotZ',
    'handRightScale',
    'handRightGrip',

    'headAnimRotX',
    'headAnimRotY',
    'headAnimRotZ',
    'headAnimScale',

    'eyeAnimRotX',
    'eyeAnimRotY',

    'blinkPose',
    'mouthOpenClosePose',
    'speechOPose'
];

function updateCharacterKeyframeControls() {
    if (model) {
        model.rotation.set(
            SETTINGS.headAnimRotX,
            SETTINGS.headAnimRotY,
            SETTINGS.headAnimRotZ
        );

        const s =
            Math.max(
                0,
                SETTINGS.headAnimScale
            );

        model.scale.setScalar(s);
        model.visible = s > 0.0001;
    }

    // Во время scripted animation keyframe-глаза имеют приоритет.
    // В обычном состоянии снова работает cursor-follow.
    if (
        characterKeyframePlaying ||
        !SETTINGS.eyeFollowEnabled
    ) {
        targetRotX =
            SETTINGS.eyeAnimRotX;

        targetRotY =
            SETTINGS.eyeAnimRotY;

        currentRotX =
            SETTINGS.eyeAnimRotX;

        currentRotY =
            SETTINGS.eyeAnimRotY;
    }

    // Сначала рот/речь. Ручной Natural_Blink применяем только когда
    // auto-blink выключен. В обычном интерактивном режиме веки полностью
    // отдаём отдельному blinkMixer, иначе manual pose перетирал auto blink
    // на следующем render-кадре.
    applyManualFacialPoses();

    // В scripted animations blinkPose — часть keyframe pose.
    // Поэтому во время ANIM 1..10 Natural_Blink ОБЯЗАТЕЛЬНО
    // пересэмпливается каждый кадр, даже если autoBlinkEnabled=true.
    // Иначе значения вроде blinkPose: 0.75 меняются в SETTINGS,
    // но веки визуально остаются открытыми.
    if (
        characterKeyframePlaying ||
        !SETTINGS.autoBlinkEnabled
    ) {
        applyManualBlinkPose();
    }
}

function updateHands() {
    if (leftHandRig) {
        leftHandRig.position.set(
            SETTINGS.handLeftX,
            SETTINGS.handLeftY,
            SETTINGS.handLeftZ
        );

        leftHandRig.rotation.set(
            SETTINGS.handLeftRotX,
            SETTINGS.handLeftRotY,
            SETTINGS.handLeftRotZ
        );

        const leftScale =
            Math.max(
                0,
                SETTINGS.handLeftScale
            );

        leftHandRig.scale.setScalar(
            leftScale
        );

        leftHandRig.visible =
            leftScale > 0.0001;
    }

    if (rightHandRig) {
        rightHandRig.position.set(
            SETTINGS.handRightX,
            SETTINGS.handRightY,
            SETTINGS.handRightZ
        );

        rightHandRig.rotation.set(
            SETTINGS.handRightRotX,
            SETTINGS.handRightRotY,
            SETTINGS.handRightRotZ
        );

        const rightScale =
            Math.max(
                0,
                SETTINGS.handRightScale
            );

        rightHandRig.scale.setScalar(
            rightScale
        );

        rightHandRig.visible =
            rightScale > 0.0001;
    }
}

function prepareHandModel(root) {
    root.traverse(obj => {
        if (!obj.isMesh) {
            return;
        }

        obj.frustumCulled = false;
        obj.castShadow = true;
        obj.userData.pbrSmoothHand=true;
        obj.material =
            headMatcapMaterial;
        if(pbrMaterial)registerPBRMesh(obj);
    });
}

function normalizeHandModel(root) {
    root.updateMatrixWorld(true);

    const box =
        new THREE.Box3()
            .setFromObject(root);

    const size =
        new THREE.Vector3();

    const center =
        new THREE.Vector3();

    box.getSize(size);
    box.getCenter(center);

    root.position.set(
        -center.x,
        -center.y,
        -center.z
    );

    const maxDim =
        Math.max(
            size.x,
            size.y,
            size.z,
            0.0001
        );

    root.scale.setScalar(
        SETTINGS.handsSize /
        maxDim
    );
}

function cleanHandClipLabel(name, index) {
    let label =
        String(name || `Finger ${index + 1}`)
            .replace(/^.*[|:]/, '')
            .replace(/[_\-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

    if (!label) {
        label = `Finger ${index + 1}`;
    }

    return label.length > 18
        ? label.slice(0, 18)
        : label;
}

function getFingerToken(name = '') {
    const n =
        String(name)
            .toLowerCase();

    if (n.includes('thumb')) return 'thumb';
    if (n.includes('index')) return 'index';
    if (n.includes('middle')) return 'middle';
    if (n.includes('ring')) return 'ring';
    if (
        n.includes('little') ||
        n.includes('pinky')
    ) {
        return 'little';
    }

    return '';
}

function makeFingerOnlyClip(
    clip,
    index
) {
    const token =
        getFingerToken(
            clip.name
        );

    if (!token) {
        return null;
    }

    const tracks =
        clip.tracks.filter(track => {
            const name =
                String(
                    track.name || ''
                ).toLowerCase();

            if (token === 'little') {
                return (
                    name.includes('little') ||
                    name.includes('pinky')
                );
            }

            return name.includes(
                token
            );
        });

    if (!tracks.length) {
        console.warn(
            '[GN HEAD] finger clip has no matching tracks:',
            clip.name
        );

        return null;
    }

    return new THREE.AnimationClip(
        `${clip.name}__finger_only_${index}`,
        clip.duration,
        tracks.map(
            track => track.clone()
        )
    );
}

function setupFrozenHandAnimation(
    root,
    clips,
    side
) {
    if (!clips?.length) {
        console.warn(
            `[GN HEAD] ${side} hand: animation clip not found`
        );
        return;
    }

    const gripClip =
        clips.find(c =>
            /close|grip|fist|squeeze|compress|hand/i.test(
                c.name || ''
            )
        ) ||
        clips[0];

    // Grip остаётся как master-control.
    // Если отдельные finger-clips найдены, сам Grip action
    // больше не управляет костями напрямую: пальцы работают независимо.
    const gripMixer =
        new THREE.AnimationMixer(root);

    const gripAction =
        gripMixer.clipAction(
            gripClip
        );

    gripAction.reset();
    gripAction.play();
    gripAction.setEffectiveTimeScale(0);
    gripAction.setEffectiveWeight(1);

    if (side === 'left') {
        leftHandMixer = gripMixer;
        leftHandAction = gripAction;
        leftHandClip = gripClip;
    } else {
        rightHandMixer = gripMixer;
        rightHandAction = gripAction;
        rightHandClip = gripClip;
    }

    const prefix =
        side === 'left'
            ? 'handLeftFinger'
            : 'handRightFinger';

    const extras =
        clips
            .filter(clip =>
                clip !== gripClip
            )
            .map((clip, index) => {
                const fingerClip =
                    makeFingerOnlyClip(
                        clip,
                        index
                    );

                if (!fingerClip) {
                    return null;
                }

                // ВАЖНО:
                // отдельный mixer на каждый палец.
                // Так один finger clip не смешивается
                // с другим и не разжимает соседние пальцы.
                const mixer =
                    new THREE.AnimationMixer(
                        root
                    );

                const action =
                    mixer.clipAction(
                        fingerClip
                    );

                action.reset();
                action.play();
                action.setEffectiveTimeScale(0);
                action.setEffectiveWeight(1);

                const key =
                    `${prefix}${index}`;

                SETTINGS[key] = 0;

                if (
                    !HAND_POSE_KEYS.includes(key)
                ) {
                    HAND_POSE_KEYS.push(key);
                }

                return {
                    key,
                    sourceClip: clip,
                    clip: fingerClip,
                    mixer,
                    action,
                    token:
                        getFingerToken(
                            clip.name
                        ),
                    label:
                        cleanHandClipLabel(
                            clip.name,
                            index
                        )
                };
            })
            .filter(Boolean);

    handExtraAnimations[side] =
        extras;

    // Если есть отдельные пальцы, Grip становится master-ползунком:
    // он может выставить все пальцы разом, но не вмешивается
    // в их независимые позы через общий action.
    if (extras.length) {
        gripAction.setEffectiveWeight(0);
        gripMixer.update(0);
    }
}

function setHandGrip(
    side,
    normalized
) {
    const v =
        THREE.MathUtils.clamp(
            normalized,
            0,
            1
        );

    const items =
        handExtraAnimations[side] || [];

    // При наличии отдельных finger clips Grip не смешивает
    // все кости через общий AnimationAction.
    // Finger sliders являются фактическим источником позы.
    if (items.length) {
        return;
    }

    const mixer =
        side === 'left'
            ? leftHandMixer
            : rightHandMixer;

    const action =
        side === 'left'
            ? leftHandAction
            : rightHandAction;

    const clip =
        side === 'left'
            ? leftHandClip
            : rightHandClip;

    if (
        !mixer ||
        !action ||
        !clip
    ) {
        return;
    }

    action.time =
        clip.duration * v;

    mixer.update(0);
}

function setExtraHandAnimations(side) {
    const items =
        handExtraAnimations[side] || [];

    items.forEach(item => {
        const v =
            THREE.MathUtils.clamp(
                Number(
                    SETTINGS[item.key] || 0
                ),
                0,
                1
            );

        item.action.time =
            item.clip.duration * v;

        // Каждый mixer содержит ТОЛЬКО tracks своего пальца.
        item.mixer.update(0);
    });
}

function updateHandGrips() {
    setHandGrip(
        'left',
        SETTINGS.handLeftGrip
    );

    setHandGrip(
        'right',
        SETTINGS.handRightGrip
    );

    setExtraHandAnimations(
        'left'
    );

    setExtraHandAnimations(
        'right'
    );
}

let handsLoadPromise = null;

function loadHandsDeferred() {
    if (handsLoadPromise) {
        return handsLoadPromise;
    }

    handsLoadPromise =
        Promise.all([
            loader.loadAsync(
                LEFT_HAND_URL
            ),
            loader.loadAsync(
                RIGHT_HAND_URL
            )
        ])
        .then(([
            leftGltf,
            rightGltf
        ]) => {
            const leftModel =
                leftGltf.scene;

            const rightModel =
                rightGltf.scene;

            leftModel.name =
                'GN_Left_Hand_Model';

            rightModel.name =
                'GN_Right_Hand_Model';

            prepareHandModel(
                leftModel
            );

            prepareHandModel(
                rightModel
            );

            normalizeHandModel(
                leftModel
            );

            normalizeHandModel(
                rightModel
            );

            leftHandRig =
                new THREE.Group();

            rightHandRig =
                new THREE.Group();

            leftHandRig.name =
                'GN_Left_Hand_Rig';

            rightHandRig.name =
                'GN_Right_Hand_Rig';

            leftHandRig.add(
                leftModel
            );

            rightHandRig.add(
                rightModel
            );

            headRig.add(
                leftHandRig,
                rightHandRig
            );

            setupFrozenHandAnimation(
                leftModel,
                leftGltf.animations,
                'left'
            );

            setupFrozenHandAnimation(
                rightModel,
                rightGltf.animations,
                'right'
            );

            // ВОССТАНАВЛИВАЕМ все исходные finger-values,
            // которые были заложены в HAND_ANIMATIONS до загрузки рук.
            hydrateDeferredHandFingerKeyframes();

            updateHands();
            updateHandGrips();

            // Повторно применяем текущую позу уже с реальными finger keys.
            if (
                typeof HAND_KEYFRAMES !== 'undefined' &&
                HAND_KEYFRAMES?.length &&
                typeof applyHandPose === 'function'
            ) {
                applyHandPose(
                    HAND_KEYFRAMES[
                        Math.min(
                            activeHandStep || 0,
                            HAND_KEYFRAMES.length - 1
                        )
                    ],
                    false
                );
            }

            console.log(
                '[GN HEAD] deferred hands ready'
            );
        })
        .catch(error => {
            console.error(
                '[GN HEAD] deferred hands load error:',
                error
            );
        })
        .finally(() => {
            
        });

    return handsLoadPromise;
}

let deferredInteractionAssetsStarted = false;

function startDeferredInteractionAssets() {
    if (deferredInteractionAssetsStarted) {
        return;
    }

    deferredInteractionAssetsStarted = true;

    // Стикеры по-прежнему только после intro.
    loadStickerTexturesDeferred()
        .then(() => {
            if (
                stickerTextures.length &&
                typeof scheduleStickerWarmup === 'function'
            ) {
                scheduleStickerWarmup();
            }
        });
}

// Руки загружаем сразу в фоне.
// ВАЖНО: без await — reveal головы это НЕ блокирует.
loadHandsDeferred();

/* ===================== HAND KEYFRAMES ===================== */

function captureHandPose() {
    const pose = {};

    HAND_POSE_KEYS.forEach(key => {
        pose[key] =
            Number(SETTINGS[key]);
    });

    return pose;
}

function copyHandPose(pose) {
    return Object.fromEntries(
        Object.entries(pose)
            .map(([key, value]) => [
                key,
                Number(value)
            ])
    );
}

function getFingerStepValues(
    side,
    values
) {
    const result = {};
    const items =
        handExtraAnimations[side] || [];

    // В старом рабочем коде руки уже были загружены к моменту
    // построения HAND_ANIMATIONS. После оптимизации они грузятся
    // асинхронно, поэтому здесь items сначала пустой.
    //
    // Сохраняем значения пальцев во временных ключах, чтобы НЕ потерять
    // заложенные позы/действия в ANIM 1..10.
    if (!items.length) {
        Object.entries(values).forEach(
            ([token, value]) => {
                result[
                    `__gnFinger_${side}_${token}`
                ] = Number(value);
            }
        );

        return result;
    }

    items.forEach(item => {
        if (
            Object.prototype.hasOwnProperty.call(
                values,
                item.token
            )
        ) {
            result[item.key] =
                Number(values[item.token]);
        }
    });

    return result;
}

function hydrateDeferredHandFingerKeyframes() {
    if (
        typeof HAND_ANIMATIONS === 'undefined' ||
        !Array.isArray(HAND_ANIMATIONS)
    ) {
        return;
    }

    HAND_ANIMATIONS.forEach(animation => {
        (animation.steps || []).forEach(step => {
            ['left', 'right'].forEach(side => {
                const items =
                    handExtraAnimations[side] || [];

                items.forEach(item => {
                    const placeholder =
                        `__gnFinger_${side}_${item.token}`;

                    if (
                        Object.prototype.hasOwnProperty.call(
                            step,
                            placeholder
                        )
                    ) {
                        step[item.key] =
                            Number(step[placeholder]);

                        delete step[placeholder];
                    }
                });
            });
        });
    });

    // Обновляем текущий набор keyframes после гидрации,
    // чтобы текущее действие руки сразу использовало исходные значения.
    if (
        typeof getActiveHandKeyframes === 'function' &&
        typeof HAND_KEYFRAMES !== 'undefined'
    ) {
        HAND_KEYFRAMES =
            getActiveHandKeyframes();
    }

    console.log(
        '[GN HEAD] hand finger keyframes restored from deferred values'
    );
}

const HAND_ANIMATIONS = [
    {
        name: 'ANIM 1',
        duration: 1.20,
        steps: [
            {
                ...captureHandPose(),

                // ANIM 1 — STEP 1
                handLeftX: -1.00,
                handLeftY: -1.40,
                handLeftZ: 0.30,
                handLeftRotX: 1.00,
                handLeftRotY: 2.20,
                handLeftRotZ: 0.20,
                handLeftScale: 0.00,
                handLeftGrip: 0.60,

                ...getFingerStepValues(
                    'left',
                    {
                        index: 0.60,
                        middle: 0.60,
                        ring: 0.60,
                        little: 0.60,
                        thumb: 0.60
                    }
                ),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.30,
                handRightRotX: 1.00,
                handRightRotY: -2.20,
                handRightRotZ: -0.20,
                handRightScale: 0.00,
                handRightGrip: 0.60,

                ...getFingerStepValues(
                    'right',
                    {
                        index: 0.60,
                        middle: 0.60,
                        ring: 0.60,
                        little: 0.60,
                        thumb: 0.60
                    }
                )
            },

            {
                ...captureHandPose(),

                // ANIM 1 — STEP 2
                handLeftX: -1.60,
                handLeftY: -1.30,
                handLeftZ: 0.60,
                handLeftRotX: 2.30,
                handLeftRotY: 2.70,
                handLeftRotZ: -0.60,
                handLeftScale: 0.60,
                handLeftGrip: 0.90,

                ...getFingerStepValues(
                    'left',
                    {
                        index: 0.95,
                        middle: 0.95,
                        ring: 0.95,
                        little: 0.95,
                        thumb: 0.95
                    }
                ),

                handRightX: 1.60,
                handRightY: -1.30,
                handRightZ: 0.60,
                handRightRotX: 2.30,
                handRightRotY: -2.70,
                handRightRotZ: 0.60,
                handRightScale: 0.60,
                handRightGrip: 0.90,

                ...getFingerStepValues(
                    'right',
                    {
                        index: 0.95,
                        middle: 0.95,
                        ring: 0.95,
                        little: 0.95,
                        thumb: 0.95
                    }
                )
            }
        ]
    },

    {
        name: 'ANIM 2',
        duration: 0.60,
        steps: [
            {
                ...captureHandPose(),

                // EXACT SCREENSHOT 01 — STEP 1
                handLeftX: -1.00,
                handLeftY: -1.40,
                handLeftZ: 0.30,
                handLeftRotX: 1.00,
                handLeftRotY: 2.20,
                handLeftRotZ: 0.20,
                handLeftScale: 0.00,
                handLeftGrip: 0.60,

                ...getFingerStepValues(
                    'left',
                    {
                        index: 0.60,
                        middle: 0.60,
                        ring: 0.60,
                        little: 0.60,
                        thumb: 0.60
                    }
                ),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.30,
                handRightRotX: 1.00,
                handRightRotY: -2.20,
                handRightRotZ: -0.20,
                handRightScale: 0.00,
                handRightGrip: 0.60,

                ...getFingerStepValues(
                    'right',
                    {
                        index: 0.60,
                        middle: 0.60,
                        ring: 0.60,
                        little: 0.50,
                        thumb: 0.00
                    }
                )
            },

            {
                ...captureHandPose(),

                // EXACT SCREENSHOT 02 — STEP 2
                handLeftX: -1.00,
                handLeftY: -0.90,
                handLeftZ: 1.50,
                handLeftRotX: 1.00,
                handLeftRotY: 2.80,
                handLeftRotZ: 0.10,
                handLeftScale: 0.60,
                handLeftGrip: 0.00,

                ...getFingerStepValues(
                    'left',
                    {
                        index: 0.60,
                        middle: 0.85,
                        ring: 0.60,
                        little: 0.60,
                        thumb: 0.60
                    }
                ),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,

                ...getFingerStepValues(
                    'right',
                    {
                        index: 0.00,
                        middle: 0.00,
                        ring: 0.00,
                        little: 0.00,
                        thumb: 0.00
                    }
                )
            }
        ]
    },

    {
        name: 'ANIM 3',
        duration: 0.60,
        steps: [
            {
                ...captureHandPose(),

                // STEP 1 — точные значения со скрина
                headAnimRotX: 0.00,
                headAnimRotY: 0.00,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,

                handLeftScale: 0.00,
                handRightScale: 0.00
            },

            {
                ...captureHandPose(),

                // STEP 2 — точные значения со скрина
                headAnimRotX: 0.00,
                headAnimRotY: 0.70,
                headAnimRotZ: 0.00,
                headAnimScale: 0.85,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.55,

                handLeftScale: 0.00,
                handRightScale: 0.00
            },

            {
                ...captureHandPose(),

                // STEP 3 — точные значения со скрина
                headAnimRotX: 0.00,
                headAnimRotY: 0.70,
                headAnimRotZ: 0.00,
                headAnimScale: 0.85,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: -0.57,
                blinkPose: 0.00,

                handLeftScale: 0.00,
                handRightScale: 0.00
            }

        ]
    },

    // ANIM 4 — сон. Базовая поза со скрина + отдельный procedural sleep FX.
    {
        name: 'ANIM 4',
        duration: 0.60,
        steps: [
            {
                ...captureHandPose(),

                // SLEEP — STEP 1 (точные значения со скрина)
                headAnimRotX: 0.30,
                headAnimRotY: 0.50,
                headAnimRotZ: 0.00,
                headAnimScale: 0.70,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.80,
                mouthOpenClosePose: 0.00,
                speechOPose: 0.00,

                handLeftX: -1.00,
                handLeftY: -1.40,
                handLeftZ: 0.80,
                handLeftRotX: 0.00,
                handLeftRotY: 0.00,
                handLeftRotZ: 0.00,
                handLeftScale: 0.00,
                handLeftGrip: 0.00,

                ...getFingerStepValues(
                    'left',
                    {
                        index: 0.00,
                        middle: 0.00,
                        ring: 0.00,
                        little: 0.00,
                        thumb: 0.00
                    }
                ),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,

                ...getFingerStepValues(
                    'right',
                    {
                        index: 0.00,
                        middle: 0.00,
                        ring: 0.00,
                        little: 0.00,
                        thumb: 0.00
                    }
                )
            },

            {
                ...captureHandPose(),

                // WAKE — STEP 2: базовое бодрое состояние
                headAnimRotX: 0.00,
                headAnimRotY: 0.00,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,
                mouthOpenClosePose: 0.00,
                speechOPose: 0.00,

                handLeftX: -1.00,
                handLeftY: -1.40,
                handLeftZ: 0.80,
                handLeftRotX: 0.00,
                handLeftRotY: 0.00,
                handLeftRotZ: 0.00,
                handLeftScale: 0.00,
                handLeftGrip: 0.00,

                ...getFingerStepValues(
                    'left',
                    {
                        index: 0.00,
                        middle: 0.00,
                        ring: 0.00,
                        little: 0.00,
                        thumb: 0.00
                    }
                ),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,

                ...getFingerStepValues(
                    'right',
                    {
                        index: 0.00,
                        middle: 0.00,
                        ring: 0.00,
                        little: 0.00,
                        thumb: 0.00
                    }
                )
            }
        ]
    },

    // ANIM 5 — сценарная. Пока действие №1: вылет головы издалека.
    {
        name: 'ANIM 5',
        duration: 1.20,
        steps: [
            {
                ...captureHandPose(),

                // ACTION 1 / START — значения по скрину.
                headAnimRotX: 1.00,
                headAnimRotY: 0.50,
                headAnimRotZ: 0.00,
                headAnimScale: 0.00,




eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,
                mouthOpenClosePose: 0.00,
                speechOPose: 0.00,

                handLeftX: -1.35,
                handLeftY: -1.35,
                handLeftZ: -0.06,
                handLeftRotX: 2.11,
                handLeftRotY: 0.26,
                handLeftRotZ: 0.26,
                handLeftScale: 0.00,
                handLeftGrip: 0.02,
                ...getFingerStepValues('left', {
                    index: 0.60,
                    middle: 0.60,
                    ring: 0.60,
                    little: 0.60,
                    thumb: 0.60
                }),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,
                ...getFingerStepValues('right', {
                    index: 0.00,
                    middle: 0.00,
                    ring: 0.00,
                    little: 0.00,
                    thumb: 0.00
                })
            },
            {
                ...captureHandPose(),

                // ACTION 1 / END — STEP 2.
                headAnimRotX: 0.00,
                headAnimRotY: 0.00,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,
                mouthOpenClosePose: 0.00,
                speechOPose: 0.00,

                handLeftX: -1.35,
                handLeftY: -1.35,
                handLeftZ: -0.06,
                handLeftRotX: 2.11,
                handLeftRotY: 0.26,
                handLeftRotZ: 0.26,
                handLeftScale: 0.00,
                handLeftGrip: 0.02,
                ...getFingerStepValues('left', {
                    index: 0.60,
                    middle: 0.60,
                    ring: 0.60,
                    little: 0.60,
                    thumb: 0.60
                }),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,
                ...getFingerStepValues('right', {
                    index: 0.00,
                    middle: 0.00,
                    ring: 0.00,
                    little: 0.00,
                    thumb: 0.00
                })
            },
            {
                ...captureHandPose(),

                // STEP 3 — предыдущие значения.
                headAnimRotX: 0.00,
                headAnimRotY: 0.00,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,
                mouthOpenClosePose: 0.00,
                speechOPose: 0.00,

                handLeftX: -1.71,
                handLeftY: -0.41,
                handLeftZ: 0.53,
                handLeftRotX: 0.11,
                handLeftRotY: -0.04,
                handLeftRotZ: 0.48,
                handLeftScale: 0.65,
                handLeftGrip: 0.00,
                ...getFingerStepValues('left', {
                    index: 0.22,
                    middle: 0.22,
                    ring: 0.22,
                    little: 0.22,
                    thumb: 0.22
                }),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,
                ...getFingerStepValues('right', {
                    index: 0.00,
                    middle: 0.00,
                    ring: 0.00,
                    little: 0.00,
                    thumb: 0.00
                })
            },
            {
                ...captureHandPose(),

                // STEP 4 — правки по новому скрину.
                headAnimRotX: -0.20,
                headAnimRotY: -0.20,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.75,
                mouthOpenClosePose: 0.29,
                speechOPose: 0.00,

                handLeftX: -1.00,
                handLeftY: -0.02,
                handLeftZ: 0.53,
                handLeftRotX: 0.11,
                handLeftRotY: -0.04,
                handLeftRotZ: -0.55,
                handLeftScale: 0.65,
                handLeftGrip: 0.00,
                ...getFingerStepValues('left', {
                    index: 0.22,
                    middle: 0.22,
                    ring: 0.22,
                    little: 0.22,
                    thumb: 0.22
                }),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,
                ...getFingerStepValues('right', {
                    index: 0.00,
                    middle: 0.00,
                    ring: 0.00,
                    little: 0.00,
                    thumb: 0.00
                })
            },
            {
                ...captureHandPose(),

                // STEP 5 — значения по текущему скрину.
                headAnimRotX: 0.00,
                headAnimRotY: 0.00,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,
                mouthOpenClosePose: 0.29,
                speechOPose: 0.00,

                handLeftX: -1.71,
                handLeftY: -0.41,
                handLeftZ: 0.53,
                handLeftRotX: 0.11,
                handLeftRotY: -0.04,
                handLeftRotZ: 0.48,
                handLeftScale: 0.65,
                handLeftGrip: 0.00,
                ...getFingerStepValues('left', {
                    index: 0.22,
                    middle: 0.22,
                    ring: 0.22,
                    little: 0.22,
                    thumb: 0.22
                }),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,
                ...getFingerStepValues('right', {
                    index: 0.00,
                    middle: 0.00,
                    ring: 0.00,
                    little: 0.00,
                    thumb: 0.00
                })
            },
            {
                ...captureHandPose(),

                // STEP 6 — полная копия STEP 2.
                headAnimRotX: 0.00,
                headAnimRotY: 0.00,
                headAnimRotZ: 0.00,
                headAnimScale: 1.00,

                eyeAnimRotX: 0.12,
                eyeAnimRotY: 0.00,
                blinkPose: 0.00,
                mouthOpenClosePose: 0.00,
                speechOPose: 0.00,

                handLeftX: -1.35,
                handLeftY: -1.35,
                handLeftZ: -0.06,
                handLeftRotX: 2.11,
                handLeftRotY: 0.26,
                handLeftRotZ: 0.26,
                handLeftScale: 0.00,
                handLeftGrip: 0.02,
                ...getFingerStepValues('left', {
                    index: 0.60,
                    middle: 0.60,
                    ring: 0.60,
                    little: 0.60,
                    thumb: 0.60
                }),

                handRightX: 1.00,
                handRightY: -1.40,
                handRightZ: 0.80,
                handRightRotX: 0.00,
                handRightRotY: 0.00,
                handRightRotZ: 0.00,
                handRightScale: 0.00,
                handRightGrip: 0.00,
                ...getFingerStepValues('right', {
                    index: 0.00,
                    middle: 0.00,
                    ring: 0.00,
                    little: 0.00,
                    thumb: 0.00
                })
            }
        ]
    },

    // ANIM 6–10 — пустые рабочие слоты.
    ...Array.from({ length: 5 }, (_, index) => ({
        name: `ANIM ${index + 6}`,
        duration: 0.60,
        steps: [
            captureHandPose(),
            captureHandPose()
        ]
    }))
];

let activeHandAnimation = 2;

function getActiveHandKeyframes() {
    return HAND_ANIMATIONS[
        activeHandAnimation
    ].steps;
}

let HAND_KEYFRAMES =
    getActiveHandKeyframes();

let anim2PresetUntouched = true;

let activeHandStep = 0;
let handKeyframeAnimation = null;
let handPanelSync = null;

// При загрузке открываем новую ANIM 3 / STEP 1.
HAND_KEYFRAMES =
    getActiveHandKeyframes();

HAND_POSE_KEYS.forEach(key => {
    if (
        Object.prototype.hasOwnProperty.call(
            HAND_KEYFRAMES[0],
            key
        )
    ) {
        SETTINGS[key] =
            Number(
                HAND_KEYFRAMES[0][key]
            );
    }
});

updateHands();
updateHandGrips();

let handIntroAnimation = null;

function applyHandPose(
    pose,
    syncPanel = true
) {
    HAND_POSE_KEYS.forEach(key => {
        if (
            Object.prototype.hasOwnProperty.call(
                pose,
                key
            )
        ) {
            SETTINGS[key] =
                Number(pose[key]);
        }
    });

    updateHands();
    updateHandGrips();
    updateCharacterKeyframeControls();

    if (
        syncPanel &&
        handPanelSync
    ) {
        handPanelSync();
    }
}

function saveActiveHandStep() {
    HAND_KEYFRAMES[
        activeHandStep
    ] =
        captureHandPose();

    HAND_ANIMATIONS[
        activeHandAnimation
    ].steps =
        HAND_KEYFRAMES;
}

function selectHandAnimation(index) {
    if (handKeyframeAnimation) {
        handKeyframeAnimation = null;

        applyHandPose(
            HAND_KEYFRAMES[
                activeHandStep
            ],
            false
        );
    }

    saveActiveHandStep();

    activeHandAnimation =
        THREE.MathUtils.clamp(
            index,
            0,
            HAND_ANIMATIONS.length - 1
        );

    HAND_KEYFRAMES =
        getActiveHandKeyframes();

    if (
        activeHandAnimation === 1 &&
        anim2PresetUntouched
    ) {
        // ANIM 2 starts exactly from the two supplied screenshots.
        // It becomes editable normally after the first slider change.
        HAND_KEYFRAMES =
            HAND_ANIMATIONS[1].steps;
    }

    activeHandStep = 0;
    handIntroAnimation = null;
    handKeyframeAnimation = null;

    if (activeHandAnimation === FLYIN_ANIMATION_INDEX) {
        flyinScenarioRunId++;
        flyinScenarioPlaying = false;
        flyinScenarioCompleted = false;
    } else if (flyinScenarioPlaying || flyinScenarioCompleted) {
        flyinScenarioRunId++;
        flyinScenarioPlaying = false;
        flyinScenarioCompleted = false;
    }

    if (activeHandAnimation === SLEEP_ANIMATION_INDEX) {
        sleepScenarioRunId++;
        sleepScenarioPlaying = false;
        sleepScenarioCompleted = false;
        sleepFloatOffset = 0;
        thoughtScriptLock = false;

        if (thought) {
            thoughtVisible = false;
            thought.classList.remove('is-visible', 'is-hiding');
            thought.style.visibility = 'hidden';
            thought.innerHTML = thoughtDefaultHTML;
            clearThoughtTyping();
        }
    } else if (sleepScenarioPlaying || sleepScenarioCompleted) {
        sleepScenarioRunId++;
        sleepScenarioPlaying = false;
        sleepScenarioCompleted = false;
        sleepFloatOffset = 0;
    }

    applyHandPose(
        HAND_KEYFRAMES[0]
    );

    if (handPanelSync) {
        handPanelSync();
    }
}

function selectHandStep(index) {
    handIntroAnimation = null;
    saveActiveHandStep();

    activeHandStep =
        THREE.MathUtils.clamp(
            index,
            0,
            HAND_KEYFRAMES.length - 1
        );

    handKeyframeAnimation = null;

    applyHandPose(
        HAND_KEYFRAMES[
            activeHandStep
        ]
    );

    if (handPanelSync) {
        handPanelSync();
    }
}

function smoothHandEase(t) {
    t =
        THREE.MathUtils.clamp(
            t,
            0,
            1
        );

    // smootherstep
    return (
        t * t * t *
        (
            t *
            (
                t * 6 -
                15
            ) +
            10
        )
    );
}

function playHandSteps(
    fromIndex,
    toIndex,
    onComplete = null,
    saveCurrent = true,
    durationOverride = null
) {
    handIntroAnimation = null;

    if (saveCurrent) {
        saveActiveHandStep();
    }

    const from =
        copyHandPose(
            HAND_KEYFRAMES[
                fromIndex
            ]
        );

    const to =
        copyHandPose(
            HAND_KEYFRAMES[
                toIndex
            ]
        );

    activeHandStep =
        toIndex;

    applyHandPose(
        from
    );

    handKeyframeAnimation = {
        start:
            performance.now(),

        duration:
            Math.max(
                0.05,
                Number.isFinite(durationOverride)
                    ? durationOverride
                    : SETTINGS.handKeyframeDuration
            ) * 1000,

        from,
        to,
        onComplete
    };
}

function updateHandIntroAnimation(now) {
    if (!handIntroAnimation) {
        return;
    }

    const raw =
        THREE.MathUtils.clamp(
            (
                now -
                handIntroAnimation.start
            ) /
            handIntroAnimation.duration,
            0,
            1
        );

    const t =
        smoothHandEase(
            raw
        );

    SETTINGS.handLeftScale =
        THREE.MathUtils.lerp(
            handIntroAnimation.fromLeftScale,
            handIntroAnimation.toLeftScale,
            t
        );

    SETTINGS.handRightScale =
        THREE.MathUtils.lerp(
            handIntroAnimation.fromRightScale,
            handIntroAnimation.toRightScale,
            t
        );

    updateHands();

    if (handPanelSync) {
        handPanelSync();
    }

    if (raw >= 1) {
        SETTINGS.handLeftScale =
            handIntroAnimation.toLeftScale;

        SETTINGS.handRightScale =
            handIntroAnimation.toRightScale;

        handIntroAnimation = null;

        HAND_KEYFRAMES[0].handLeftScale =
            SETTINGS.handLeftScale;

        HAND_KEYFRAMES[0].handRightScale =
            SETTINGS.handRightScale;

        updateHands();

        if (handPanelSync) {
            handPanelSync();
        }
    }
}

function updateHandKeyframeAnimation(
    now
) {
    const anim =
        handKeyframeAnimation;

    if (!anim) {
        return;
    }

    const raw =
        THREE.MathUtils.clamp(
            (
                now -
                anim.start
            ) /
            anim.duration,
            0,
            1
        );

    const t =
        smoothHandEase(
            raw
        );

    HAND_POSE_KEYS.forEach(key => {
        SETTINGS[key] =
            THREE.MathUtils.lerp(
                anim.from[key],
                anim.to[key],
                t
            );
    });

    updateHands();
    updateHandGrips();
    updateCharacterKeyframeControls();

    if (handPanelSync) {
        handPanelSync();
    }

    if (raw >= 1) {
        const onComplete =
            anim.onComplete;

        handKeyframeAnimation =
            null;

        applyHandPose(
            anim.to
        );

        if (typeof onComplete === 'function') {
            onComplete();
        }
    }
}

function runCharacterAnimation(
    animationIndex,
    path,
    holds = {}
) {
    if (
        !leftHandRig ||
        !rightHandRig
    ) {
        const pendingAnimationIndex =
            animationIndex;

        const pendingPath =
            Array.isArray(path)
                ? [...path]
                : path;

        const pendingHolds = {
            ...holds
        };

        if (handsLoadPromise) {
            handsLoadPromise.then(() => {
                if (
                    leftHandRig &&
                    rightHandRig
                ) {
                    runCharacterAnimation(
                        pendingAnimationIndex,
                        pendingPath,
                        pendingHolds
                    );
                }
            });
        }

        return;
    }

    const animation =
        HAND_ANIMATIONS[
            animationIndex
        ];

    if (
        !animation ||
        !Array.isArray(path) ||
        path.length < 2
    ) {
        return;
    }

    const runId =
        ++characterAnimationRunId;

    handIntroAnimation = null;
    handKeyframeAnimation = null;

    activeHandAnimation =
        animationIndex;

    HAND_KEYFRAMES =
        animation.steps;

    characterKeyframePlaying = true;

    currentHeadRotX = 0;
    currentHeadRotY = 0;
    targetHeadRotX = 0;
    targetHeadRotY = 0;

    const first =
        THREE.MathUtils.clamp(
            path[0],
            0,
            HAND_KEYFRAMES.length - 1
        );

    activeHandStep = first;

    applyHandPose(
        HAND_KEYFRAMES[first]
    );

    enterScriptedBlinkMode();

    if (handPanelSync) {
        handPanelSync();
    }

    let i = 0;

    const next =
        () => {
            if (
                runId !==
                characterAnimationRunId
            ) {
                return;
            }

            if (
                i >=
                path.length - 1
            ) {
                characterKeyframePlaying = false;
                leaveScriptedBlinkMode();
                return;
            }

            const from =
                THREE.MathUtils.clamp(
                    path[i],
                    0,
                    HAND_KEYFRAMES.length - 1
                );

            const to =
                THREE.MathUtils.clamp(
                    path[i + 1],
                    0,
                    HAND_KEYFRAMES.length - 1
                );

            i++;

            playHandSteps(
                from,
                to,
                () => {
                    const wait =
                        Number(
                            holds[to] || 0
                        );

                    if (wait > 0) {
                        setTimeout(
                            next,
                            wait
                        );
                    } else {
                        next();
                    }
                },
                false,
                animation.duration
            );
        };

    next();
}

function setAllFingerValuesFromGrip(
    side
) {
    const gripKey =
        side === 'left'
            ? 'handLeftGrip'
            : 'handRightGrip';

    const v =
        THREE.MathUtils.clamp(
            Number(
                SETTINGS[gripKey] || 0
            ),
            0,
            1
        );

    (
        handExtraAnimations[side] ||
        []
    ).forEach(item => {
        SETTINGS[item.key] = v;
    });

    updateHandGrips();
}


function sleepSceneEase(t) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    // Quintic smootherstep — нулевая скорость и ускорение на старте/финише.
    // Для головы/глаз/рук это заметно мягче обычного smoothstep.
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function sleepSceneSineEase(t) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    return -(Math.cos(Math.PI * t) - 1) * 0.5;
}

function sleepSceneBackOut(t, amount = 0.14) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    const u = t - 1;
    return 1 + (amount + 1) * u * u * u + amount * u * u;
}

function sleepSceneElasticOut(t) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    if (t <= 0 || t >= 1) return t;

    // Одна очень мягкая пружинная волна вместо нескольких колебаний.
    // Сохраняет ощущение живого движения, но убирает дёрганность.
    const base = sleepSceneEase(t);
    const envelope = Math.sin(Math.PI * t) * Math.pow(1 - t, 0.72);
    const wobble = Math.sin(Math.PI * t * 1.35) * envelope * 0.075;
    return THREE.MathUtils.clamp(base + wobble, -0.015, 1.018);
}

function getSleepSceneEase(raw, easing = 'smooth') {
    if (easing === 'back') return sleepSceneBackOut(raw);
    if (easing === 'elastic') return sleepSceneElasticOut(raw);
    if (easing === 'sine') return sleepSceneSineEase(raw);
    return sleepSceneEase(raw);
}

function flyinElasticEase(t) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    if (t <= 0 || t >= 1) return t;

    // Более спокойная пружина для вылета: один мягкий перелёт без дрожания.
    const base = sleepSceneEase(t);
    const envelope = Math.sin(Math.PI * t) * Math.pow(1 - t, 0.95);
    const overshoot = Math.sin(Math.PI * t * 1.18) * envelope * 0.055;
    return THREE.MathUtils.clamp(base + overshoot, -0.01, 1.012);
}

function flyinDynamicEase(t) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    // Более энергичный ease-in-out: быстрее проходит середину,
    // но мягко стартует и останавливается без щелчка.
    return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function tweenFlyinSettings(targets, duration, runId, easing = 'elastic') {
    const keys = Object.keys(targets);
    const from = {};
    keys.forEach(key => from[key] = Number(SETTINGS[key] || 0));
    const start = performance.now();

    return new Promise(resolve => {
        const tick = now => {
            if (runId !== flyinScenarioRunId) {
                resolve(false);
                return;
            }

            const raw = THREE.MathUtils.clamp((now - start) / Math.max(1, duration), 0, 1);
            const t = easing === 'elastic'
                ? flyinElasticEase(raw)
                : (easing === 'dynamic'
                    ? flyinDynamicEase(raw)
                    : sleepSceneSineEase(raw));

            keys.forEach(key => {
                SETTINGS[key] = THREE.MathUtils.lerp(from[key], Number(targets[key]), t);
            });

            updateCharacterKeyframeControls();
            updateHands();
            updateHandGrips();
            handPanelSync?.();

            if (raw < 1) {
                requestAnimationFrame(tick);
            } else {
                keys.forEach(key => SETTINGS[key] = Number(targets[key]));
                updateCharacterKeyframeControls();
                updateHands();
                updateHandGrips();
                handPanelSync?.();
                resolve(true);
            }
        };
        requestAnimationFrame(tick);
    });
}

async function resetFlyinScenarioToIdle() {
    flyinScenarioRunId++;
    flyinScenarioPlaying = false;
    flyinScenarioCompleted = false;

    if (activeHandAnimation === FLYIN_ANIMATION_INDEX) {
        activeHandStep = 0;
        applyHandPose(HAND_ANIMATIONS[FLYIN_ANIMATION_INDEX].steps[0]);
    }

    handPanelSync?.();
}

async function playFlyinScenario() {
    if (
        !leftHandRig ||
        !rightHandRig
    ) {
        if (handsLoadPromise) {
            await handsLoadPromise;
        }

        if (
            !leftHandRig ||
            !rightHandRig
        ) {
            return;
        }
    }

    if (activeHandAnimation !== FLYIN_ANIMATION_INDEX || flyinScenarioPlaying) return;

    if (flyinScenarioCompleted) {
        await resetFlyinScenarioToIdle();
    }

    const runId = ++flyinScenarioRunId;
    flyinScenarioPlaying = true;
    flyinScenarioCompleted = false;

    // На время сценария отключаем только cursor-follow.
    // Auto-blink остаётся активным на протяжении ВСЕЙ ANIM 5:
    // вылет, улыбка, мах рукой, круговой осмотр и возврат в центр.
    SETTINGS.headFollowEnabled = false;
    SETTINGS.eyeFollowEnabled = false;
    SETTINGS.autoBlinkEnabled = true;
    if (!blinkPlaying) scheduleBlink();

    const steps = HAND_ANIMATIONS[FLYIN_ANIMATION_INDEX].steps;

    const toTargets = (pose, filter = null) => {
        const result = {};
        HAND_POSE_KEYS.forEach(key => {
            if (
                Object.prototype.hasOwnProperty.call(pose, key) &&
                (!filter || filter(key))
            ) {
                result[key] = Number(pose[key]);
            }
        });
        return result;
    };

    const isLeftHandKey = key =>
        key.startsWith('handLeft') ||
        key.startsWith('leftFinger') ||
        key.startsWith('handExtra_left_');

    const isHeadKey = key =>
        key === 'headAnimRotX' ||
        key === 'headAnimRotY' ||
        key === 'headAnimRotZ' ||
        key === 'headAnimScale';

    const isFaceKey = key =>
        key === 'eyeAnimRotX' ||
        key === 'eyeAnimRotY' ||
        key === 'blinkPose' ||
        key === 'mouthOpenClosePose' ||
        key === 'speechOPose';

    activeHandStep = 0;
    applyHandPose(steps[0]);
    handPanelSync?.();

    // 1 → 2. Появление издалека — выразительный, но мягкий вход.
    if (!(await tweenFlyinSettings(
        toTargets(steps[1]),
        1180,
        runId,
        'elastic'
    ))) return;
    activeHandStep = 1;
    handPanelSync?.();

    // Сразу после вылета появляется лёгкая улыбка.
    // Голова и глаза остаются в нейтрали.
    if (!(await tweenFlyinSettings(
        {
            mouthOpenClosePose: 0.29,
            speechOPose: 0.00,
            blinkPose: 0.00
        },
        180,
        runId,
        'sine'
    ))) return;

    // 2 → 3. Рука выходит в стартовую позу маха.
    // Лицо уже улыбается, голову/глаза здесь не трогаем.
    if (!(await tweenFlyinSettings(
        toTargets(steps[2], isLeftHandKey),
        430,
        runId,
        'dynamic'
    ))) return;
    activeHandStep = 2;
    handPanelSync?.();

    // Два спокойных маха рукой туда → обратно.
    // Улыбка держится на протяжении всего жеста.
    const hand3 = toTargets(steps[2], isLeftHandKey);
    const hand4 = toTargets(steps[3], isLeftHandKey);

    for (let wave = 0; wave < 2; wave++) {
        if (!(await tweenFlyinSettings(
            hand4,
            350,
            runId,
            'dynamic'
        ))) return;

        if (!(await tweenFlyinSettings(
            hand3,
            380,
            runId,
            'sine'
        ))) return;
    }

    // После последнего маха улыбка ещё немного остаётся.
    SETTINGS.mouthOpenClosePose = 0.29;
    SETTINGS.speechOPose = 0.00;
    SETTINGS.blinkPose = 0.00;
    applyManualFacialPoses();
    handPanelSync?.();

    await new Promise(resolve => setTimeout(resolve, 420));
    if (runId !== flyinScenarioRunId) return;

    // Остаёмся в улыбающейся позе STEP 5 без промежуточного
    // поворота головы и без принудительного закрытия глаз.
    const step5NoHeadBlink = toTargets(
        steps[4],
        key =>
            isLeftHandKey(key) ||
            key === 'mouthOpenClosePose' ||
            key === 'speechOPose'
    );

    if (!(await tweenFlyinSettings(
        step5NoHeadBlink,
        260,
        runId,
        'sine'
    ))) return;

    activeHandStep = 4;
    handPanelSync?.();

    // 5 → 6. Прячем руку и возвращаем полную нейтральную позу.
    if (!(await tweenFlyinSettings(
        toTargets(steps[5]),
        680,
        runId,
        'sine'
    ))) return;
    activeHandStep = 5;
    handPanelSync?.();

    // Плавный самостоятельный обзор страницы после приветствия.
    // Сначала мягко поднимаем голову и взгляд вверх до рабочих лимитов,
    // затем проходим примерно 60% большой окружности по часовой стрелке.
    // Глаза всегда жёстко ограничены rotXMin/rotXMax и rotYMin/rotYMax.
    const eyeCenterX = (SETTINGS.rotXMin + SETTINGS.rotXMax) * 0.5;
    const eyeRadiusX = Math.min(
        eyeCenterX - SETTINGS.rotXMin,
        SETTINGS.rotXMax - eyeCenterX
    );
    const eyeRadiusY = Math.min(
        Math.abs(SETTINGS.rotYMin),
        Math.abs(SETTINGS.rotYMax)
    );

    const headRadiusX = Math.min(0.56, SETTINGS.maxHeadRotateX);
    const headRadiusY = Math.min(0.90, SETTINGS.maxHeadRotateY);

    // Важно: никакого скачка из центра сразу вверх.
    // Сначала отдельный мягкий подъём к стартовой точке дуги.
    if (!(await tweenFlyinSettings(
        {
            headAnimRotX: -headRadiusX,
            headAnimRotY: 0.00,
            headAnimRotZ: 0.00,
            eyeAnimRotX: SETTINGS.rotXMin,
            eyeAnimRotY: 0.00
        },
        720,
        runId,
        'sine'
    ))) return;

    const circleOk = await new Promise(resolve => {
        const duration = 2300;
        const startTime = performance.now();

        // 0 = верх. Положительное направление — по часовой стрелке.
        // 60% полного круга = 216 градусов.
        const arc = Math.PI * 2 * 0.60;

        // Плавный старт/финиш, но сама траектория остаётся непрерывной.
        const easeInOutSine = t => -(Math.cos(Math.PI * t) - 1) * 0.5;

        const frame = now => {
            if (runId !== flyinScenarioRunId) {
                resolve(false);
                return;
            }

            const raw = Math.min(1, (now - startTime) / duration);
            const progress = easeInOutSine(raw);
            const a = arc * progress;

            // Координаты окружности с началом в верхней точке:
            // horizontal = sin(a), vertical = -cos(a).
            const horizontal = Math.sin(a);
            const vertical = -Math.cos(a);

            SETTINGS.headAnimRotX = THREE.MathUtils.clamp(
                vertical * headRadiusX,
                -SETTINGS.maxHeadRotateX,
                SETTINGS.maxHeadRotateX
            );
            SETTINGS.headAnimRotY = THREE.MathUtils.clamp(
                horizontal * headRadiusY,
                -SETTINGS.maxHeadRotateY,
                SETTINGS.maxHeadRotateY
            );
            SETTINGS.headAnimRotZ = 0;

            SETTINGS.eyeAnimRotX = THREE.MathUtils.clamp(
                eyeCenterX + vertical * eyeRadiusX,
                SETTINGS.rotXMin,
                SETTINGS.rotXMax
            );
            SETTINGS.eyeAnimRotY = THREE.MathUtils.clamp(
                horizontal * eyeRadiusY,
                SETTINGS.rotYMin,
                SETTINGS.rotYMax
            );

            applyManualFacialPoses();
            handPanelSync?.();

            if (raw < 1) {
                requestAnimationFrame(frame);
            } else {
                resolve(true);
            }
        };

        requestAnimationFrame(frame);
    });

    if (!circleOk) return;

    // После полного круга мягко возвращаемся точно в центр,
    // и только затем отдаём управление обычному cursor-follow.
    if (!(await tweenFlyinSettings(
        {
            headAnimRotX: 0.00,
            headAnimRotY: 0.00,
            headAnimRotZ: 0.00,
            eyeAnimRotX: 0.12,
            eyeAnimRotY: 0.00
        },
        420,
        runId,
        'sine'
    ))) return;

    flyinScenarioPlaying = false;
    flyinScenarioCompleted = true;

    // После осмотра снова живой интерактивный режим.
    SETTINGS.headFollowEnabled = true;
    SETTINGS.eyeFollowEnabled = true;
    SETTINGS.autoBlinkEnabled = true;

    currentHeadRotX = 0;
    currentHeadRotY = 0;
    targetHeadRotX = 0;
    targetHeadRotY = 0;

    currentRotX = SETTINGS.eyeAnimRotX;
    currentRotY = SETTINGS.eyeAnimRotY;
    targetRotX = currentRotX;
    targetRotY = currentRotY;

    blinkPlaying = false;
    scheduleBlink();

    handPanelSync?.();
}


/* =========================================================
   .wake — внешний запуск ANIM 4
   Поддерживает элементы, которые Tilda добавляет после загрузки.
========================================================= */

function startSleepScenarioFromWake() {
    if (sleepScenarioPlaying) {
        return;
    }

    if (activeHandAnimation !== SLEEP_ANIMATION_INDEX) {
        selectHandAnimation(SLEEP_ANIMATION_INDEX);
    }

    // Даём selectHandAnimation применить sleep pose в текущем кадре,
    // после чего запускаем сценарий без дополнительной заметной паузы.
    requestAnimationFrame(() => {
        if (!sleepScenarioPlaying) {
            playSleepScenario();
        }
    });
}

function bindWakeElement(el) {
    if (
        !el ||
        el.dataset.gnWakeBound === '1'
    ) {
        return false;
    }

    el.dataset.gnWakeBound = '1';

    el.addEventListener('click', event => {
        // Не мешаем стандартному клику Tilda, только запускаем сцену.
        startSleepScenarioFromWake();
    });

    return true;
}

function findAndBindWakeElements(root = document) {
    const elements = root.querySelectorAll?.('.wake') || [];
    elements.forEach(bindWakeElement);
}

findAndBindWakeElements();

const wakeObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (!node || node.nodeType !== 1) return;

            if (node.matches?.('.wake')) {
                bindWakeElement(node);
            }

            findAndBindWakeElements(node);
        });
    });
});

wakeObserver.observe(document.documentElement, {
    childList: true,
    subtree: true
});

function buildOilPanel() {
    const panel =
        document.createElement(
            'div'
        );

    panel.id =
        'gn-oil-panel';

    panel.innerHTML = `
        <div class="gnp-title">
            <span>HANDS / ANIMATIONS</span>
            <button
                class="gnp-collapse"
                type="button"
            >−</button>
        </div>
        <div class="gnp-content"></div>
    `;

    const content =
        panel.querySelector(
            '.gnp-content'
        );

    const title =
        panel.querySelector(
            '.gnp-title'
        );

    const collapseButton =
        panel.querySelector(
            '.gnp-collapse'
        );

    title.addEventListener(
        'click',
        e => {
            if (
                e.target ===
                collapseButton
            ) {
                return;
            }

            panel.classList.toggle(
                'gnp-collapsed'
            );

            collapseButton.textContent =
                panel.classList.contains(
                    'gnp-collapsed'
                )
                    ? '+'
                    : '−';
        }
    );

    collapseButton.addEventListener(
        'click',
        e => {
            e.stopPropagation();

            title.click();
        }
    );

    [
        'pointerdown',
        'pointerup',
        'click',
        'dblclick'
    ].forEach(type => {
        panel.addEventListener(
            type,
            e => e.stopPropagation()
        );
    });

    const controls =
        new Map();

    const section =
        text => {
            const el =
                document.createElement(
                    'div'
                );

            el.className =
                'gnp-section';

            el.textContent =
                text;

            content.appendChild(
                el
            );
        };

    const makeButton =
        (
            text,
            onClick
        ) => {
            const button =
                document.createElement(
                    'button'
                );

            button.type =
                'button';

            button.className =
                'gnp-btn';

            button.textContent =
                text;

            button.addEventListener(
                'click',
                onClick
            );

            return button;
        };

    const range =
        (
            label,
            key,
            min,
            max,
            step,
            onInput
        ) => {
            const row =
                document.createElement(
                    'div'
                );

            row.className =
                'gnp-row';

            const name =
                document.createElement(
                    'div'
                );

            name.textContent =
                label;

            const input =
                document.createElement(
                    'input'
                );

            input.type =
                'range';

            input.min =
                min;

            input.max =
                max;

            input.step =
                step;

            const value =
                document.createElement(
                    'input'
                );

            value.type =
                'number';

            value.className =
                'gnp-value';

            value.min =
                min;

            value.max =
                max;

            value.step =
                step;

            const decimals =
                step < 0.01
                    ? 3
                    : 2;

            const sync =
                () => {
                    const v =
                        Number(
                            SETTINGS[key]
                        );

                    input.value =
                        v;

                    value.value =
                        v.toFixed(
                            decimals
                        );
                };

            const apply =
                raw => {
                    const v =
                        THREE.MathUtils.clamp(
                            Number(raw),
                            min,
                            max
                        );

                    if (
                        !Number.isFinite(v)
                    ) {
                        return;
                    }

                    handIntroAnimation =
                        null;

                    handKeyframeAnimation =
                        null;

                    SETTINGS[key] =
                        v;

                    if (activeHandAnimation === 1) {
                        anim2PresetUntouched = false;
                    }

                    sync();

                    onInput?.();

                    // Каждый move ползунка сразу сохраняет
                    // активный Step.
                    saveActiveHandStep();
                };

            input.addEventListener(
                'input',
                () =>
                    apply(
                        input.value
                    )
            );

            value.addEventListener(
                'change',
                () =>
                    apply(
                        value.value
                    )
            );

            controls.set(
                key,
                sync
            );

            sync();

            row.append(
                name,
                input,
                value
            );

            content.appendChild(
                row
            );
        };

    section(
        'Animations'
    );

    const animTabs =
        document.createElement(
            'div'
        );

    animTabs.className =
        'gnp-anim-tabs';

    const animButtons =
        HAND_ANIMATIONS.map(
            (animation, index) => {
                const button =
                    makeButton(
                        animation.name,
                        () => {
                            selectHandAnimation(index);
                        }
                    );

                animTabs.appendChild(button);
                return button;
            }
        );

    content.appendChild(
        animTabs
    );

    section(
        'Keyframes'
    );

    const tabs =
        document.createElement(
            'div'
        );

    tabs.className =
        'gnp-kf-tabs';

    const step1 =
        makeButton(
            'STEP 1',
            () => {
                selectHandStep(0);
            }
        );

    const step2 =
        makeButton(
            'STEP 2',
            () => {
                selectHandStep(1);
            }
        );

    const step3 =
        makeButton(
            'STEP 3',
            () => {
                selectHandStep(2);
            }
        );

    const step4 =
        makeButton(
            'STEP 4',
            () => {
                selectHandStep(3);
            }
        );

    const step5 =
        makeButton(
            'STEP 5',
            () => {
                selectHandStep(4);
            }
        );

    const step6 =
        makeButton(
            'STEP 6',
            () => {
                selectHandStep(5);
            }
        );

    tabs.append(
        step1,
        step2,
        step3,
        step4,
        step5,
        step6
    );

    content.appendChild(
        tabs
    );

    range(
        'Duration',
        'handKeyframeDuration',
        0.10,
        5.00,
        0.01
    );

    const actions =
        document.createElement(
            'div'
        );

    actions.className =
        'gnp-kf-actions';

    const play12 =
        makeButton(
            'PLAY 1 → 2',
            () => {
                playHandSteps(
                    0,
                    1
                );
            }
        );

    const play21 =
        makeButton(
            'PLAY 2 → 1',
            () => {
                playHandSteps(
                    1,
                    0
                );
            }
        );

    const play23 =
        makeButton(
            'PLAY 2 → 3',
            () => {
                playHandSteps(
                    1,
                    2
                );
            }
        );

    const play34 =
        makeButton(
            'PLAY 3 → 4',
            () => {
                playHandSteps(
                    2,
                    3
                );
            }
        );

    const play45 =
        makeButton(
            'PLAY 4 → 5',
            () => {
                playHandSteps(
                    3,
                    4
                );
            }
        );

    const play56 =
        makeButton(
            'PLAY 5 → 6',
            () => {
                playHandSteps(
                    4,
                    5
                );
            }
        );

    const playScene =
        makeButton(
            'PLAY SCENE',
            () => {
                if (activeHandAnimation === SLEEP_ANIMATION_INDEX) {
                    playSleepScenario();
                } else if (activeHandAnimation === FLYIN_ANIMATION_INDEX) {
                    playFlyinScenario();
                }
            }
        );

    actions.append(
        play12,
        play21,
        play23,
        play34,
        play45,
        play56,
        playScene
    );

    content.appendChild(
        actions
    );

    section(
        'Head'
    );

    range(
        'Head RX',
        'headAnimRotX',
        -3.14,
        3.14,
        0.01,
        updateCharacterKeyframeControls
    );

    range(
        'Head RY',
        'headAnimRotY',
        -3.14,
        3.14,
        0.01,
        updateCharacterKeyframeControls
    );

    range(
        'Head RZ',
        'headAnimRotZ',
        -3.14,
        3.14,
        0.01,
        updateCharacterKeyframeControls
    );

    range(
        'Head Scale',
        'headAnimScale',
        0.00,
        2.00,
        0.01,
        updateCharacterKeyframeControls
    );

    section(
        'Eyes / Blink'
    );

    range(
        'Eyes X',
        'eyeAnimRotX',
        0.00,
        0.75,
        0.001,
        updateCharacterKeyframeControls
    );

    range(
        'Eyes Y',
        'eyeAnimRotY',
        -0.73,
        0.73,
        0.001,
        updateCharacterKeyframeControls
    );

    range(
        'Natural Blink',
        'blinkPose',
        0.00,
        1.00,
        0.001,
        updateCharacterKeyframeControls
    );

    range(
        'Mouth Open',
        'mouthOpenClosePose',
        0.00,
        1.00,
        0.001,
        updateCharacterKeyframeControls
    );

    range(
        'Speech O',
        'speechOPose',
        0.00,
        1.00,
        0.001,
        updateCharacterKeyframeControls
    );

    section(
        'Left hand'
    );

    range(
        'L X',
        'handLeftX',
        -5,
        5,
        0.01,
        updateHands
    );

    range(
        'L Y',
        'handLeftY',
        -5,
        5,
        0.01,
        updateHands
    );

    range(
        'L Z',
        'handLeftZ',
        -5,
        5,
        0.01,
        updateHands
    );

    range(
        'L RX',
        'handLeftRotX',
        -3.14,
        3.14,
        0.01,
        updateHands
    );

    range(
        'L RY',
        'handLeftRotY',
        -3.14,
        3.14,
        0.01,
        updateHands
    );

    range(
        'L RZ',
        'handLeftRotZ',
        -3.14,
        3.14,
        0.01,
        updateHands
    );

    range(
        'L Scale',
        'handLeftScale',
        0.00,
        3.00,
        0.01,
        updateHands
    );

    range(
        'L Grip',
        'handLeftGrip',
        0,
        1,
        0.001,
        () => {
            setAllFingerValuesFromGrip(
                'left'
            );

            handPanelSync?.();
        }
    );

    if (handExtraAnimations.left.length) {
        section('Left fingers');
    }

    handExtraAnimations.left.forEach(
        (item, index) => {
            range(
                `L ${item.label}`,
                item.key,
                0,
                1,
                0.001,
                updateHandGrips
            );
        }
    );

    section(
        'Right hand'
    );

    range(
        'R X',
        'handRightX',
        -5,
        5,
        0.01,
        updateHands
    );

    range(
        'R Y',
        'handRightY',
        -5,
        5,
        0.01,
        updateHands
    );

    range(
        'R Z',
        'handRightZ',
        -5,
        5,
        0.01,
        updateHands
    );

    range(
        'R RX',
        'handRightRotX',
        -3.14,
        3.14,
        0.01,
        updateHands
    );

    range(
        'R RY',
        'handRightRotY',
        -3.14,
        3.14,
        0.01,
        updateHands
    );

    range(
        'R RZ',
        'handRightRotZ',
        -3.14,
        3.14,
        0.01,
        updateHands
    );

    range(
        'R Scale',
        'handRightScale',
        0.00,
        3.00,
        0.01,
        updateHands
    );

    range(
        'R Grip',
        'handRightGrip',
        0,
        1,
        0.001,
        () => {
            setAllFingerValuesFromGrip(
                'right'
            );

            handPanelSync?.();
        }
    );

    if (handExtraAnimations.right.length) {
        section('Right fingers');
    }

    handExtraAnimations.right.forEach(
        (item, index) => {
            range(
                `R ${item.label}`,
                item.key,
                0,
                1,
                0.001,
                updateHandGrips
            );
        }
    );

    handPanelSync =
        () => {
            controls.forEach(
                sync => sync()
            );

            animButtons.forEach(
                (button, index) => {
                    button.classList.toggle(
                        'is-active',
                        activeHandAnimation === index
                    );
                }
            );

            step1.classList.toggle(
                'is-active',
                activeHandStep === 0
            );

            step2.classList.toggle(
                'is-active',
                activeHandStep === 1
            );

            const hasStep3 =
                HAND_KEYFRAMES.length >= 3;
            const hasStep4 =
                HAND_KEYFRAMES.length >= 4;
            const hasStep5 =
                HAND_KEYFRAMES.length >= 5;
            const hasStep6 =
                HAND_KEYFRAMES.length >= 6;

            step3.style.display =
                hasStep3
                    ? ''
                    : 'none';
            step4.style.display =
                hasStep4
                    ? ''
                    : 'none';
            step5.style.display =
                hasStep5
                    ? ''
                    : 'none';
            step6.style.display =
                hasStep6
                    ? ''
                    : 'none';

            tabs.style.gridTemplateColumns =
                hasStep6
                    ? 'repeat(6,1fr)'
                    : (hasStep5
                        ? 'repeat(5,1fr)'
                        : (hasStep4
                            ? 'repeat(4,1fr)'
                            : (hasStep3 ? 'repeat(3,1fr)' : 'repeat(2,1fr)')));

            step3.classList.toggle(
                'is-active',
                hasStep3 &&
                activeHandStep === 2
            );
            step4.classList.toggle(
                'is-active',
                hasStep4 &&
                activeHandStep === 3
            );
            step5.classList.toggle(
                'is-active',
                hasStep5 &&
                activeHandStep === 4
            );
            step6.classList.toggle(
                'is-active',
                hasStep6 &&
                activeHandStep === 5
            );

            const isSleepAnim =
                activeHandAnimation === SLEEP_ANIMATION_INDEX;
            const isFlyinAnim =
                activeHandAnimation === FLYIN_ANIMATION_INDEX;
            const isScenarioAnim = isSleepAnim || isFlyinAnim;

            play12.style.display = isScenarioAnim ? 'none' : '';
            play21.style.display = isScenarioAnim ? 'none' : '';
            play23.style.display =
                !isScenarioAnim && hasStep3
                    ? ''
                    : 'none';
            play34.style.display =
                !isScenarioAnim && hasStep4
                    ? ''
                    : 'none';
            play45.style.display =
                !isScenarioAnim && hasStep5
                    ? ''
                    : 'none';
            play56.style.display =
                !isScenarioAnim && hasStep6
                    ? ''
                    : 'none';

            playScene.style.display =
                isScenarioAnim
                    ? ''
                    : 'none';

            const scenarioPlaying = isSleepAnim ? sleepScenarioPlaying : flyinScenarioPlaying;
            const scenarioCompleted = isSleepAnim ? sleepScenarioCompleted : flyinScenarioCompleted;

            playScene.disabled = scenarioPlaying;
            playScene.textContent =
                scenarioPlaying
                    ? 'PLAYING...'
                    : (scenarioCompleted ? 'REPLAY SCENE' : 'PLAY SCENE');

            actions.style.gridTemplateColumns =
                isScenarioAnim
                    ? '1fr'
                    : (hasStep5 ? 'repeat(4,1fr)' : (hasStep4 ? 'repeat(4,1fr)' : (hasStep3 ? 'repeat(3,1fr)' : 'repeat(2,1fr)')));
        };

    handPanelSync();

    document.body.appendChild(
        panel
    );
}

// Animation editor panel is intentionally disabled while material tuning is active.
// buildOilPanel();

let earringMesh = null;
let earringMaterial = null;
let earringAmbientLight = null;
let earringKeyLight = null;
let earringFillLight = null;

function rebuildEarringGeometry() {
    if (!earringMesh) return;

    const radius = Math.max(0.01, SETTINGS.earringRadius);
    const depth = Math.max(0.005, SETTINGS.earringDepth);

    // Цельная круглая "таблетка": цилиндр с небольшой толщиной.
    // CylinderGeometry по умолчанию направлен вдоль Y,
    // поворачиваем геометрию так, чтобы лицевая сторона была по Z.
    const nextGeometry = new THREE.CylinderGeometry(
        radius,
        radius,
        depth,
        64,
        1,
        false
    );
    nextGeometry.rotateX(Math.PI * 0.5);
    if (earringMesh.geometry) {
        earringMesh.geometry.dispose();
    }
    earringMesh.geometry = nextGeometry;
}

function updateEarringMaterial() {
    if (!earringMaterial) return;

    const baseColor = new THREE.Color(SETTINGS.earringColor);
    const brightness = Math.max(0, SETTINGS.earringBrightness ?? 1.0);

    earringMaterial.color.copy(baseColor).multiplyScalar(brightness);
    earringMaterial.metalness = SETTINGS.earringMetalness;
    earringMaterial.roughness = SETTINGS.earringRoughness;
    earringMaterial.clearcoat = SETTINGS.earringClearcoat;
    earringMaterial.clearcoatRoughness = SETTINGS.earringClearcoatRoughness;

    // Небольшая подсветка базового цвета нужна, чтобы цвет серьги
    // оставался читаемым даже при metalness около 1.0.
    earringMaterial.emissive.copy(baseColor).multiplyScalar(0.035 * brightness);
    earringMaterial.emissiveIntensity = 1.0;
    earringMaterial.needsUpdate = true;

    if (earringMesh) {
        earringMesh.visible = !!SETTINGS.earringEnabled;
    }
}

function updateEarringTransform() {
    if (!earringMesh) return;

    earringMesh.position.set(
        SETTINGS.earringPosX,
        SETTINGS.earringPosY,
        SETTINGS.earringPosZ
    );

    earringMesh.rotation.set(
        SETTINGS.earringRotX,
        SETTINGS.earringRotY,
        SETTINGS.earringRotZ
    );

    earringMesh.scale.setScalar(
        Math.max(0.01, SETTINGS.earringScale)
    );

    earringMesh.visible = !!SETTINGS.earringEnabled;
}

function updateEarringGeometry() {
    if (!earringMesh) return;
    rebuildEarringGeometry();
    updateEarringTransform();
}

function ensureEarringMesh() {
    if (earringMesh || !model) return;

    earringMaterial = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(SETTINGS.earringColor),
        metalness: SETTINGS.earringMetalness,
        roughness: SETTINGS.earringRoughness,
        clearcoat: SETTINGS.earringClearcoat,
        clearcoatRoughness: SETTINGS.earringClearcoatRoughness,
        emissive: new THREE.Color(SETTINGS.earringColor).multiplyScalar(0.035),
        emissiveIntensity: 1.0,
        transparent: true,
        depthWrite: true,
        depthTest: true
    });

    earringMaterial.onBeforeCompile = shader => {
        installGnRevealShader(
            shader,
            false
        );
    };

    earringMaterial.customProgramCacheKey = () =>
        'gn-earring-reveal-v1';

    // Вся голова использует MatCap и не нуждается в scene lights.
    // Свет ниже нужен только физическому материалу серьги.
    if (!earringAmbientLight) {
        earringAmbientLight = new THREE.AmbientLight(0xffffff, 1.55);
        scene.add(earringAmbientLight);
    }
    if (!earringKeyLight) {
        earringKeyLight = new THREE.DirectionalLight(0xffffff, 3.25);
        earringKeyLight.position.set(3.5, 4.5, 5.5);
        scene.add(earringKeyLight);
    }
    if (!earringFillLight) {
        earringFillLight = new THREE.DirectionalLight(0x9fb9ff, 1.15);
        earringFillLight.position.set(-4.0, 1.0, 2.5);
        scene.add(earringFillLight);
    }

    earringMesh = new THREE.Mesh(
        (() => {
            const geometry = new THREE.CylinderGeometry(
                Math.max(0.01, SETTINGS.earringRadius),
                Math.max(0.01, SETTINGS.earringRadius),
                Math.max(0.005, SETTINGS.earringDepth),
                64,
                1,
                false
            );
            geometry.rotateX(Math.PI * 0.5);
            return geometry;
        })(),
        earringMaterial
    );

    earringMesh.name = 'gn_earring';
    earringMesh.castShadow = false;
    earringMesh.receiveShadow = false;
    earringMesh.frustumCulled = false;
    earringMesh.renderOrder = 12;

    model.add(earringMesh);

    updateEarringMaterial();
    updateEarringTransform();
}

function buildMaterialPanel() {
    // Panel removed from production version.
}


try {
    ensureEarringMesh();
    syncGnRevealPalette();

    // Reveal starts later in PART 3 only after Natural_Blink
    // is initialized and the eyelids are physically closed.
} catch (error) {
    console.error('[GN HEAD] Reveal init error:', error);
}

let headLocalBounds = null;

function rebuildHeadBounds() {
    if (
        !headMesh ||
        !headMesh.geometry ||
        !headMesh.geometry.getAttribute('position')
    ) {
        headLocalBounds = null;
        return;
    }

    headLocalBounds =
        new THREE.Box3()
            .setFromBufferAttribute(
                headMesh.geometry
                    .getAttribute('position')
            );
}

rebuildHeadBounds();

/* =========================================================
   BVH — УСКОРЕНИЕ RAYCAST ПО ГОЛОВЕ
   Строится один раз после загрузки модели. После этого все
   raycaster.intersectObject(headMesh) используют BVH.
========================================================= */

let headBVHReady = false;

async function buildHeadBVH() {
    if (
        !headMesh ||
        !headMesh.geometry ||
        typeof headMesh.geometry.computeBoundsTree !== 'function'
    ) {
        console.warn('[GN HEAD] BVH unavailable');
        return;
    }

    // Даём браузеру показать модель до одноразовой сборки BVH,
    // чтобы тяжёлая геометрия не давала ощущение чёрного экрана.
    renderer.render(scene, camera);

    await new Promise(resolve => {
        requestAnimationFrame(() => resolve());
    });

    const started = performance.now();

    // maxLeafTris=12 — хороший баланс: дерево строится быстрее,
    // но последующие 25+ raycast на стикер остаются очень дешёвыми.
    headMesh.geometry.computeBoundsTree({
        maxLeafTris: 12,
        indirect: true
    });

    headBVHReady = true;

    console.log(
        '[GN HEAD] BVH ready:',
        Math.round(performance.now() - started) + 'ms'
    );
}

const scheduleHeadBVHBuild = () => {
    buildHeadBVH().catch(error => {
        console.warn(
            '[GN HEAD] BVH deferred build:',
            error
        );
    });
};

if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
        scheduleHeadBVHBuild,
        {
            timeout: 3500
        }
    );
} else {
    setTimeout(
        scheduleHeadBVHBuild,
        1200
    );
}

/* =========================================================
   FIXED STICKER MASK
   Встроенная XYZ-маска: 1 = разрешено, 0 = запрещено.
========================================================= */

const stickerMaskHasPaint = true;
const STICKER_MASK_RADIUS = 0.045;
const STICKER_MASK_HEX = [
    "4421fea6707a01162120a4e37701cf2202a2ce7a019323bb9de97a0177245c9ad57c016c244096427c015b247f913f7b014824ed8d377a012c25e18a",
    "2a7c010027f887c78001e4286e88968601be2a6987f18b01a32c2387329201a72c9c8c739201bf2bc38fec8f01d62ad692658d01ef2991950b8b0108",
    "298b98b0880103294e9e6a8801c62a84a0658c01862cf3a06e9001412eeea13b9401fb2f1ea22b9801a83111a4609b015f333fa4509f010635a7a56b",
    "a201b6363fa537a6012139dea731aa013a38fdaa1da7018e36b1ab80a301e43490ab27a0013e33dfa9309d01ef342ca9e3a0019736e4a922a401a63a",
    "d1ac40ab01343c34b004ad018c3e7bb310b001e540e9b47ab3013843d5b582b6014446a3b6e7b9014b49f8b614bd01484ce4b7c2bf01fe4f51b8f5c2",
    "01ab53dbb886c5015157f1b8c9c701ed5ad1b935c901885eeeb9b5ca01d66285ba1acc0121671fbb41cd01206ceabaaace016570d3ba94cf01f3733a",
    "ba62d001347841bae3d0012a7dcfbafad0016b8190bbbbd001cc8753bc58d0010e8c93bd9acf0151908dbd20cf01b89626bc5cce018e99c1b986ce01",
    "1e9d32b8eecd01f49fd5b405ce018aa393b3cfcc0168a62db101cc0106aad7af46ca0164ae30afb5c7010bb21bada8c50185b6a2ad51c10188b9fdac",
    "3cbe0193bce0acc2ba01a6bf3fad02b70100c254ad7db30163c42ead94af0133c5a7a901ae01cbc601a785ab0138c97da45fa701b4cbc3a37aa2010a",
    "cf57a2049c0169d2e1a16f95011fd4a8a2e89101d5d56ba4848e0191d7c0a2e78a0176d8049fc588013fda839b95840127db70986282012cdba59305",
    "820140db0e8fe8800171dab08ab68101b4d8cf862c8501e8d6eb849c890112d5d882c58e011fd4bc80ee910135d22680ac980163d09d820e9e018ccf",
    "0b86c09f01b9cecd8922a101e6cd8e8d9ba201d1cef890a69f01b8cf9694fd9c0172d1cc95f398012ed3f695fd9401eed48596eb9001b7cf6094039d",
    "0141cce5929ca50190cab19275a901e9c87593d9ac014cc7da958caf01bdc5ae997db10100c5a29da7b1019fc28a9e7cb501b7c56f98e7b101eac8cb",
    "93beac018dcae091b0a90133cc6b8f85a60125cc908b6ea70116cc308768a80134cb3082f8aa012fcb4e7e53ab015acaac7a0ead018bc93d7774ae01",
    "8bc95d727aae01facb387145aa01a8cdaa72a9a60184ce1d7695a40163cfd27252a20168cf0d6f0ea2018acedb6b2ea401b1cd47681aa601accdb56c",
    "67a60186ced26f75a40163cf2c7356a20147d02877d29f01a8cd4e73aba601facb2b6f3aaa01fccbfe6a1faa01ffcbc566f7a9015bca186208ad018c",
    "c9a25e6aae01c0c8155aa0af0126c758563ab20164c6ca51d2b20173c6d74dc5b10185c6f84971b0019ec6e145b0ae01e8c52f4268ae0165c4d73d65",
    "af0115c2393ae0b10193c0aa36f9b20115bf5532cbb3015dc15037cdb101aac30c3b7aaf0106c60a3e46ac01a2c740409aa90129c917456ba8010ec9",
    "6f483faa01b0caac4b54a70176cb8a4f99a6012fcdc15254a20117cd2f56e9a301e9cd9c5971a201d2cd515df0a301c0cd586115a501b5cd5b65cba5",
    "018dce0b6a04a4016acf316de0a10164cf4f724da201cfcc267396a80158ca056d2fad01bdc87c6ad7af0120c76f62aab20187c54f5e44b501f6c331",
    "5b85b701e0c033554cbb01d1bd5b51e0be018cbb1a4e4cc1018cb8904925c40192b8984593c3011db7444030c4012cb7063bd5c20179b6d03665c201",
    "c8b5bb32d8c10114b5f12e77c101a0b38a2bf7c101a8b6302c3ebe01e3b8632f8dbc0121bb0f33c6ba016cbd083630b801e8bee63965b7019abfa13d",
    "eab70184bfbe41a2b901a0bf9a3c70b701a8bc023515b901f6bbd93076b801bab9c52cebb90187b7b428c0ba014eb5292531bc01e3b32521a3bb01ba",
    "b1731d95bb0198b2a51becb70195b51e1e8bb501cdb70a218bb4010fbae523a5b20179bb02288cb301d9bc3f2d14b50157be86302eb401afc0e332e2",
    "b00132c21d36bbaf0116c2283ad7b101e3bb423411ba0199b96532d3bc019cb67d2e4cbf01a5b3942a77c10176b135275bc20185ae1a2441c4019dab",
    "58207ec501aea88e1ecec70107a5031c9bca0123a29c1915cc01899e671725ce01f19aa11402d0011298d612dcd101f29a2514c1cf01d89db9144dcd",
    "01c5a0a31422ca01b6a33f15e3c6015ea7691720c40105a8e81a1ec60165a43517e4c701c7a02214acc901dd9d6f1366cc018799d311d7cf01a696e9",
    "101bd2015e927d0f55d401d18e7e0fecd501498b850e68d601a485030da1d6010080b70b1cd601597a320bfed401ab74a90991d101ec6e8008c5cb01",
    "956ac408a7c701f569560b93cc01026f070cfad101fd73a60ca7d4018877d90cd1d501c57b580d24d7016881c40dbad7010c87160e29d701ff8bcf0d",
    "a9d501858f75103cd60157929b133cd601688dbf0ee9d501048caa0bbad3013789f307e2cf018a88870518cb01458487046dca01d68226069bce0100",
    "80690710d101a479da0a7ed4016675a70b27d401bf6fe40d41d401096a390ed0d001ad65480ed4cb01b562900d8ec6017c60ca0d63c301485b220fd6",
    "bc01f058f00ef1b60110581f0e14b2017f5721100bb7019f57ab110ebb01c6574c14c6bf01c9546d1574bc019a4f2419b5b801f44df41784b301594c",
    "e017acaf01d14adf18d4ad01504a4e1c29b301b449831fdfb501d6498c2206b901e4463228c1b701b544ae2c6ab7013e438c3009b701ee402c3325b4",
    "01673f83369eb201063da137caae01953a083806aa01df38d4378ba5017b3ac53536a8019e3d13322eac0101408c2f21b001a540782b61ae010d4279",
    "2752ad015644542476af01ae46bb220fb301934a712162b901a04d6b2060bd016351b91fddc1011555f31d15c5010b582b1d3cc801b65b381c9bcb01",
    "0d60a11a72ce0160640c1946d1011b6a6e1800d501156f0a1661d701bd7417153bd901ac79641596da01e47d591683db01ac797a1810db0127760919",
    "04da01ea71111a82d801aa6d161bd4d601bd74011e31d901987efa1e89db01f78bf11ec8d8012d952f1e95d501c39d321dbcd0015fa15f1d43ce0183",
    "a3b220e2cd0179a375253dcf01b7a2d62ae9d001239a9e2a7bd40108936d2733d701d789c2254fda011b825925a4db017c7c682457db018f77e82337",
    "da015473fe23ead801ab6d6a23dfd601fb678222add40169643022e6d201c65bc121cecd01dd58e9218bcb013455132499c8010753232792c7011d50",
    "b12a1cc601b64e8c30c7c601f8500434d8c901af515d30d5c9019654662c64cb01bf56e5280bcc01a659362701ce013f5dc025b8cf018c61712489d1",
    "011960442126d0011d6a392070d5017175042055d9013784552003db01618d4e2048d80176943720e8d50171998622fcd301bb9dda23d9d10179a36d",
    "253acf0157a69e2843ce0138a94f2c0ecd011eac332f86cb010baf0e3266c901beaf0937c5c901b5af0f3ba0ca01f2ae973e01cc0175ad9f41c0cd01",
    "87aaf0454ed001e9a6ee46b0d201e0a17047a0d5014e9ea14865d7015099874848da01c1956948cedc013492b64860df01da8b3a49a7e401f3869349",
    "69e801c382104a42ef019e7e684ad9f001787ab24a30ef014376a14a74e7017173a94afce3019c70114bb0e001c56d694b00de01cd688b4b98da01f3",
    "65164dc7d801346aa95072da01ca6ba05144e5018c6ca5523ae901b46ea5531dee01d570435492f2014172c95521f601bb75d05613fb01db79f6576d",
    "fe01a27e4359e7ff01b982fa59beff0182873a5acdfd01438a445879fb01bd8d595568f6012a8f50538df2014e91125240ed01c6927450e5e701aa93",
    "9c4fc7db017f96634d6bda01c29a3e4c79d801079f0e4bb4d6019ba21f4befd40132a6fd4af5d201cfa9084bbbd00171adb04a36ce015fb00e4beacb",
    "0152b3fb4b69c9014ab6314ca6c60149b9294c9dc3018cbbf24d49c1014bbc80519ec00147b9bc4fd0c3014ab6194fbac6011cb1e74e45cb012dae0e",
    "4e94cd01cfa93f4da1d0017aa59d4c41d301e3a1654b47d5012e9c234cd9d701ea97c64cc5d901a993064e0edc015691745016eb0197904852ceee01",
    "3b8f434f1eed01648fde4c65e0018d8cae4842e401a887eb46bfe601c8824d4725e7019b7e14472de7018d75264504e60131682d429bdf01895a4a3e",
    "dbd3014750783a62ca01b545633659bd01ac544f37e0cd017f6e6f3894df01e284de38ece301ae8ee93878e1015094a339f6de019198463a60dc01fa",
    "9e703ac1d80177a5573abed301b39f073a0ed801079ad338a7d901f292cf37c3dc0148863a34e3e2019a7e0931e7e301697ac42fa7e201ce74332f58",
    "e001dc6f262fc2dc01e06a5d2e93d8014d67632e11d6017564ac30e6d4010f636234b3d5012463f03823d9013763253e5edc0155659842e5dc01046b",
    "d943d5e0015a71354479e4015778644449e601e97dbf441fe6012b84bb484fe8019a87434b17ef01f488ab4d77f3012b86b64f3af9010d82fa4f5cfb",
    "01a17ef04e1cfa018f7c7b4c45f501da7b5d4a3eef01d27b5c456ce601847c46412ee5016581033ef3e401f9866b3b5fe401668fe637c2df01cc9f89",
    "3237d401a4aa16301fcd01b1a2bc2dc3d101909bfa2bf3d3010193822c02d901348bce2d4edf01fc868e2f21e201ca820332f8e3019a7e3f34dae301",
    "04791e37c8e2015471543938e201b86b823b03e101c866413e1cdf0134630741cbdb014f60eb4174d8016b5daa42ccd501d059364442d30177552345",
    "41d0018c524a4606ce019d4f1f499fcb01684d934bc5c901704a124c19c7017247b54b14c401aa434b4bd1bf015c41cb4ad4bc01c33f6447c2b901b0",
    "3fd14249b8019e3f243fd6b601c13e603c15b4018f3bc23c9fae015238483fc1a8016b38894284aa01af375d467baa010a36564854a7016d34514cb8",
    "a401a133d74fb3a301ce328b5335a2010232de5822a10117327b5c85a20153305a5fb79d01722fb662739b01862e1f658898019e2e6169069a01ad2d",
    "a26cdd9601b52df970549701ae2cc772e19201b42c20773b93019e2bf378ec8d019e2a0b7e0a8a01b429fb817b8701c52986858e8801aa2b7884a98e",
    "019e2d1583eb9501a32e5c7e5a9a01992f617ce19d018730fb760ea1016a314d7483a301f933136f7da9019c35e86b83ac013b379a664daf01d63846",
    "6301b2016d3a0c608bb401c73cd25ae5b701543efe56dab901de3fe353bbbb012a426f5181be0133458750f9c1013648365127c501af4399514bc001",
    "6641f6529fbd01a240aa56b0bc01003cfd58deb6016e44eb58d6c001ae49c457ffc501a44ccd577ec801535013568fcb01b5545354d5ce019c57f452",
    "d5d001385bd4510ad301d05e31501fd501ce63535060d7015d67e24f09d901e96ac950d9da013f6d9e516fe9018671b05296f201a173cd524bf6013c",
    "74094df3ed01b977db4c4df201be2bc18ed98f01922d2e8f3095015a2f6c91f1990133301695af9b01eb31ae97a69f019a33e59a3ca3014635ed9bc0",
    "a601e936af9db2a90182382ba019ac01b53ba8a267b101103e5fa4ceb401644016a6d7b701734395a856bb017c46c0a9a9be01f84ac9abb7c201ef4d",
    "c7ac23c501e050fbac67c701e2582ead29cc01ed5d48ad84ce013862b1ad15d00181661bae71d101e76c6aae27d301dd7179ae20d4011c76a3aea8d4",
    "010e7b16affad4010080a4af09d5013c84ecafebd40179887fb08ed4016d8df4af3ad401ac918fafa4d301a1965aad19d301e79a29ade8d101779e76",
    "acc6d0017ba3e5aaf3ce0186a887a9abcc0128ac36aa6dca01ccaf35a94cc8017ab38ca89bc5012eb74aa6a8c201f1ba85a4d4be016eb62da66dc301",
    "77b316a7eac501c8af5fa7b5c801f5a9eaa73dcc019fa5eaa786ce0195a051a540d101019d33a4dfd201259a06a242d40196968ea094d50109937b9e",
    "cad601808fb99d90d701448bcd9d2cd8015586d19c9ad8011c82f59c87d801c67b079c94d80141782d9ab5d80107747c9972d8017f702e9cb5d70141",
    "6cf19cbad601b5687b9db0d501db6587a04cd401496202a2bfd201b45e37a314d1011b5b87a43dcf01c656e0a4e8cc01ae51a4a4d0c901044ec7a342",
    "c7010e4b9da3bac401534728a257c1014f441ca13ebe014641c79e1cbb01fd3e179cb0b801e73b4698fdb4018b39b794abb101f137149206af014f36",
    "6690fdab01b434f98b76a9019435c887efab013837ff851baf019f39fa851cb301a1391f8a2bb301663a968f0eb401853d2f943ab8010b3f7997bfb9",
    "011442579bc9bc0155446a9ec2be011342ea9badbc01ce3fb29884ba01833d0a9512b801f83bcb914db601683aa38e2cb4016c3a1d8a7db4016b3a68",
    "865db401653a9a82f5b3019639a77e74b2010038ed7b1ab00135373378e9ae013537fb73edae013637726ffcae01ce38786b79b1012c3bdd67f3b401",
    "483eaa64fbb8019640b262c5bb016041495e27bd01ea42915931bf0131451a57c0c101b546275483c301ad439a5812c0016441f95a6bbd01163f655e",
    "8fba01893d84617cb801f63b8b6613b601603ade6a97b3019339766e48b201c938987214b101ff37a47605b0013537827bedae014b97135d98d501d6",
    "9a6e5bf3d401209fbe5bcfd201b4a2775b4fd10104a78c5b54cf01a1aad15b5ccd01feae1d5cacca0164b3975ca7c70158b69e5c67c50113bae75c19",
    "c20116bd485e0ebf015ebfeb5f96bc01acc17362d8b901fec33064e8b6015ac6426787b30127c7a96a2bb2012ac79d6eebb1012cc7aa72cab1012dc7",
    "e876c2b10164c6de7aceb2015ec6eb7f31b30159c6288499b30158c66488abb3015cc6d38c51b30197c5869022b4010bc45994f0b501b6c1d0950fb9",
    "01a9be969956bc0165bc839c8abe0162b92c9f87c10162b6859f8ec40169b31f9f39c70101af1aa165ca01a5aab6a2facc0108a7c0a2e1ce01b7a276",
    "a2ddd0016c9e10a38cd201259af9a215d4019996c8a3fbd401ead802af1d8d01cdda9eab768701c9dbf6a8108401d6dcf5a3da7f01ccdd9ba1e47c01",
    "cdde379c6f7901d8de7098e07801d04428b3a0b901d04753b52dbc01cf4a88b6dfbe01c64dfdb725c101ba50a4b869c30166540bb9f0c5010b58feb8",
    "27c801a95bf6b8e5c901445fbfb880cb01026521b8d0cd019368bfb89fce01d86cbdb94dcf011b71d7bab2cf015e7562ba83d0019e7998bb7cd00195",
    "7ebbba0cd101d582c7ba10d101ca878bba1ed1010b8c6abaeed001039166ba47d0014895c0ba44cf01d598c2b81fcf01639ca1b6c9ce01f29fd9b358",
    "ce0188a367b228cd0124a732b253cb018aa357b3e2cc01f59fe0b401ce01b5a041b874cc014ea400b8e6ca01eaa791b67dc90189abdcb4c9c7012caf",
    "8bb203c6011cb27fb105c40116b52eb154c10116b857b16cbe0111bbc4b125bc0113be62b29bb90165c0a7b08cb601c2c2a7afe4b20163c41aad8faf",
    "0103c687aa7aac019cc7c7a600aa015dc8dba293a901efc56aa4e9ad01f3c18ea675b401d2be51a71bb90185bc21a8ebbb0179b9e9a880bf01b6b5f8",
    "a87ec301beb213a919c60113af41aa90c80172ab41ac5bca011aa727ad9fcc0180a32bae40ce01ea9f30afa2cf01349a18b075d101ef9554b090d201",
    "f890c2b073d301b88c04b104d4017a8848b155d4013d84f2b09fd401b480c6af01d501787c30ae50d5013b7857aef5d40148736aada1d4010a6ffeab",
    "3fd401c96a48ab68d3018666dea975d2013e628ca907d101ab5e07a9cdcf01155bf4a77ace017b5712a7d5cc01db5362a6ddca01774ff3a6c0c70183",
    "4cc9a65fc5018649baa760c201844665a752bf01b64296a6f1ba0162407fa6b3b701063e39a614b401a43b94a51bb001343923a580ab018e37daa42d",
    "a801e53590a4c5a401383448a43ca101893268a3ac9d01c731589f639d010e300d9f539901502ec39e2995011130829e859901c531af9f3f9d017833",
    "daa0f7a0012935e5a0c4a401a03741a271a901043a83a5fcac018f3bcfa898ae01e139c3aa86aa017337d6a84da601f734d5a76fa1014e33c5a6369e",
    "019d3101a6ab9a01eb2f7aa51a9701362eb3a49a9301832ce8a1459001c72a4e9f828c010329c79d6d88013927b19c1384016825599c8d7f0162257e",
    "98367f014b26ba958981014326d3910681013326208e2080011c263a8acd7e01f627c188e48301d528a285af8501b6298682a68701a629637eb08601",
    "9a2ad57bcd89019d2b5e78d68d01b42c7f76359301b92de5759b9701b22e7f734c9b01a12fd170669e018830316e14a1014432116a70a5011a335665",
    "23a701103378617da601f333d86412a90121331c6b9ea70148328c73b0a50146327e7792a5014432f77b65a5014132ea7f2ea5013632bb8487a4014b",
    "31dc867da1015c30ac88449e016a2f7d8afc9a017b2ea78cdd9701782e6690a697013930ac921b9c01f231a89522a001b033eb95a6a4015d35ea9641",
    "a8010537e897a0ab01a438f39981ae01083b7e9c58b2017b39e79881b001e437a79517ae014c365691bdab018635518dfcaa01bb34b789eda901ec33",
    "fb85a9a80119336e8217a701e533f6882da801a934d08ebfa801703598928ea9011237e69487ac01d637ab9830ad0170390d9bcaaf012c3a039fdeaf",
    "01b73b4fa28cb101183ec7a266b5016940eea43cb801163e4fa334b501903c29a0cdb301333aab9d66b001a138839a50ae01e0378196d8ad01473686",
    "9269ab018735118d0bab01e533108928a80114333a85c0a6013d321b82f5a4016231127ff7a2018330d57bc3a001873026770ca10189305e722ca101",
    "8830696e17a1016631356b42a3014132d26738a50118338a6408a701c134956061aa0166365e5e8bad010638885b82b001a3396d5955b301ff3b2857",
    "d1b601523efb53c4b901a2402453adbc01533efc54cfb901003c1c58d9b601a339555a5cb30108384e5d9ab00169364a60b7ad019b35226468ac011e",
    "331c6869a7014632816b8ea5014032356725a501f233be640fa901c13467605aaa016736dc5e97ad010838bd5c93b001a339a05a5eb30109388e5fac",
    "b0016b361c62d5ad016c365266f2ad016b360d6ae6ad016a368c6fcaad016936cd73c0ad0169368877b7ad0169361f7cb1ad016936b580b7ad016936",
    "ea84b1ad016536998870ad012b37e68d42ae011e37c89163ad010b37659615ac017d35bc8f60aa01e83307885aa8011a33bd8125a7011e33e37c69a7",
    "012133f07798a7012333ce73b5a7014832656eb1a5014432a06966a5013c329365eba401103378617da601c034c95f43aa016536485d6cad01d638fa",
    "5c0ab201383b9c5acab501533e3b56d8b901a2400055b3bc01664129518fbd016141094d2fbd01554152484bbc01fe3e4f48ccb801ad3c214bf4b501",
    "233b1b4e41b401653a3b52edb301cd38c35463b1012e373f5771ae0185350159f4aa017935f35423aa016935135106a9012936a04c59a901e7369a48",
    "90a9017b38ab44a3ab01073aba4045ad01b43a383b3cac01353c883716ad01b53d3c34f0ad0110403e3153b1012a43c92d6eb5016545112aa3b6011c",
    "490224e0b8015a4b6421abba01644eb320a1be016051461f88c10109551a1caec3010558131c7ac701f55a2d1b49ca01e15df71adccc017d613c1918",
    "cf015d649017d0d0010560cc1739cd01195de31761ca01335a301ac6c8014357841b1ec60150540c1d7cc3015651091e8cc001564e031f49bd01bd49",
    "4320b8b601fa44882193ad016f42832121a601f53d3429a4a401e23f7f2cbfad010440dd2f5cb00122408a33c4b2013e401638e2b401bd3eee3bddb3",
    "01463d3f418cb301923c814500b401d63eed3fc3b5011a41d93a9cb70192426b3623b801d4445c31f6b9010d47ff2c42bb01054a802851bd01004da7",
    "25c6bf01ec4f522112c1011a525c1ec5c101fe54a61a7ec2015c54fa1eeac4017751f022e9c301954e112984c301644c562c73c201f34ab13033c201",
    "c1486d3643c1014d47ec3acfc0015c47434021c20166477d4403c3015b47d43f08c2014f47b13b05c101404a1a35a6c201b84bb9317fc3012e4d572e",
    "41c4011d509c2a12c601c053e825d1c701aa56b72297c901d158eb1e21ca01695c491a38cb018d5e461780cb0174613316b6cd017a66cb1111d0010a",
    "6a7d0e1ad101986da90ce8d101da71b00bf0d2011976650a03d301587a5c0a20d4014b7fa40a19d501c47bb90bc4d501fc73ed0bf8d3019b6d630db8",
    "d2014e69010ed5cf016a668c0e15cd010462d60e90c7014e5e2a0f4fc2015d5b6f10abbf015458c81087ba0109564011a3b6010653c61257b301fd4f",
    "6014c5af01194f1c1482ab01c24d161683ae017b4f55177db5011251bc1747b901a2521b189abc01765679197ec301ad5b211a62ca01c660991afcce",
    "011a65f51a3fd20166695b1bded401aa6d801ad6d6013671e9184ed8017275b518c7d901ac79e41702db01e47db917c4db011b829a1696db017088f3",
    "1644da01ab8c1f1703d90135906217b8d70178946517a9d50179991b188bd2013c9f58196cce015b9c7a170ad0019d96ea1514d4010c93e41425d601",
    "808fe71390d701f98bc61269d801a185551153d90168819c1081d90126898111aad801628d4f12d3d701eb90aa13edd601e7951d1567d4017c996516",
    "06d201a19641134bd3015c92b9101bd501d38edc0e7ed501e0894d0ddfd5013d84fa0909d4011f8283071fd101ac85ec0661cf019e8ac9090fd201db",
    "8ebf0bafd2016492ab0dd3d2011c98d00fd9cf01ba9bb91081cc019d9e7b12c4ca01fda29c1436c701eba52416cfc401dca8ac175ac20196acb4184f",
    "be019cb2521b74b701e8b41f1c5db401bbb8951ee2af015cba281f11ac01c4bcbb207fa7011ebf55234aa40166c82234d89b012fc86b35b29f0126c7",
    "be3618a50133c6be3808a901eac6683c59a901a0c77440baa90108c6b33d19ac01b2c3d439e1ae0158c1f63725b2013bbed43464b60162bac43161bb",
    "0119b89e3029be0117b5442e36c1015cb1f82be3c401b2adcd2844c701c2aa0b278cc9011ea7012418cc013ba42b2189cd015da1201e7fce01c59dda",
    "1b66d001cea2ab1eb4cd01a8a8c41f8ec80153af7721efc1015cb52723ceba0149b97223c1b30175bc8e2400ae01d8becd25f5a9018ac04b2647a501",
    "4cc4a42d8aa30143c368303ca90194c1df309ead01ecbf343182b1013cbeb03455b601bbbf7b3860b5016dc05c3cf0b501edc12a40f3b401a1c2f043",
    "56b50129c40147d1b301e2c4d14accb30173c6bb4dbcb10108c8f05069af01cbc83755d6ae01c0c81e5aa1af018cc9555e64ae0189c9666297ae0188",
    "c92d66a2ae018ac9866a90ae018ac97e6e7bae0158ca037233ad0128cb8c75cbab01fccbcc791baa0101ccf87dc0a9010bccc5822fa90117cc62875d",
    "a80127ccfe8b56a70134ccc18f70a60121cd399433a30108ce50977ba00116cea19b879f0125ce2f9f899e0187cce4a2faa001e3ca20a5e2a30142c9",
    "5aa7b7a601a2c718aa8aa901cbc69ead90ab013bc9e8ac27a701b2cb19aca3a2015dcde8aa4b9f010dcfcba8c99b01bed077a661980145d370a3a093",
    "01fbd4e3a0229001b5d6539e978c0176d8169dc588013fdafc9b9684010fdc68992f800112dc6695f17f011edcb1914f7f0112dc9995f77f01fbdc77",
    "98c07d01f5dc129d217e01e9dcbaa0c87e0112db3aa391830122daaba53f86015bd839a74f8a01a0d60da8d58d01e9d4f9a83d910134d315aaab9401",
    "81d118ab079801d1cf00ac5a9b0124ce01ada59e0175cc30ae25a201cdcafcae5aa5015ac8d5afc1a901eec50fb0f4ad01bbc2f2b066b30162c09fb1",
    "cfb601d1bb57b28abb011eb857b3b2bd0128b57cb4aebf01f7af18b6efc30190abdab609c70183ae9fb781c4017bb1efb7bcc10136b5f3b65ebe01e9",
    "b89fb61abc0159bd65b6b4b90160c0feb5f5b60175c301b55eb30172c750b3e0ac01ddc9f2b2e3a80152ccdeb179a401d1ceccb0a69f0155d1b8afce",
    "9a0108d3c7ae4e970191d568ae9f92014cd75dad008f010cd937ac2d8b01c8dafeabb6870196dcf4aa5e830167de1aaa0c7f0151e0a4a777790174e0",
    "74a48f770198e083a0a27501aee0be9c6d7401c2e05d98567301d8dfe194727501fedd5f91237a012fdc708e577e0161da428d9b82019dd8e68a7886",
    "01d7d6c0889b8a010ad5ef87458f0134d36486a2940141d2cb83e3970166d10989c099016cd1d38c54990136d3308c8d940104d5e98aa28f01ccd6a3",
    "8b458b01dcd5098f218e019cd76491518a015fd98c935f860187d8588fbc87017bd9028dcc8401b5d7f48ad08801f1d52b88df8c010fd5c784f78e01",
    "2ed3b68208950147d1b580a99b0150d0467d3d9f0168cfde7a0aa20185cea67783a40184cecb739ca40186ceb46f73a4018bce1e6b1da40192ce1067",
    "b3a301afcdc26938a60188ceba6d52a40184cea2718da40147d0dd74d49f0131d1dd78ff9c0125d2397b9e990125d3287f90950120d4a681e8910110",
    "d50d84e48e01f4d56587bc8c0121d47086d2910141d29683ed97014ad17e81789b0155d0ae7ef99e0187ced2795da401a8cd5276a1a601cfcc357293",
    "a801fbcbea6e39aa0129cbe96ab9ab0188c9f266a0ae01edc7f36450b1011fc79961b2b20188c5175f3cb501bec4fe5a70b601c1c4485739b601c9c4",
    "9b52a6b5013dc3f84e7db701b7c10c4bf9b80169bfb448c0bb0122bda54522be01e4ba4041eabf016ab9873dd5c00130b7da397ec201bbb5073601c3",
    "0182b31433c3c4014ab1b830bac601daafa72cdfc601b5ad3428fac60146acc92403c70132affd274cc50116b2322d92c401c4b5b93334c201f7b739",
    "3819c1016fb9db3b5fc00162b94c4089c101dbba4244aac00157bc2a48a2bf01d7bdca4b59be0121c0e84dbbbb0172c2d44fd0b801cdc4065160b501",
    "5ec6905331b301f4c7f656cdb001bdc8095cceaf01bfbe93a19aba0111c117a08ab70166c3a69d72b401c9c5739c95b0015fc7049a40ae01d0c5e59d",
    "1bb00171c325a0a6b30118c10ea2feb601fdbd07a34ebb01b3bbf1a30bbe01acb81fa551c101b0b597a60dc401bdb297a834c60115af31ab55c8012f",
    "ac7cad9ac90190a8aeae6fcb01f2a4cbae63cd01a1a000af61cf01579c68afecd001c698a5afffd101389548affdd2014090ebae10d401018cddadf1",
    "d4010f87cdad5ed501d28248ada9d501967eb0ae43d50187834caf1ed5017988e2ae00d501208e7dae82d4016192c5aeb5d301eb95d4ac63d3017799",
    "ceaad1d201a77935a6fed6012e7d15a567d701b480c7a3b2d701398479a2e5d7017488afa1e3d701fb8bdba261d701d08e84a62fd601f290e3a917d5",
    "012e3b02670fb501473e4865e4b801d53f97611abb019e40205e53bc0126424c5b3ebe016e44b959c5c001b1468a5738c30134485c5401c501724a00",
    "5238c701684d2a4ed2c9019d4f1c4ba9cb018c52294912ce017755d74645d0017655b24229d001fd532c3fa1ce013b533b3b46cd018752c43f6fcd01",
    "8c52e044f6cd018c52904812ce01b654f853e5ce015458145407d1011159595013d201cd59ce4ce8d201f75b93496bd401ba9a5b47d8d9014b9e2846",
    "e3d701dfa1cf44dbd501bfa4444222d401a3a796401bd201d3a92a3e37d0014dabda3a79ce0100ac0541dcce0188aac54445d001a2a769492ad201c2",
    "a4274bc5d301e5a19e4d08d5010fa421517ed30160a8815116d10101ac7d52bdce01a7af8f5307cc019ab23e558fc9018fb5725512c7018ab8b55644",
    "c4018cbbb25740c10194bead5802be011cc0e25b25bc0111bde75987bf0149b9fc559dc3010ab70a54dfc50110b4cd51a7c8011cb10d4f43cb0196b2",
    "5048f3c901d2b4954598c7019ab2254377c90167b09b4016cb016fb0bc3c4cca012442ac9413be006b41179006be006f41048c51be00a840a18814bd",
    "009a40da8415bc008740e2808eba0076402f7d4ab9002d417d790fb900e941cb7555b90029444f7217bb0071461170bfbd0030488c6fa3c400334b0c",
    "6e27c8000c4ea86bf5c700e350d768a2c700bc5373667dc7004c5716653bc700e25a8d63bfc7007e5ebe6247c900ba60b76128cd008861aa5fcfd000",
    "0063c25c2fd3002d65015aadd500eb65955648d7001268a8512cd9008069834d8ada0063670a4a3bda004a657f45d7da007962d84198da0057605c3d",
    "9dd900e15e6e3a96d700665db93615d500a65c6e3382d3002c5bc62f81d100945c1e2c16d1002a60182ed1d2007564a330e4d4004d674d2e0cd600e0",
    "6a9d2eb0d800236f8b2d5adb005f733f2c4add00e2760e2b14de00187b592a7ade00b380502a9fde009b85912a4dde00d3893b2ad2dc005a8ddc29de",
    "da00e590d129ecd8006f94642ba9d700b498bc2c9ad500439c482f33d400d09a2033f3d500a5989b3672d8007b969d3828db0000959f3aabdf007791",
    "503b24e200f48d933b88e300c4891c3b35e4009485e43a60e4006581413df9e400d17b1d3eb8e4005578b13f28e500d974714161e5005b71524388e4",
    "00d86db242fde200236d7c3d5ae200a570523da4e300ef76303ca1e400d17bdd3b9be4001782b23af1e400e184de3fede400df84eb4452e600d284d4",
    "4b32f300ce843d4ee0f700ca84c3504efb001884d353f4fd000b82d6568aff00f47dcd59d4ff008a7a0c5ca6fe001c77eb5c4efc005874c55d1ff900",
    "4072f45df9f50043723459faf6000875be547ef9007978c0527efb00957c4a53eafd00ae80fc522ffe00c68476556bfe0033889c5720fd00f48a3e59",
    "d3fa000b8d3c5d90f700c38d096055f400348f8a617def00f68f0b6330ea00f490a06295d40016928e604de7000992c85ed2ea004b91b25d45ee008f",
    "906d5b4bf100238fd457baf400288ff95318f300338fcf50a5ef00438f284e9eea00648f244d77e000a790554f76ea004891c653d8ee006a939c5863",
    "eb003494305c9ae5007194f75c11d7007e94fe5f3ed400ab905b623ee900828e5562ceef00ff8a4f6210f600398836626ef9000c824961a9fd00e77b",
    "975f11fe007a78315f79fc000975155ed5f9004272215d65f6006e6fc95cc2f0008b6cb05be3e800296a4f5a1bd800e8655258bcd600ed659b54b7d7",
    "000a68ac58add7000068975c94d500f267cf5fe5d200da67b063d5cd00b96775654ac700d2645f6813c5008a604a6898c5008e5b10683cc60049578a",
    "68c9c6000453046c54c700774f166ec9c700a04cda7025c8007f4a527462c800c9494d7883c8001449177c9cc8001249e27f76c800ed48d68228c500",
    "dc485286a5c3001449de88a5c8004249608abecc00cd4abf8c7dcf004d4c908f7bd1007c4ed892ebd2008e53119349d6002457529315d800b65aaa93",
    "96d9003f5ecf943bda007d6241952fdb00b566b69583db009b6b32962cda001b6f7f96f6d800a172f79453d9007175169130d9004178178edfd80008",
    "74cf8df2d8009070a38efadc00616c7f8f88de002a68609025de00f063aa9024dd006760ec9114dc00da5c7f92b6da0067608692fedb00a4644f915b",
    "dd00926901904fde002a6f098e64dd005373cc8ca5d800d7764f8aead700f3781f8790d700f1783d835ad600a579417f41d5006775e583bcd4007670",
    "408800d500ef6ceb8921d5005869218af7d100b165448a9ecc000f62648a3ec900a15b948acec8001d58a98a61ca009f54bc8a6dcc001f51d18acdcd",
    "00e34c008b8ece003f492d8a6fcc00ac47fc8821c900ae46b787f5c200644a7285f3c5005d4db785cac800364b508176c8001449fe7d9bc8009e4723",
    "78dcc700554d5f780fc8009951c67c83c700bb53dd7f3dc7004957f682c8c600fa5c21860ec600b0629288ccc500a06593896cc9001e644a88bdc500",
    "d45f6587bdc500215a64846ac600bb53af803dc700a04cfc7c27c8007f4a6d796dc800554ddd750fc8004f5260736cc700dc551371f7c600d75ae06d",
    "53c6001e5f996cc6c5003f66366cdcc4001b6ed36b6ec400c671c46b29cc006b75bf6b69d6009077a16b87da00647a1b6dcfdd007c7c6a72deda00e2",
    "7df378ebd700e27dbc7c3ad7005a7a317d58d50039783978e8d300f278517297d600617a3c6f71db00cc7bdb6cc7df007c7c7e71aedb007a7c8277ad",
    "d700c47b2c7c3cd600c47b2780b6d600117b748482d700f4780889fdd7005e7a168de8d8007a7c2e902bd9000080fb8e5cd90039845a8f32d9007188",
    "189042d900ec8b02913bdd00b88e579345de00a1932d94d7dd00db97d794c3dc00e89e729478db0073a2f59377da0053a5309570d80035a69d979ad2",
    "0066a38e9ad4d100d39f699b27d30067a3969ba3d1006da8d19990cf00c4acbd9850cd0085af5f9699cf0049b2d39368d100eab529915dcf0020bb85",
    "8e28ca0053bf588d74bd00a3c1258c80ba0052bf208b83bd0004bd628b8dc00025bb648bc7c900e0b8298c97cc00e9b59f8d74cf00c9b0c28f7fd300",
    "70ac349161d60024a8a89265d800dca3009334da009a9f4093c8db004aa5609084d900c1ab878ec2d5001cb05b8da2d20058b2aa8be3cf00c9aba88d",
    "ddd40072a71a8f03d800dda38e902fda002e9e66917adc0021978f912ede00eb92a491b6de00b68ebc91b2de00a18cad8ee0dc00fb8bc38a8ad7004b",
    "8b1a8678d500518bd28291d2005d8b9d7faacd003789977c23d0008288ae78e7cf001287de7582d300a1850872b9d800ea847c6fe4db00e784f26cac",
    "de00e4846e6afde1001e89f46733dd00428bc6667ed9001c8e3066d9d50073922266dace008b97176610c800db9b2866ccc600e99dda628dca00aea0",
    "796169cd0097a3356207cb006ba4d86311c70054a793664ec500edaa8669bec40085ae336b4dc4001cb2c06c05c40066b62c6d25c400c2b89c6e74bf",
    "0052ba5c71b8bc0015bb5e75d3bb00ffbab078a4bd0086bc077dd2bb00b3be31808cbb0061bf128455bc00b8be567f30bb00c7be8c7befb900cfbec1",
    "775fb900cfbed3735db90090bc54710abb0009bb306ed3bc0001b8116c38c000aeb5486b38c4005fb1426a96c400ccad216984c4007da93368f5c400",
    "2ea511687ac500e0a00c670bc600db9bbb66b9c6008e97076782c70040933b6804c900f48e286b84ca00c88c016cd5cd00bf87596e84d800eb848d70",
    "e6da00b4803274f1da0000803278a7d8006981ef7b77d7001d82c67f5fd700d1826d83ced700c41f20b35199007f213ab5b09c0055267db673c1003c",
    "290cbaf1c100802802b6a7c1009025b9b50da2004f2347b258a100bf21aead2da000d3245aafffa100662685b280a3006a293cb69fa4008f2b07bad2",
    "a300b72ee2b902be0035320bbc44bc007d31f9bcaea4003b35c8bdf5a5006939d0bb85d5005c3cbdbdd6d7002a3f9fc08ed700604351c33bd700de46",
    "c3c586d6005b4a3ac89dd500db4dfac9e9d4008b4783c7d7d5000b4489c56ed60082404ac44fd600ec3c19c337d500d0386fc37cbe004a3579c2aebf",
    "005630cfc0ddc000092c34bfebc0005023c0c3fe81009c2282c7b982000526b5c61fc700b523eaca07b1007d236fcd06ae00b42324d72392004627d5",
    "d8dc9a00ed2ae5db289a00bb2d12dc43a3006031c1ded3a200f6357edde3be004e3a0edf6cbf00773e97e18abc000443d3e245c100a146ace3d8c100",
    "bb4c28e3bcca00745230e37acb004b58ece205d000e15be8e260d1006d58dadf2bd400eb547fdeecd400ad5035ddd8d4005f4c09dc2ad300a84854da",
    "34cf006e44fbd8c3cf003940e9d6c8d000b83cdcd47fd100b5373ad28bd000363680d22ac300783819d36fd100633d6cd7b9d0003d422bdb7bce00dc",
    "47dade40cd00304e94e289cb009356f5e7fbc600765e76eb28c800ce64b3ee69c4000a6934f11ec100226b08f39abd00696f4af4b1ba000b7866f565",
    "b7005e7c97f742b1007b713ff862b2008f54b5f541a000104b74ecddc400cf5aa0ee3bc5004469b0ee8fcd00bc7621ef9fc9004d84e6ef00c2006493",
    "caeeadbf00c09f42ede8b9007ba699ec1db20071a81cecf0b80012a8bbecbbad0037a4c6ea1db500c7993be8b4c300c091c1e62fce00b68a75e7cbc6",
    "00458439e7ccca00de7d1ce747cd007b7718e793ce002c71f2e526d500436cdde555d700c36828e590d800f762bde379d100fb5de7e3a4d000fe5fbd",
    "e61dcc00476492e9ddcc004b69f9ec04cf009f6f41f0a9ca00ef7af5f415b700b78e8df8e1a000d0b529f4bf8c009bade5efdcb5004ea1ddedaeb500",
    "74983bed13be005c9023ecc6cb00a28addeb05d000ac8508ec28cf002482daecd2c600927e52ee20c700007b40efbdc7006e8168f188c100688e69f3",
    "1abc00309940f829980076a7c8f9a59100769e5af6789400cb8cd3edc9cc00c376f9e857cd008561a0e458d000a04f47e2edcb00f249f4e024cc00e2",
    "447be062ca00544175de89ca00d63dbfdbd2cb00903ca2d996ce00d9400fda22cf00584995dbadce001f4df7db3ad400fd5bc4de33d500206567e03a",
    "d300496cc3e0b3d800e8719be1f3d7001f76ebe159d6000d7b6ee26dd3003c7866e1e2d500ea71d3dd72d8006769fed93ed500fd6075d669d700ae5a",
    "b0d3abd8007f5650d2d9d9007c5df4d32dd80033653ed68ad6007770ced75dd500117bc4d955d800c887a8dbc0d200a28f2adc28cd0006968bdb5acd",
    "00009bf2da3fcd00eb9d5ddb13ca00b89b39daebcc005695f8d82dcc005986e1d427d600797c2fd47dd700b274c7d3a5d400546e38d3f6d3001c6a8b",
    "d21fd500e865ebd1c9d6006a6268d13ad800965dfacfc1db001d5a7acf19dd00f25c06cd05de00e463d5cc36db00be6863cd83d700396c93ced6d400",
    "6e70aece78d200a2795ed0e6d200967e57d180d6003b84d6d1a4d600788870d24bd500bb8cedd2d7d200049173d3d5cf00529575d3fccc00e19d0dd4",
    "becb0043a224d4a2c700f6a53fd44fc3005aaac3d487c00009aebed400be0040b3dcd47bb9007cb959d554af00e6bd38d557ae0070c20ed518ab00db",
    "c425d5d4a6007ecc21d613950017d25ad6ad8e00b6d6d0d78d7500e1d515dab2760072d007db299100b8cbeade919500a5c83be273970073b666f26c",
    "8f006cb0bcf5059100e3abd4f6fc920002aeacf30d96007eb0c8ed19b600e4b46de9c4b4004cb9a2e374b3008fbe01debeaf00edc482d986a500d7ca",
    "9cd6f497003dcf3dd4798c0004d369d2e48b00e6cfc7d4f68d00d8cadbd6e89700cec5d3d8d6a20050bf14dc39af00a2b297e4e9b600a8a8eceb31b2",
    "00319fa4f046b3009b980af338b6009e9406f724a0008193a2f388b800d097b6f1e6b9005a9e8def0cb8001aa218effbb20077a81eec45b80049ab59",
    "ea2aba0068b044e771b800d3b433e469b60046b958e104b4000cbdf5dfecb0004db623e4b9b500f0ae3de80db90018a8eaecfeac0066a403efbaae00",
    "14a311f1dba9007fa1f5f053ae00879d5dec55bc009e9c1ae6b6c400919ccbe1fcc600769fc6de5bc50016a3e0dcb8c300b0a653dceac20017ab07dc",
    "f0bf008faf1adbc5bb0047b377d9d4b800a3b52bd948b400b8b837d82db00064bc38d76baf001ec060d5aead003fc3afd397a900b1c877d1a7960044",
    "cd7fcf9294003dcfb6ce868c0004d173cee687006ed3e0cc55850005d675cc807400e0d759cb5e6f00f0da32c94b6f0033dce2c72f73002ae0a6c606",
    "710036e07bc55e700078e0b4c2c16c00b5deffc20270001cdbc2c3c96c0085d69fc31284001ad8b6c5f76b00d7d59ec4f18200a7d109c6bb890037cf",
    "6ec7ec8c00ebcbfbc728920073c993c85b9600c5c734c9e699002ec5a3c9c5a00036c139ca7ca60027befdca11a90015bbcfcb3cac00e6b759cc56b2",
    "0099b5fccc3ab50097b2a0cd05b800d3ae76ce19bc001dab29cf48bf0029a863cfb2c10079a427d02fc500cda01ad0dfc800c19bedd04dcb004f95f6",
    "d0a2cd004c90a5d1bed000bb8cc7d1fad2002e89d5d1efd400a485edd156d60069813fd223d7002d7dcfd2fcd600a279a2d262d3001b76c1d113d400",
    "a279f8cea0d200e07da7cf97d300b480afcffbd500f0848dcfe2d50079886cceb4d400bc8c6fcdb5d200ba91cdcbcbcf004f95e8ca9acd00e998a2ca",
    "3acb00869c8fc9cdc80021a006ca56c700c6a3becab1c400b7a641ca1bc20058ad75c932bd0051b081c8ccba004fb3e7c70ab800e3b3cec696bb005f",
    "b77bc445be005cbab6c3f0bb0074be58c3deb1006fc19bc16db0008ec43dc164ac00b5c7e0c037a80018caa8c0eea40023cec6c0b39e009ed0cbc064",
    "9a003bd3e9c03b9400b6d530bf689000a7d752bfa8890066d95dbefc850068da58be32820060dc83bd967b0014deefbd1e6e009bdfa8b8ce7800afdd",
    "f6b87a7e00b1dbf3b96285006dd685bcda9000b8d4a2bd3494002ad2eebd4e9900b5cf02bf259d004acd18c08aa000e4ca76c0d9a30028c668c1d9a9",
    "0007c373c2b7ad00f8bfd3c2a2b00094bc1cc2a4ba0003b858c21cc000a6b09dc2c1c40051acc6c3e5c500e6a5d6c45cc500e4a0ddc576c500189bfe",
    "c5edc8007c9713c74fcb00519062c85dcf009d8aecc95dd200f284dfca9ad3006a8150cbafd100df7db5cb95d0003678f6cbb6d100d77195cbcad100",
    "d96ab4ca1ad70061675acae2d900e9635ac9f1db008f5cf8c861d000aa5749c87fd2002d54d7c7d9d300af507ec6f8d4007d4c33c6fcd5009347c1c5",
    "87d600564340c576d600513eecc4d8d4008edcdf79d18300e0dae076558600fdd98a705b880034d9b56ce4880073d82268e78800e3d63063df890056",
    "d5705eaf8a00f9d21659838c006cd144547e8d00c4d05b4f008c00e6d08a4bd589004dd3c848688700e3d69b47db8900f1d87446bb8c0082ddfe468e",
    "8b0033e2a246c67e003ae62e48797b0010eb384bda77001fefb14fba7400c8f0ef521d7300eaf063568371001ef1145c1b6f00e2f10b60186f00d0f1",
    "0664e46f0026f34667267200faf25d6b287400d2f2c86ef87500e5f17e73e1770027f1ed78b1770085f0697c27760049edb77c8778001aea057d5d7a",
    "000ce64a7bcb7d00fde135769a81007de0da7181810011e1226e92790076e1776829740088e125642e7300d0e0ee60147d00b9e08f5a4e7e0017df16",
    "57f67f0089ddf352a08000d5dfc851ae750040e21054cb730089e56c59ac7000b9e00e5b4e7e00bfe43c5afd7000daee465ac56e008ef5af5ccf7000",
    "3cfac45fb16f00b6fcd462b86d0088fd9c66266d00f7fa126916700043f9026dfd710043f97671fe710020f51973ac7500e4f1a975ee770084ef9c78",
    "15790086efed72f67800a4f0b16cc2740017f3b668d27200b8f4bc64a6710050f6825ee270000df726572a710058f6364f7f700037f47949a46e0060",
    "ebe341f97300f7e7b641a6780046e25a41c17d0064de8641af8900b2dab73ffc880081da1e3fcd8000b5d64a3f3681001420677cfb7e00431c437b6a",
    "7e0051188d7b3f7c002015d87b3d7a002011b07bb47700ec0d627acf75006c0c4a76047600020a1572887400f609216d007400a40ad1681573008b0a",
    "9764f57100b309025e0e7100bb097557617100bd0941537d7100ec0c804df872002510894b14750028140a499f77008a166846f17800bc19dc44047b",
    "00ef1c44444b7d0021201045a47f004f238f45eb81007326f145d48300dd2b57461a8600f42b4a4a778700762aee4ea88700e828b152cf860088262b",
    "570385002024f25bda82006b2203620280001420d9646e7400ed1c86690373005d1c5b6eaa7500ae1cc170e379004e1cfc73f67e00921b0078477f00",
    "511bb27df27b008a1b9779e37e00e718a771107a007a17676c8d7100e214ab65bb6d0011141662146d000f14de5dfe6c002a14d4584a6e0054145555",
    "5770008e174052877200751bd751c07300861e80540b7400221f5c56607c003b1fe95bb77d00241fa5607c7c00791e07624e7300831ecb67d973009d",
    "1edd6b407500011f1270927a006c1fb9714e80008d1fd9751a8200721f257a9a80001b217877c28200f321ba73028400cf21f26f0a82002a21246efe",
    "7800f320f669fd7500ac2101657575004e224d636a7e004523e4606781001e24835dc3820089260e5b0f8500b425c35fe583001a20c1a3c47401cb21",
    "66a02377019422339c9377017d23b698b779016b232794b678015a246c913b7b013c242b8c8d79011e25d188517b01f226b885f97f01ce284f844085",
    "01e228f587708601f628548ca887010429b4907a880109298994c3880108295398b288010429a99c7588011f28929f548601c72aaa9f798c01892c02",
    "a0999001412eeca13c9401f32f88a3aa970181327fa4319d012b340ca667a001cc353da80da3016837c2aa86a501d1396aad68a901383c7aaf55ad01",
    "953eeeb1bfb001e94055b4bfb3013d43deb4f7b6014d46dbb4b1ba015b4990b390be015e4c00b3dcc101554f90b35bc4010453ecb259c701a9561db3",
    "82c901fe5a98b37fcb01505fccb354cd01e46267b47bce017666a3b488cf012a62eeb5afcd01915ef1b6eccb01f55a27b747ca01a0563eb679c801bd",
    "53c1b392c7015b4fe4b1efc4016c4c22af24c301e34af5b1c6c001de4d50b280c301d3502ab205c601c45322b15ac80122583cb008cb017e5496b1af",
    "c801d550c7b123c601514facb4efc301fe5220b599c601ab565fb2b8c9014c5aa6b002cc019f5e86b001ce01356290b065cf013467b0b0f6d001786b",
    "d4b019d201ba6f5bb1e1d20165759ab1add3010d7bc5b12ad4018883f2b155d401c587b8b13ed401b98c38b1f6d301e68943b451d301f384f3b5f6d2",
    "01b480d8b6a9d201767cc0b72dd20135786db899d101f473edb8e3d001b26fb8b845d001236c22b960cf01dc67c2b86bce014964dbb84acd01445f84",
    "b899cb01bc656bb6aece01bc6abfb545d001217112b5dfd101c17b1cb518d301698132b543d3015d8663b51ed301518bdfb5abd201938f5eb6f5d101",
    "d693b0b60ed10187993ab6d7cf01869e14b586ce011da2e8b40ecd01b7a53ab480cb01cfa20ab29bcd01589c01b0c8d001a3966dafa0d2016192e0ae",
    "afd301b78c1faf89d401c4874aafefd4011e8290af11d501c37bc2afd4d4018577ddaf73d4014673fbafe7d301066f1ab021d30134675eb00dd101a2",
    "6382b0e7cf01575faab044ce014c5a09b1e7cb0139556db12ac9011850dab18bc501224d6eb11dc301264a1eb14ec00163463ab083bc019442a2ae46",
    "b8014440e3ac58b501ee3d9daa3bb201c23a4ba843ad0156388ea618a901ec35b0a334a50160349d9ee7a3019d33319a73a301f13101960ca0011e31",
    "ea91a59e01bb33689363a50131367697f1a901a138969a4aae01073bca9c3db201613dce9e93b501ae3fbba122b801ff4199a21abb010b45a1a38ebe",
    "010e4864a4acc101c64b09a6e2c401bc4e1aa65fc701ac51cca594c901c14e99a3e3c701ce4b95a299c501d748f89f3fc3019c46489d66c101974340",
    "9c51be018b40ab9be0ba01383e429bccb7011b3b1098b8b301b7387795ddaf0114377794a7ac0176353391f7a901d333058ef9a6012032d48a14a301",
    "6430a886c99e01872fb282bc9c01922fd17e7c9d01ab2ea97bd69a01b22eb077429b01b22e27723f9b01ac2efa6de59a01a02ed769269a018b2f9d67",
    "009d016d309d64619f01493152615da1010733075fe7a501d833695b4ba70183354c58d3aa012437a853bead01bf385c506bb0014f3a9f4c61b201d8",
    "3bf948f2b3011d3bae4cd4b301c7387b52f4b0012b37115642ae015e36b559f8ac01b434db5b81a901eb33296191a8013d32b265f0a4017f30b76983",
    "a0019c2fc56c169e01a12ffd70679e01b22efd72489b01b82df973899701b42c9e76379301b42c547a469301a62b777c638e019e2a397e118a01ac29",
    "4a80048701a9293f7cd986019a2a257ad489019f2b8679028e01b42c03773a9301b92dae759a9701b32e4574519b018930eb6f28a1014832e96dada5",
    "01cc345b6c0dab016b36dd69e7ad013b37366650af010938cd62b2b001a3393e5f5fb301383b375cc6b501c73c0d59e8b701dd3f7153b8bb0165417c",
    "5086bd0122424d4beebd019e408b4e5bbc01513ef1519fb9018d3d9c55d7b801003c8958dcb6016e3ab35ca0b4016c3a43617db401a039e56423b301",
    "07382d6888b0013837836b1faf0136377a6ffcae019c350a7472ac019a354c7863ac019a35907c54ac016936e97fb5ad01383742831baf0137372087",
    "11af013237318bb1ae01f937568f9aaf01613acf91b4b301f13beb94bfb5017b3d129877b701f33b3494e2b501623a8791c0b301ce38518d79b10104",
    "38cc895cb0010638d5847bb001373704810eaf013537c47cf2ae013537d978e9ae01ff37087406b00100381e7016b0019739576b8bb201673a8f6618",
    "b401353be26189b501c53c2f5fbdb701533ebd5ad3b901de3fd057bdbb0167414954a3bd015e34614ab8a3010736cd4716a701c436f6432ba7017737",
    "383f91a6010739523b4fa801b939a237afa701393bd5335da801603e1d30b3ac01bb406b2d21b00120439b2c8db40173458a2bd1b7018b48f52a79bc",
    "01554ca9290fc101554fff285fc4014a526327e4c601b456b425d7ca01e855ad2144c801e952d22066c401a550342043c101524e8c1ee1bc012d4c27",
    "232ebd013249ad26e3ba01eb46f6285fb801a744182b38b601fc429829a2b101a0401e2b06ae01d8420d27b3ae016b4b8f235abc016251871fb8c101",
    "cd55c91c27c501bb58a91a59c701a05bdd17a7c80169619113f9cb017666e31069cf01c06a150e55d1014a6ecd0b43d101d5715d0a3cd1016475d60a",
    "4ad301587a830a4ad4011e82030a60d4011287040a73d301098c0c0ad8d101998ff509e3cf013193da09d1cc017c97aa0b45cb010096bc0cb5ce0127",
    "8e2a0b56d201c787f20930d3016a81cc07a1d101c07bd80723d1013378d7071dd001a474c4076ace019d6f870706ca01526bee0803c901ca64a40ac3",
    "c3010861c50a94bc01c95e450b46b901ae5b770b97b1011158230e24b20147542b108bad01f7523d1298b101a451e01432b5011551f417a7b9018150",
    "d01b7bbd01f45464195ec1015259691554c301265f9b1112c701b065a90e51cc01e167220f7acf019372190d9bd4010d7b610a4bd4014b7ffc0847d3",
    "015f8b150718cd01e0916b064cc5014aa7240d7aaf011ba77b0e62b501ffa6b20fe8b80169a55010bdbd011fa3e9105dc2011fa07811a3c701e59ddd",
    "1107cb01f99a46129cce01a0967b1360d301a191dd13a6d601ab8cd514bfd8010787dc1582da015957871fcfc801c05b9f1f11cd011360e51d66cf01",
    "d3652d1cf0d201aa6d801ad6d601ad79411a1ddb017088481a56da017f8f2c1aeed701c193361a25d6015097831b73d4019a9bff1c2ad201349f151d",
    "b1cf01d0a2e11d6ccd01ea9fcd1ea3cf01999bcd1d4ed2015097131c81d4010b93b91b73d601ca8e421b1bd80153864c1a0edb01b3802d1900dc017c",
    "7ca518b1db01db76b5183dda01ea71c11891d801886b0218c2d5013e6710181dd301ed621118d3cf01515f8c196fcd01b35ba91b4fcb010a58ff1c1f",
    "c8011d55381ff7c501f552ff22a4c5014852f726b4c601db50612ac4c6010653dc2672c701b156bc2474ca019b59ef2299cc01395d0522bdce01b163",
    "b52048d201fa67002083d4013f6cf21f3ed601ca6fdb1f76d7015373c31fa0d801db76ac1fd1d901e47d6e1f6ddb013784b81f11db017088731ff6d9",
    "01ac8cf81e8ad801f03ecd44b3b701dd3e20414ab6015440963ba3b601a142d63840b901bc45363805be01c048393633c101fe4a0a343fc301bb4e7f",
    "3247c701f050cc2ff4c801bb4e683242c701464d713682c601554a3e3c8ec4019f490e40a5c401e648db4395c401ee4897472ec501f248ca4ba0c501",
    "684ad5445bc601de4b214016c701544d543cd1c701094e6338bec7017b4f2c3337c8012e50692ec3c701148e6f26f2d8019d91fd26add70129950f28",
    "6ed601b7984d2901d501009d8729f0d20192a0b22aabd10127a4c82a3fd001c5a76b2bf8cd01acaa422d28cc010faf6b30ffc80106b2d63131c60112",
    "b2252ef7c401a2b0ba2a1ac50103ad61257bc6011baa8c21ddc7012fa7461ffbc90125aa891fadc6019caef71fd8c10161b26a2042bd0173b5e220c6",
    "b801beb75f22ceb50101ba4625e3b30100bd9d29ebb101f5bf2c30d7b0016bc15d35bbb001c0bf9c37f1b40168bdad3678b80113bbbe3505bc019fb9",
    "143139bc0175b7e42a53bc0136b5a9285ebe013cb22526dfc00168b4742a6fc00199b6282f90bf01d0b8213334be010cbb183798bc0113ac4634a8cc",
    "0107afd233c9c901fcb1893529c701b5b5c3378dc301f0b71a3ab1c101fdba5a3adebd013ebd373edebb018bbf65401cb90167c02a3d55b601edbe06",
    "39f5b601b0bc82336ab80141bbe52d2bb8011cb94428afb701e4b62c24d6b801b7b4c71f01b9010eb1611b4dba0124ae151818bb0127abc61620be01",
    "3ea83a143dbf01d0bec03d41b90122c1e03f38b6019ec2674489b50122c4264846b40112c4b84b76b501b2c5964a3cb201c8c59b46a2b001eac5dd41",
    "3cae0103c67a3e80ac0175c48e3b43ae018bc3b43fc8b1016cc332440bb40154c3a748d2b50145c35a4ce9b601cdc4db5058b5018fc5e054bcb40155",
    "c6e558e7b301bec87d5bc2af018bc92e5f73ae0130cb4d6146ab0138cb5c5dbbaa0147cb7058b4a90159cb90548ea80191ca6a505ca901f6c8194ce5",
    "ab010ec8c24f0baf01fdc7b7532cb001f1c75e58feb001bdc8405cd3af018ac9766085ae0159cac8631ead012acbd267acab01fccb566b21aa01aacd",
    "d66e86a60166cfe36f21a20149d09072c09f0131d13175059d0132d11179fb9c0139d1c87c879c0148d1e6809d9b013dd2a7821e980132d3ce84c894",
    "010dd52686188f01e1d67886088a01b4d8c9862a850185da35878c80015bdcbb87de7b0140de108889760148e0e888646f016ae1ce8a596a0126e00d",
    "8b3f71010fdf028dd8750103de7490e17901f0dd1195e57a01e8ddbd98607b01ccde759c797901a9df79a00a780175e060a48377014ee0e7a79e7901",
    "27e084abb77b014fe0cfa79079017ee098a31277019ee0a59f507501b4e0949b1d7401c6e0b29729730171df54b7187b0177dc3fb81d8501bcdac7b9",
    "678801fed88ebaf58b0144d73bbb758f0185d5fcbb439301cad337bc10970110d2debaeb9a015ed0f7b8729e01b2ce0cb8a2a1013bcc01b8fca50103",
    "c9d7b802ab01d5c5adb9c3af01bcc2cdb95ab301abbf52ba92b601a8bcd3b90fb901f7b881b9d5ba0141b5f8b855bd013bb20cb8f0c0013daff7b62d",
    "c4014bacd0b68ac6015da927b6c2c80101a56db57acb0166a17eb52ccd01179d0ab515cf01859952b525d0013e9554b487d101fc906eb45ad2013c95",
    "96b213d2018199f6b2e1d001129d71b2e5cf01a9a059b332ce01b5a597b3b4cb0155a94db3b7c901b7adc1b3a7c60168b1afb3b6c30163b49db3e1c0",
    "0161b789b323be0114bb70b3f4bb0113be6ab394b90124c1d6b329b601a2c6eab36bae01d9c980b32aa9011dcd62b274a3019ecf38b19b9e011bd2f2",
    "b0489a0198d47eb12096011ad725b2dd910167db61b198890105df51b0f58001fae0ffafcc7a010ae2ceacab760119e0cfac807c0163ddb3acae8201",
    "e3d9a7acd789016bd612aef1900168d1f6ad9a99011dceddad169f01a7cbcfad5da30137c9dbad81a7017dcc32ada4a101f9cebaac1a9d017dd1a1ab",
    "4898013ad307a94c9401f3d40ba7a79001b4d6f1a2a68c0195d7829fb18a0175d8b79bcb880174d84aa0d4880190d748a3fb8a01cfd537a6db8e0110",
    "d43aa9db920145d339a49b93013ed3619f0e940133d38a9ab3940150d29a96f3960170d14e9315990198d0f996c79a01a0d0b79a449a01fdce1f9fd4",
    "9c015dcdcaa2459f01bccbfaa7f7a10115ca3daa23a501a0c7b8abb1a901fdc53dadd7ac0191c3b4ae52b10169c06daf35b60152bde3b036ba0152ba",
    "b0b1adbc019cb67cb240bf0192b962b06fbd0156bd29ade2b90133c1f5a9efb4018fc34ea774b101f0c5a5a4d4ad015cc8b4a2a1a901d5caaea1cca4",
    "0179ccc69fe9a101dbcac0a276a40167c8e2a4eaa801cbc610a781ab0161c476a8b1af01fec1f5a99eb301a5bf75ab1ab70193bcf0acc0ba018ab9b8",
    "ad05be01c9b57baec1c101abadd7afffc70106aad9af46ca01ada5f1afb9cc01884cd3a4cec5017d4fd1a36ac8016c5201a39dca01115630a20acd01",
    "b05962a12dcf01465dfea1bcd001da60e2a203d2016a6403a413d301fa67d0a27dd401f26c8aa2e5d5017c70e9a1ced601b974f6a0a0d70140788a9e",
    "43d801127b9e9b9ed8015c7a13a476d701967eb8a482d7011d8294a634d701a48573a8b9d6012c899fa93ed6011e8eeca992d501df8975a871d6010c",
    "8707a62cd701ee84d2a2d4d701d082339f54d8010080ae9b92d8013984dc9d7ed801dc89259e49d801638da39fb1d701a1913da1b2d6012e9502a450",
    "d501bc9800a6eed301989bfda7a7d201759e45aa2fd1010aa27caaaecf015ba6ffa9b8cd01b1aa22a989cb0152aebea7a2c901fbb13aa646c7012ab7",
    "c2a4f7c201fabdf3a18ebb014fc0d9a145b80175c3e2a06cb301dcc56aa042af0147c8a79e14ab01bb986ea43ed4014a9c0aa429d301dc9f5da4bad1",
    "0170a318a373d00108a794a2eace01a4aa35a212cd0146ae7aa1ddca016bb3d4a0fdc60122b78aa0aec30125ba63a080c0012dbdd19e36bd017cbf77",
    "9e44ba01cec1c89c41b70127c4009bf3b301b1c539974eb2013bc70192bcb001ffc7018e08b001c6c8308929af0190c9ef8218ae015dca4c7ed9ac01",
    "5aca477a12ad0159ca43762ead0126bdb19bcabd016abf2598acbb01edc000954cba0172c2c091cab80132c3728d48b80130c322886db80136c30e84",
    "f7b70144c35c7ff5b60115c46b783bb50116c4ce732eb50111c41a6f80b5010ac4e26a0fb60103c4186788b60172c2a263d4b8016bc23c5f53b901e0",
    "c0995b4dbb01a8c6c89ff5ad0106c94d9acbaa0199cac694daa80157cb948eaea80121cc5d8ab1a70111cc6985c3a80106cc908074a901ffcbe67bf5",
    "a90129cbee77bbab018bc96a7579ae01bfc8e370adaf012ec05066c5ba01a3be1863d8bc01dabd895f27be0151bc1b5b2cc001ccba1a58f6c10108ba",
    "2f54fbc20187b8ab5098c40109b7f74cf8c5018db5c84939c70197b20346ccc901a7aff14215cc01bcacdf3f1ace0160a8783b16d10178a525399ad3",
    "01d8b1224eb0ca01e8ae9e4d0acd01fcabc74c35cf015da8c74c8dd101c2a4974ca8d3012da1da4c78d5018d9b9c5b85d4011a9f9859c2d301aba2ef",
    "57a3d20142a60458dbd00197aa395880ce01f5ae5258b5cb01e5b1825965c901d9b49b5af9c601d3b7b45b4fc40115ba385ee2c1018c3d615ebeb801",
    "dc3f025ba6bb0166413c5797bd0171448b550ec101734706561cc4012c4bcf5592c701dc4ea1558cca01cc519153fccc017055785372cf010d594553",
    "98d101a45c1f5453d3013c60b3518dd501ad61c54dcbd601d05e9a4f37d5013c5b914e8ad3015c582f4c13d2017755b04940d0018c52a84609ce0157",
    "50b643f5cb01d84e654020ca01544d7d3cdbc701994ffa4234cb011551a646d0cc014853c94aa1ce013056214cacd0011459f74d5ed201aa5c624f30",
    "d401f760914ca4d601ad5c584c93d40115593d4b96d201eb567f464cd101bc545843a2cf018552833e3bcd0105519d3a1ccb01fe50fa3667ca01d763",
    "fe47e5d8016867cf471ddb01426a2447a0dd01cea95744c5d001e9a63847aed20150a30f48c7d401059fce4801d701759baa49aad801415ba34431d4",
    "015d58684243d2012e56ab3f7cd001b554a63cdace01ae541b3803ce01a8544b3467cd01e453c32fd7cb01d3539f2aefc901fe559827d6ca01eb58e4",
    "2654cd01f458cc2a80ce01ce56652ef3cd01e3532e2faecb01b351743243ca01c34e1d360fc8018e4cd0396ec601d247ca1bf3ab01fc477a1dc4af01",
    "bc45842040ae0170428d2144a601104499209aa901d148c11d21b201904c811a04b50143504a17f7b60192520017ebba01db54c7166ebe01df57b816",
    "d1c201da5ab6169dc601909d7944eed8016aa0964197d701d6a1a33d31d701dba1aa3987d601e5a1f635fbd401f1a1813152d301005ed72a49d10191",
    "61dc2838d2012465dc27d9d301b36819263bd501aa6d2923dad601e97163223cd801db765322d6d901147bf021e3da014c7f382360db018383752445",
    "db010687952651db018d8aac24c7d901158eb72482d8018e8a8c238ad9010887fe2161da01cf82682127db01987ea7214fdb01607a2a22bfda017175",
    "d3215ad901e9714b223ad8015f6ee12105d7011e6a222283d5011cadfcbbafc30114b004bc04c10110b3f5bc16be01c5b6c1bb88bb0178ba47bb8cb9",
    "0127be05ba05b80130c163b932b5019dc61ab9cdae0103c9e3b8feaa016fcbdfb81ba70113454d834cbf0020484d8249c300c749df8145c800ec4baa",
    "855cc800434e7e8a61cd0033518a8befcf005050868950cb00ac4c6a883ac900684a978750c600ab4c69883ac9004950f6888fca007050018b80ce00",
    "fb513b8ce0d1008b534b8ff8d500255778902ed800b55a9e8f89d900415eaf8e7fda00d0617e8f49dc000b66be8e3bdd0092698f8f3dde00126d3b8e",
    "f9dd008c709d8dc2db009f72668c84d8002276118b06d800a8793f88f7d70056734d8fc7d90041787b8eecd800c67b238d11d9004b7fb48b4fd90085",
    "83e18aecd80074880e8ad6d700977ec08461d80000806181d7d700d282117f19d7005a86c97e49d500d282a07dfbd600967e767e6bd7000f7be77de8",
    "d5008477cf7ddbd3001b763d81ecd3008a72ba8219d100557011838aca00d86ee582fdc500406bed83acc4003f661284ddc4004161358480c500fa5c",
    "d4830cc600b558e38299c6002655c3810ec70099519b7f83c7000c4e667df8c7004d44d58117be0053471c825fc100fb48328259c600ee4b45838fc8",
    "007e4f208676c800bb53698657c70078406f7d5db90073438a7c60bb00f5440278b6bc00e1456c7724c10086471c75d7c5000c49d971ddc700774724",
    "726ec4008246e37235bf00e7442a7593bb00ab4283791fba00e9441e76c1bb00ad451470b5bc000d485a6e8bc100fb48e36e69c600e84b796c0cc800",
    "2d50186cb2c7007054d66926c700b558d26899c600fa5cae670ec6008b606866a6c5009a515467abc700dd55456702c700d85a226662c600695e2f65",
    "1ec600b562726484c600a565c86354ca00df675363ffce00c36afa620ed2000b70c762bcea007a71b262e9ee003a74a96540ed000874b46639d9006e",
    "756c6ac3d700d5760f6eccd6003c78fb71bed500117b25757dd7004b7fb477d2d800b380d97335db0067818370d7dd00cc82316d61e0007d832d6ae3",
    "e300c182ef67e5f3000e822b661ef8000080ff6396fb00357be06281fb00c577976215f9004b74be620bf4002f72e962fcef00d470585f1cf200db70",
    "855b58f40043724e58e1f6000b75865779fa00cc777b5713fd00397b775573fe00a27ed05395fe005d811f57afff00b982bf5ab8ff001784585ea3fe",
    "00c9842d6212fc007c859264c7f80031866066c2f400ed88466349f70097894860f9f9009389b25cdffb00438a835880fb00098d73570bf800238fa7",
    "58c9f4008e90da5a79f1004b91d75d28ee0061918d6134e8003e8f33634aec007e8cde651aea00f78b036618d900138b146690ed00a7899465e3f100",
    "387bdd53c3fd00d679ba5082fa00d079004e7ef6001b793e4c57f2006178c34a8cec005978b049d0e700a4779c4578e600bb798e42bbe5009b7eef41",
    "54e50064817b44f0e5007a83be4774e7007683aa4991ec002b840b49cee800df84dc444ee600a9872242b6e500748a7e3f13e5008e8c1a3c1ce40060",
    "8f9739d8e100408db23c14e4001089003da7e40094854c3b72e400b280f83a17e500837c343a86e40053787039e8e3002374713acde300a170ce3950",
    "e2001e6d2f3af7e000446a793912de006a67473978db00e96a6437abda00c26d4d3711dd0098707f3783df001b7413358de000ec760338d9e200d07b",
    "8838e6e30000802339d2e4002e84723a84e4005e886a3a0de400de8b643908e3005e8f763a80e2005a8f0d3eb5e300288b663c6ce400608885380fe3",
    "00e3845d360ce30065817134dee300e77d293201e400c08b684d44ef008c8c8d4bc9e400bf87f58b7cd800a88cdd8c37da0022904b8d43dd005694ef",
    "8da3dd008c98ac8e4bdd00109c3290f5dc00999fac90ebdb0027a347906ada00baa6618f80d80051aaaa8e87d600adae448d27d30099b1388cdbd000",
    "27b37b8a7ecd000bb499881ec900d4b40d8576c7009cb5c980dbc50062b6457d77c400feb4ca7988c3001eb2a476d0c300f5af677316c400a5ab8b70",
    "a5c4000da8e06d1bc50076a40d6c91c50029a01b6c1ec600dc9b656cacc6009097c86c39c7008d92126de3c700f98eab6c0fc900c48c466b5fcf0006",
    "8c6f6afcd200fc8be36702d700d98e14678ad3005490006844ce0086923d68c3c900d8960a6958c7006d9a0e6adbc600029e316d65c60007a35370c0",
    "c5009da692724ac50015ad087376c4001eb22b73d0c3006db61a7489c30022b71978b7c30013b7fc7c06c50004b79a8057c6001eb78f8315c400dab4",
    "4686e7c600eab405815ac50019b7b67b84c400d7b79f77efc30022b7dc73aac30046b4dc6faac300adb0246d07c40015ad506b76c400c5a8566c03c5",
    "00bfa3a66ea8c500719f407036c6006d9a8e72dbc6002196f47468c70045934077c6c7006990a47925c800fb8e637d59c8001f910a8120c800b39422",
    "84a1c700d5966987fcc700669a318914c800b69e6389e9c600bea37987b0c50073386da216ab01d63a3fa5b6ae01623c34a869b001b93eb9aa8cb301",
    "1241b3ab01b701604337add0b9016846f3aef8bc016749c8b0a2bf01634cb6b154c20113507db3ffc401065342b28ec701ad565eb1fcc9014c5ad2b0",
    "f6cb01e65d0ab191cd013262d2b10bcf01c36518b3d5cf01a068beb05cd101e66c9eafd0d201287175ae02d4016775dfadc9d401a579bbac81d501e2",
    "7db1ab05d6011d8214ab3ad601b856ebab4bcb010f5b6bababcd01a85ef0aa5ecf013e6294a905d101d1654da95ad2015e691baa47d3010c6fc7a9c2",
    "d401ff7342aa80d5015a7ac0aa0cd601b480feab02d6015986cbaca9d5019d68cab2b9d001976d36b3d0d101237137b42dd201af7410b31bd301ed78",
    "60b377d3012b7d36b47bd3011f827db482d3015d8641b47fd3019c8a1db5fbd201b19107b459d201aa9607b44bd101f09a07b422d001f39ff6b34fce",
    "01fba473b320cc019ba864b31fca01f9acfdb272c701a6b0c4b2c0c4019eb38bb226c2019eb6dbb213bf0198b90ab3e7bc0152bd3eb33fba0124c181",
    "b322b60177c3b8b331b301d28235ae6dd501c487cbad54d501018c16aee2d401aa9117ad40d4010d98a2ace0d201529c8eabbdd1010ba21fab90cf01",
    "a3a592aaf6cd0140a937aa1bcc019ead0eab54c90148b1b9aadcc6013fb42fab4fc401c1b889ab97bf010bbb1cacaebc0140c4a0b815b20199c600b8",
    "08af01cec91eb7eaa90139cc51b61ea601bbce01b30fa10115d25eb1939a01cad393b01b97018cd5d4aee692014fd710adcc8e0142d884aac98b0119",
    "da14a7c986010edbe8a3c88301fedb81a11c8101cfdd37a1c57c01c4ded59ef2790197dfefa206790172dfa9a6077b0196dd4da8e97f018ddcbdabe7",
    "83018bdb2eae8a87018ddcbdabe8830185ddeaa9d48001b0dd60a5727e01ccdda5a1e77c01f5dc1a9d227e01fbdc6698bf7d0102dda2945c7d011edc",
    "9491487f014bdb298d48800119dd708f217c01ebdec792d37701d3df3396c07501bde0a399a77301a5e1149db371017ce229a19e700184e3c0a0046d",
    "01bfe3989ce66901ade2db9b026e01c1e15a98267001d6df7595957501ebdea292ca770108de788f93790136dc638df67d0160dbf489237f0198d9d9",
    "871d8301d1d77685378701f3d58087c08c0120d4dd87d89101ffd4bb8ce78f01d9d507904a8e01b2d6df93c98c01afd69498f88c01b3d68e9cb98c01",
    "f9d4a19e5090013ed36b9f0c94018bd168a0669701e0cf21a2659a0165cdfba5c39e01bbcb6aa608a20140c9c0a6d2a601cbc617a77fab015cc40ca7",
    "0fb0012bc15aa791b501d3be93a708b90101be19a40abb014fc0ffa13cb801a0c2ef9e5eb501f9c41b9c28b20189c6f3982db001fcc8bf978cab01a2",
    "cafd963aa8015bcc9899daa30145cd6d9dd8a00109ceed975ba001b8cf8d94fe9c018dd0c68f6a9b0187d0cb8bda9b019acf0e89e49e01a3ce7284a2",
    "a201b9cd368188a501d8cc2f7ef6a701b5cf7093239d01adcf758faf9d01bfce5d8bc3a001d6cd1f89a9a301c7cd5c85a9a40109ccb18152a9012fcb",
    "567e52ab012bcb827a9eab0128cb5575ccab01fccb297925aa01d5cc527c2ea801b6cdae7fc5a5017bcf0c82d8a00156d18884b39a0121d4f586d391",
    "0141d29283ee970144d1e07fdc9b0153d0237e149f0168cfcf7a0ba20164cf0c774ea201a8cdf473aba601cfccb5708ba801d2ccac6c64a801fecbc9",
    "680caa012ccb426489ab015ccaa660efac0190c9c25b27ae01c5c8705743af01e7c8fd4ef0ac015ac7754992ae01d1c5524509b0011cc57b41a6af01",
    "66c4a43d4caf017fc41a3a7cad01e3c3b63447ab010dc475313ba80133c4ed2e6aa5019dc2792cafa70138c0002aa8ab01f6bdfc2610ad01bbbb0823",
    "fbad0177b9de1fc8af0179bbe72772b301c4bd8d2a0fb10137bf562e21b101aec0e632e4b0015bc18937ebb101fec1bb3dacb301afc29d413fb4012a",
    "c4e046c3b301e0c45c4bfab3010bd54a87348f0133d37485b6940141d28b83ef970149d172817b9b0158d08f7fca9e016acf537ce0a101accd5e7a66",
    "a601fbcbfc7733aa0159ca0b762ead01f5c71173c3b00163c6b56fdcb201d2c41f6c04b5012ad31f8140950131d2147fe898013cd1d17d539c0169cf",
    "837bf9a101aacd07797fa601facb5d7640aa0158ca857434ad01bfc82772abaf018fc22f72aeb60143c00a6e29b901f3bd4f6928bc01e3bd856379bd",
    "0118bd445fecbe0150bc665a3fc0014cbcb0549dc0018abbf35071c1018ebb534c22c101d1ba9e4883c10117bab844abc10162b919407cc101fbb764",
    "37d1c0019eb4502263bb010eb33c1661ac0197b2be45c6c901a2b2853fcac801adb2103bb5c701b9b2973699c60108b2423106c6019bb0462ce1c501",
    "3caff72550c401d9ad912024c301f4adc51c41c0018fac6b1913bf0154abc11303b901d3b2f92dfdc301a2b0d02a26c501bead0926fac50165a90920",
    "dac70182a6fe1bd6c801e3a2be18dbca014c9fcf14e2cb016c9c80123ccd01ab968a0f18d101258eb80bf8d201f784a70617cf016c81160577cc0149",
    "7f42033ac701e2becd3adab70199bcab374bba0150ba1335e3bc0154b7123156bf0154b4872e4cc20133afdd273dc50109adc523bdc501e3aaa71fe4",
    "c501c0a8801b9dc501d6a5ee1875c7017aa1d9154eca01fe9dd20e09c7014f9b3d090dbf018f99cc0f34ce013a95930f6cd201f590710e46d4014a8b",
    "000e05d6013c84400b58d501967ef4095ad401a379120aa2d3016275240a77d201d371150ad5d001146ccd09dfcb01e4699b09d8c801ef6632098ac3",
    "01a464ac08fdbc019961d20804b601cd5e680bd4b901835ccd0b5cb501a259170ef7b501d2556e0f27b001c75cb40ee0be01bc622d0e9cc701d76765",
    "0d61cd01736b1b0dd5d001b96f0b0c60d2014873b40c7bd4013b78d60b1dd501016fa30b7ad1012761590c73c1011e3aef2f75a101553aed3270a501",
    "7f3a133678a801ab3a2f3a95ab01c73aec3d9dad011a39633db8a9016f3bba3843ac01c53dd53522af01ae417e31b1b401c444b42ea4b8010947882c",
    "fbba01124a732a7abe010f4d552846c1010550d125a1c30124559020cec601fb5a7d1c0fcb0107604d187acd015864881501d001a2682211d4d101bf",
    "6ae90d25d101e867b710d5d0012a62f514b1cd01495f751759cc01685cf61905cb01cb58ab1d6cc901ae53f121e8c501b9507c2351c301f84c5824ff",
    "be01f149a62575bb019e476f26d4b7010446f42569b40151440c241baf011d42b128a9ae010843892aa7b20151451f28ecb401f748832086b501e54b",
    "641c57b601054ed51832b501b2519515b8b601bd549f140cbb01d056371153b801a056600f8db201755f550a38b701995fbf0bcebc01b05ff80c55c0",
    "01195c121047c0013059471210bf0145569114b1bd0121548a173fbe0100523d1b0cbf01a34de520bdbd01f249cb258ebb01ee463b2995b801b04410",
    "2cf9b601bd4b5233f8c301b44ed22f92c601e650de2cf5c701d153202ab4c901fc55f72696ca01e558d324a5cc01ca5b2d2341ce01605f6021c3cf01",
    "f8628f20cfd1018d66ee1fd1d3011d6a841e60d501aa6d0a1cced6013471f91c0dd801bd74911c4fd901157b8a1b69db014c7fdc1bf6db013684301c",
    "7bdb0170885d1c31da01f78b521de1d8013590441e66d7017694191eddd50105984d1e53d401519c3f1eebd101ea9f631e89cf018aa3f21de6cc012e",
    "a7741f14ca0121aa672038c7018cabe12366c7019c3be93e96af01e83a3643ffaf01ff3a0347b5b101173b524b60b3018a39c74e92b1019839d2529a",
    "b201d138b256adb1013437925ad3ae016636125e83ad016b363d62d6ad019c3547667dac01cc349c6a09ab01f933a96e7da9012333a072b9a7012133",
    "ce76a2a7011f33cb7a7ea70164319f7d18a3017a30468033a001892f0582e19c01922ead834a9901972d7185839501b02ba0870c8f01d7296d899e89",
    "010428318bb184012426898b467f014624868d127a013a22008e8872013721ff8f016f01691fe9982a6b017f20a198a46f0177225d96e975015525ff",
    "927c7e012e27cd907e83010029298f3e8801e1290a8c2c8a01a52cd88a559201812e17893f98012d325087f4a301ec33e585aca801bc346f89fba901",
    "6036228b1bad0128372a8fffad01ec378193acae01da37bc977aad017339999af1af01fe365c992eab015d35d39647a801ba338e9358a5010232bc91",
    "28a10140306590839c01792e7b8fb19701aa2c4c8f9f9201d42ac18f438d010529e590818801ef3a23a188b001523d09a26ab401a93ff1a2bdb701f6",
    "41dba46fba013f444ca6f9bc0142479da8d3bf013f4a9ba99cc201364dcbaa04c5012a50e7aa5dc701d053e7ab9dc90171574cac9acb014a5510a922",
    "cb016652a0a6e2c9017b4fe5a432c8018b4cfda22bc6019549e4a0d2c30199468e9e31c10159444a9c22bf011742419afdbc01033f199a31b9017e3d",
    "c296beb701bf3c289345b701c83cc88eedb701023cfe8a00b701ff3b3287c9b6012e3b058316b5015f3a2b7f81b3019239f97a2ab201c83867770fb1",
    "01c838f87212b101ca38276f35b1019739756b89b201663a7c67feb301323b23645cb501c33ce8609cb7018d3d0d5dcfb801183fef59c5ba01de3f48",
    "55c0bb016641c3508abd01ea42aa4d2ebf012b4516493fc101a6462d4547c201e248ee4135c4015a4a383e0cc5014d4d993933c7013f50693698c901",
    "494a123877c3010245ac3acbbd015a408a3c16b701f83d203df6b201483d7f41aab301054e31a35fc701b051aea300ca01535599a41fcc0135589da6",
    "53cd01cf5befa60bcf01645fd3a75ad001f8628da7bfd10189665fa705d301166a3aa8e7d3010f6faba5abd5019972f8a3b6d601227642a1b4d701f5",
    "78149e58d801c67baa9b9bd801977ea798b3d8016881329ba0d8018583da9e61d8010b8743a106d801468b68a1b3d701828f78a117d7010c9377a227",
    "d6014e9722a4b7d401df9ad8a54bd301739e21a895d10108a205a9f4cf01a1a55ba938ce01f6a97ea81acc0199ad3ca8ffc90140b148a7a3c70134b4",
    "eea653c5012fb798a697c20134ba8ea640bf0102be6aa4f5ba0152c0d7a203b801acc2b3a187b40102c50f9e82b10193c6199b81af012ac879980ead",
    "01ccc9da960eaa01bac9919253ab01a9c9a08e6aac0172ca9c8a73ab0168cac68626ac0162cae5828cac01c0c8b07f98af0161c6ee7d00b30111c4d8",
    "7b86b50161c6377e06b301c0c8148296af0194c92686e5ad019dc9698a49ad01a9c9648e7aac01bec97c930dab01fac87497a3ab015ec7d8994dae01",
    "a5c2404308b501b9be744211bb01a4bb47423bbf0164b98d3f5ac1015fb61e3fc4c4015fb3f13f24c80168b00b40fbca01ffab9941efce0115a90942",
    "2bd101bea4b74127d401dba1174172d601bea44f3f4cd401a6a7f83bc7d10120a9c537f5cf0125a9d23353cf0140a6fc3135d10164a39f2f1cd2018f",
    "a0772c19d201b79dc329a3d201269a842600d401e1958124a8d50155925823d8d601cb8eb621e2d701428bf82006d9019f85e61fc1da01b380161ead",
    "db017c7ca71d78db0171750b1e6fd9013471051efdd701aa6d051ec2d6011d6aff1d5bd5018d66841eacd301f862bd20d6d1011a60032380d0013e5d",
    "2d2594cf01605a572790ce013a58f02afacd015555652d68cc01e7535a3132cc01ed532c35d4cc01f45345398ccd01fb53e33d6ece014553d84155ce",
    "01d0516f4561cd019d4f6a49a1cb01254eeb4c6eca01ee4b824f8fc801b4499f5286c6017347de5520c4012f459058a1c101ea42a85a1cbf019f40d8",
    "5c6dbc01513ec25ea3b901ff3b4c5fbdb6018d3dbe5bdab801dd3f5259b5bb0129429c5775be01714472541bc101f5458050cbc2013448b84d06c501",
    "ed4b394c7ac801e14ec44b0bcb01d251bf4a7ccd01bd54484ab7cf01a4572448c5d101885a7546b0d3013f5bf44ae7d301cb59aa4eb7d201e7560850",
    "d2d0014553c65058ce0158500b5212cc01674db452b9c901714ae1531cc701224e505429ca011251db528ecc01ff539651c5ce0176550e4e12d00102",
    "54924a2dcf01d151bf4776cd0131a60e3b17d30177a59e3ebbd3014da3c1412fd50170a04145b4d601979d2248ded701be9f5a4b55d601e6a1d04ee3",
    "d4017ca5124f03d30117a9aa4ef9d001feab1f50ffce01dab101527fca01ceb43152f9c701d9b1885189ca01e9aedf50dccc0145ab8d5070cf01a7a7",
    "5b50a7d1010fa489516ed30179a0135066d5010da4734fbad301a6a70650b1d1018caab251c6cf0179ad0e555ecd01adaf53576acb019eb2e85728c9",
    "0193b5e858a8c6018eb89259efc3018fbb545a00c101e37dcc920bd9017e28d4add38b004f28acaa1a89000f29e1a6228900c42a17a1588c00862c22",
    "a1669000582d81a5a391002e2ee1a80d9300042f2dad819400ac30dbaf4897004e3224b2d39900e133aab57c9b00033734b88e9e00a23874ba2ea100",
    "083d0bba2bd700323fb2bd23d800ab360dbd7ca500043311bbb7a5009c2e61b891a500282aa1b6d1a4002627b3b4bda3000c2406b46ca1005326f0b5",
    "52c100bf275fba2bc100062902bfe6be00f82a51c4c1bb00da2c03c97eb7006b2ec3c981c400513189cd08c5001e3450d1ffc300be37bcd229d100b9",
    "3c16d57fd1003a40b7d6d0d0004b3b07d64fd100ff335bd413c200082f47d2e6c200ef26c5d131ab00af1e55c1d9b1001725ebc4e38500eb2b03c230",
    "bf00972f3cc269c0008c3405c64dbf005c374dc82dbe00733964cb00bd003d3546c7c5be004b3025c32ac0007a2da8bf08c100322aa8c3f9ba00302a",
    "b7c65fc50094293dcaedc6007026bece88ae00cd2241d6fd8f00c623e9d6919d003f25eeda8f9d004621b2cb95ad009721adc8e3b100f420e4c31ab3",
    "00ef21e9b8979800052359b7559d00fa2386b56ca000a325cfb218a300f0297cb7bec100e9298bbc51c1006e2347c6ab8300ea2532c998c5008b33cc",
    "e236a2007f3b23e2e1ba00494154e35abb002a4517e43ac100bf4823e512c100474cb4e7b5bf00d95092e990c600705473eb14c700b558b4eca8c600",
    "615ec6ee0cc500e761e6f0c8c20058649df440af00bd6495f6809f00be6532f586ac00026442f2c2c000185fe0eeecc400bb58a8eb67c700da4f58e9",
    "2abf0045473fe61ec000f53e93e41ab8001639cce385b600fd36d0e52b9e00bc419de6c9b500434c7be851bf00525764eae8c700b2622ced1ac600a3",
    "6f47efeecb00b37bf8f166c300a2839ef5c5b0008089cdf69fa9001885e1f5eeae001c7d6df30ab800be6eedf1a2be00bf5aa0f01dc3004c55d1f561",
    "a000b361faf8869b003968a0fb9894005a6e9ffbdba100ef8c52f015bf00dc7d9ceb7aca00617050e827ce00f265dfe58bd800895ed2e6c4ca007759",
    "27e610c8008254fce430c900e54ed7e26dcb005b468de073cb00363be7dbd7c20095372cda0fc200713892d5ead000b13c49d3f6d000a243f8d205ce",
    "00f04ca5d3c2cf002e5e46d5e2d7001f7645d809d600d2826dda53d6007a9f06e0d8c4003ba8a6e283bf0038ac28e524b40049a534e4eec100509d9a",
    "e287c500dc9136e174c600f48449de76d2002476d8db69d8004b6713da71d5006f5698d801d800a94ebbd859d700a54943d882d5004247c6d89fcf00",
    "e848a2d8d4d4001eb199f45a9200a8b321f6918a005a7975fb679c00008083f83fad00f39447f37cb8004faae8f5bc9500a59930fc838000628470f8",
    "75a9005e7494f899b000167736fd479500008b24f871a50026969ff7819c006ab6f5f12d900077a513f1edbb00b5977cf91b98000f8ba6fc239e00a1",
    "8691fc859f00818cddf858a100429420f482b600c39dbdf170b2004fa8bfee23bd00c5b442f00a940007b425f1f89300bb9d54f1c8b300017614f16a",
    "c7007260acf1e7c1006d5436f3f5b100f752e8f29db1005f5e2aefb4c4003573b0eb69cd00c48ccee886cf0039a426ebd9b40035b455ebceb30063b3",
    "b7f36491005ba2acf181a9009495f6efdebd00388cf8efd6be007686ecef6ac000dd82e4efe9c2000080afeeebc500ba7b42eca5ca00c27655e937cd",
    "00146f20e5f1d600956b15e3c6d800d165f4e196d2004d6298e062d300cc5e32dfa7d4009b5a15dd40d600515497d9cad700d750d2d60bd900824b31",
    "d473cf00f247c5d21ccf003042dece78cd00ad3f4bcf0bc600df3f71cee7c900d33ef1ce71c3002c3da7cc50bf00863c51c8ddcd00df3ea2c800d200",
    "eb4303cadbd3009949c4ca70d400a75093cb23d400435670cce6d2008d5b85cc47de00b95f62cdf2dc00db6314cf7fd9009f6604d029d7001d6aecd0",
    "54d500086f9bd2b2d3001b7626d431d400c57bb6d47ad7008683d3d434d700508be6d51bd300c09153d63fce002a8e22d54fd1004f8b19d48fd300c3",
    "8797d397d5006981bdd1f5d600c27b1ad147d300647582cf76d300066fa6ce21d300466556cdfed9006e6042cc3add00415c52cb47de00f856f3cad5",
    "d2007a5370c910d400934ed0c838d500ab4925c705d6006f45c7c603d600a5425fc4bfd6001f3f91c2bed600893bdcc0b5d500bf383ec148bd00d93a",
    "8cbff5d5001f3f9cc2b8d600a54283c4b0d6009347b9c58ad600ca4b42c617d600fc4f83c72cd5007a5316c81ed400f856abc8d7d2002a5bcac92cd1",
    "00985df4c822dc002161b8c92add009b6495c9a0db00c56811caedd8003e6c32ca0fd6006f7034cacad200a874d9ca8cd000a07921cb44d100df7d52",
    "cb71d0001f82fcca1cd200a78562cbf2d300728d83cc28d20032896bcafed20000800ccad1cf00be7b29c9e1cf00c67650c848cf003f7355c7edd000",
    "546ec8c604d400ff489ac3cad600df4d5cc34ed5005851b9c3b7d300d25476c427d20050581ac5a6d000d15ba5c540cf00515f3bc588cd009263b9c5",
    "17cd009a6663c55fd600d56af5c51dd600546e75c6d9d300c676ebc6f6ce00737c5cc632ce00b580c5c5e7cd00ad8518c6c2ce00a28a91c648d0009c",
    "8fbfc6bfce000c96fec613cc008a9c4fc727c800e3a08ec782c50041a5a4c8f7c200a6a92fc919c00058ad8bc92abd005ab01fcac2b90063b39eca2d",
    "b600ecb7a3cac9b10046ba0dcbfaad00e2bb88cbb0aa00a2bfefcbc9a800b3c20dcc06a600a0bf37ccf1a800e3bbf6caabaa007cb9c8ca57af0026b7",
    "adcad4b20022b4fcc99fb5001cb18fc9e5b80062b6abc9cdb30010bb74c9b7ac0037c179c85ea600d1c69ac7c79d0043ca2ec81f9500bfccabc8bd90",
    "0053cf2ec90f8b0025d150cada85009cd3ccca7d8200eed612cb317200e2dccdc84e7400d4df4fc00d6b0006de2ec2e66e007ada00c5d66a001ad736",
    "c68c6f00a1d4bbc64f7e00d5d2c4c7e382001ad1dac888860057ceaacb028f0061cdbacca5920027ca1dd200970099c835d65598000bc74dda9c9900",
    "91c5c1dd8899005fc4e1e02894006ec489e5ac8400afbf78ea8589009dbcf9ed278b005fbb43e903a6004dc229e27d9f002fc5bae0d3920027c8bcdd",
    "049300f9c742e12e960063c64be51998005fccb8e8607d00cbd349d8678b0011d294d80e8f002dce66dac09100e6c8c8ddea9200c5c47ede989a00af",
    "c2e3de53a600c0c169de36aa003fc316da97a900d3c76cd7de98006accbdd36d96000ad04bd1a28b002ad500ceb7810073dbf3cc625c0027dc2cc9d3",
    "7300dadd0bc45a710095db57c7187100f2da8dca306f009fd747d1447300e0d429d13486001fd303d13c8a000dd1fccd5a87009dd3c4ca7282000bd7",
    "e1c87370000ed8aec7a56c001fdbdec49d6c00a9db00c6ef6f00c9d8f8ca336d0090d20cce34870043cfccd01e8c00e0ca1fd356970096c6b6d4f3a1",
    "006dc259d652ab0093be9ad767af0073b914d91bb00010b419da52b700d0ae3fdb66bc0016abc9db06c00025a86ddc40c2005ca218dd00c4009299db",
    "dbbecd0053956bdbc4cc00919933dbd5cd00789c2fdc45cb005ba29fdf27c40000a6cbe207c20053a8d5e48fbc0048a939e645b50061a984e942b200",
    "26a986eb75b9009da782ed43bc0065a23df209a8006c9848f76e9900418daff9eb9f00fc8579fc328b00be80cbfb6393000a7d4cfba09900e77a9cf8",
    "54af007979f3f6d6b300b67bbdefc6c600497fdeec84c800ff8451eaa7c7008388c4e945cf002f8e28e950cf00c6972deaf0bb000ba4a2e91cbb0062",
    "b030e90cb90065bb79e978a5006bc260e44a9d0038c07be0aeab0048b9ade2d2b30058b35be535b70021aa7ae99db100b59f4bec95bb00bc974eeefe",
    "bd00f591abefa7bf00378c9ef011bf007686fdef4fc000dc8245eed5c400b680e8ebcac800277ddee8afcc00097b39e591cf000d7b32e2b9d3002d7d",
    "77df69d5008a83f5df75d10088888be26ecc005d901ae48fcb009d9c70e5e1c400f3ace9e6ebb300aebf6fea98890084bd74e626a70055b9e9e4adb2",
    "004c23e17ac58100ff242d788d8400a8260975e186004d2848700089001c29966be8890018294e679d89002e28a6643887001f28b0605386005527fd",
    "5bc5850055278057bd850050272653798500e2282f4f748600322b7a4b698700e12b19475f8600482d8643ca84006b2d7647ec8600832dec4a748800",
    "9a2dc44ede8900e22c2753578a00872a79579d88008926ac5a1185002024705cd48200b021bf5e568000471f4863ec7300e31c8e677872002b1c776b",
    "1773009b1ba76eae7500a1194b71ad7900d0162476667c006e14b678fd7a003e111a782179000b0ea9762e7700280997747c7300c9052873f86f002d",
    "03f570906c007c048653186a0027078051306e00a6096d4f767000890ea84c0f74008d12344c9676008216a34b937800d11c374bc17b00451fed493d",
    "7e007e22c0480b8100ae200d4ccb7c00341de84eb776001d19f851fc7200aa164154e97000fb144d57f76e009412e15b9b6d005e10c862a36e001f0f",
    "3768fe71008c0e746b357400ef0dc56eed7500a10bf771a9750081074773137200dc059c6fca70004e03e568f16d0046039164986d003203515dc16c",
    "00b3050f59086f00850a5556af7100640ef4545772003c12ea52bb72003e16c04f3375007419fd4d6a7700be1c134cc47a00791e0e4aac7d004f23c4",
    "46f281003827d5440a8400592a5647eb8500322b634b638700092cca4ec18800162c4c539c8900b8293d56c587008926ce5913850071dda77bf08100",
    "b4db36783f85000cda0575808700fed9637148880067d8346e9f8900d0d6fa69028b000bd6f864518b0050d5c35f0d8b0092d44a5b008b00d0d30457",
    "168b0015d3bc52d58a005ed2fa4e488a00b6d1724acf880019d1c1469486004ed10d433d83007dd16f4047800031d3193e2b7d0077d4923fe5800047",
    "d8e841808b0088dd73443d8b009de46046c87c00d4e78347607a0017eb394c817700a9ed2251fa7300e7f01c56a471000df4e35b89700048f6b76138",
    "710084f84a68d2710073f8676c8f72006bf88370eb72008ef81a766571002ef64379617200fbf3297d59710072ea5e80117600a1e8797ed77900e8e6",
    "967c807c006ce4f8794d7f00fee128778381009edfac721a830042dd546f8b84003cdd036c277a00d0dbcd68c378001bdaab659c7b009fd8bb625c86",
    "00cfd7ec5d4a8700d4d767580487000cd72e547187007bd91451bf840053de3054238000c7e06f56887d00efe3ea59a471009ce5b85da86f003de70f",
    "635f6e00f9e77068c96e0078e81a6d387200eae8806f34760093e831728d7a008eeb63742c7b0018f1d07362780084f09b6e3d760068ef6269457100",
    "76ede1611a6d00a8ecf55b8d6d008aec5758096f001fedf2543b71007aee3752537300dcf3cb52bb720040f6dc55907100a4f8ca5c6a70009af84362",
    "e4700089f8fc669a71006a758e8635d600f37871851ed7006b7504876dd60099729c89a3d600cc6f8a8b2bd800256ffb8c0ddc00606c648f7fde0091",
    "69e59221de0008668794b0dc007f62ea9482db00ef5e9895b8d900595b499664d7007558b2961fd5003054f89548d400a2507394aad300074df89100",
    "d2005d49a58e20cf002147038cc2cc00fa456f8842c30063449585e4bf004a446381e3bd003444787c0ebc002944bb7728bb002644b573e6ba00ed44",
    "137013bc007646d76c21be00bc483b6bd0c000024bbd6899c300484db867c4c6002f506665e9c7007954d76414c8000b58b86336c800605c7162efc9",
    "007761796138ce005c640561b1d000656691631acc004566bb6508c600f566366ac5c400ac67eb6dadc4006368227396c400876a58784fc400f56bf2",
    "7c20c400876a098153c4003f665583dcc4004161a28581c5008e5be9853cc60049576186cec60005530c866bc700c24e9c83ffc700364b148171c800",
    "1449d27c9cc800ec4b8d815ac800864f5a873fc9008b52028be6cd006d53738c9dd200f954dd8e7ed6002657e59151d800da5c6992bada0067606990",
    "04dc00e863bd8dd9db00d665d68b8fd30057690b8aa3d100dc6cbb8758d000bb6f9986fad2001d71198455d0003b73138198cf00a274ee7c89cd0099",
    "747d7a0cca00d8738c789cc5001e73b0745bc400f7702070e3c300fe701b6d46c6000c71596ba6ca00aa6fc06821ce00016fe966a5d10049739369ea",
    "d4008c77fa6d25d800607a2f7081da000080e675d6d9008683eb7ab9d600f0845d7f43d600ee84ce834fd700a5855d7fe3d500f084797bc3d5003a84",
    "357698d7006881bb8452d800a38574843ed7002c89bc8401d600bb8ce28421d300ad6be59198de002e6feb8f5fde008870f88c8eda00e5712e8ad0d6",
    "004a73a0863bd500d2766e8346d5005a7a8e801dd600e27dbf7e49d7001d82737d36d7003989f67a0dcf0069900b7a25c800d896277951c700939cc6",
    "7894c600978a6384f7d4006c8dd88694d400858ffc8927d6008f91628cc1db000995348eb7dd008a98e88fc0dd000f9c6f911bdd00999fb292eddb00",
    "27a346936dda00baa63a9480d80052aab99477d600eeadcf9424d40041b2b59224d2002fb5e891c7cf001fb8cb8f83cd001fbb0f8e43ca0000bd6c8c",
    "dbc0000cbd7988edbf00c9bdd18c76bf0093be9c900dbe004bbc7692aac000ffb97f93bfc3004db8809389c90049b53b9463cd005ab21495c1cf0069",
    "af389577d20073ac429312d60024a8ba905ad80054a5488e36d800ac9e6f8a7bc800b59936871bc70021964a857bc7001f91438127c800fb8e6c7d59",
    "c8008d8dfe7786c800d68c0f74b3c800448e387091c8008d92466fdec700d896a46f51c700249beb6fc3c600719f296f36c6006eb73c8b29cd0071b5",
    "3589dac90019b46c85d9c700e5b4a181e4c500aeb5287e44c400b5b5a4798dc3008eb32175a1c3001eb22e71d0c300f5af5b6d19c4005dac586b8dc4",
    "00c5a8316904c5002ea5bf677ac500e0a0366618c600439d2e64a0c7004f9a2a634ecc001e98d2627dcf009d999e6392cb00009e1965b0c60098a1ae",
    "66f9c5002ea5d46879c5000da87f6b1bc50015adf56b76c400f5af656e17c400a5ab736ea5c400c5a8ec6b03c500e6a57c6961c50035aaaa69d5c400",
    "cdadea6b5fc400edaaf668bfc40055a7846739c500edaaf768bfc400bfa85f65c6c5001e91aa6b4fc8008a8de36dd4c900a48afb6efcce0032898c6f",
    "c0d200c1876c6f5dd7003684d1707cdb000080aa71fddc00c87b17715edb003f78fa6f7cd7001b760f6f70d4006d75e36a48d7007675f26672db0052",
    "764e6659ef005c76826409f40064763562f4f7000875015f53f9004272075d6df6006f6fa75b2bf100496d735a06ec00d86b4b5991e800de6afd5a27",
    "d8004e67065b34d600bb639c5b2bd4008f61bf5dfdd1007b613461dece00f95f30625fcb00c25d02637cc8001a629b622acb008066896130d100846b",
    "a25fcbd400f372ea5d20f7006c761f5ce2fb00db79c85988fe00457dd0566cff00a27eb6513bfd000080fe4e4cfa00af80034d0bf7001182da4a12f2",
    "00bd824f4f57fa000c8298535dfe005d81c357caff000080f95d64ff00517f726321fc00a07e3c663df8004f7f27696cf0000080ca6940e900b2805a",

"6af0e4006081016851f4005e817f6579f9000c824d62effc006983125f8dfe00c684f7570dff00c884e9516bfc007d85894ef3f7003286824cb4f300",
    "ea88cf5071f80095895d54d6fa00438af65991fb00598c2c5e20f8007b8ecf600bf200378f2b6271ee00f48fda62cbea00f59032635bd4005195fd64",
    "1ecd008997af657dc800db9b8966bfc600719fb36737c6008e9c8a646ec700ce9821625ad000eb954c6054d3008493305e06e500c192fc5d35e90045",
    "91f35ac3ef00d78f70585af300bd8d555567f600618c5d5131f5000b8bc44d13f100648ab74b9eec00708a8c4abfe600a7871748eee600c882164704",
    "e7009b7e9546dfe6006d7af5445fe6003f76654418e6007473f84126e5000c72604660e40052718e4a98e100b870fe4d48e900c670fe4fcfed00f76d",
    "b351ebea000e6847566ad800c76840527ad9008069b74d7fda003c6aba4922dc00fa6aaa469ade00066bee4247e100536ae53e48e100e4689e3b5ddf",
    "0020684f3901dc005c679037d3d800e865c334d2d6002f6a1d3352d900096dda32c3db009470c93262de001b749333a5e000b7793733ffe2004d7fea",
    "33f6e3007d83a13493e300af87c93544e200978c0637bbe00018909b3850e000a093d83810de002897c739a4dc008598b43cccde006196053fd7e000",
    "db921540ace20029926c446fe200ca90eb486fe0001a90904d77df00f48fcd4ebaea00e68f625116ef00a590964ff5ea00d090c04be5de00c790e747",
    "38e1007391dd423be3008f933d3f49e200fb94143cbae000bf95583916dd00ab93b63657db0020907c35e4dd00988c943537e000af8719354ee20030",
    "84123488e3000080ea35bfe300357db83994e400d17bfb3db6e4006d7a7842a2e5006e7a4546c5e600797aec4a00f000327b7a4e35f800e47b735052",
    "fb00e87b9a55bdfe00467d9a5ab0ff00",
].join("");

function decodeStickerMask() {
    const byteLength = Math.floor(STICKER_MASK_HEX.length / 2);
    const bytes = new Uint8Array(byteLength);

    for (let i = 0, j = 0; i < byteLength; i++, j += 2) {
        bytes[i] = parseInt(STICKER_MASK_HEX.slice(j, j + 2), 16);
    }

    const view = new DataView(bytes.buffer);
    const count = Math.floor(bytes.length / 7);
    const strokes = new Array(count);

    for (let i = 0, o = 0; i < count; i++, o += 7) {
        strokes[i] = [
            view.getUint16(o, true) / 65535,
            view.getUint16(o + 2, true) / 65535,
            view.getUint16(o + 4, true) / 65535,
            STICKER_MASK_RADIUS,
            bytes[o + 6]
        ];
    }

    return strokes;
}

const stickerMaskStrokes = decodeStickerMask();
const stickerMaskCellSize = STICKER_MASK_RADIUS;
const stickerMaskGridWidth = Math.ceil(1 / stickerMaskCellSize) + 2;
const stickerMaskGrid = new Array(stickerMaskGridWidth ** 3);
for (let i = 0; i < stickerMaskStrokes.length; i++) {
    const s = stickerMaskStrokes[i];
    const loX = Math.floor((s[0] - s[3]) / stickerMaskCellSize);
    const hiX = Math.floor((s[0] + s[3]) / stickerMaskCellSize);
    const loY = Math.floor((s[1] - s[3]) / stickerMaskCellSize);
    const hiY = Math.floor((s[1] + s[3]) / stickerMaskCellSize);
    const loZ = Math.floor((s[2] - s[3]) / stickerMaskCellSize);
    const hiZ = Math.floor((s[2] + s[3]) / stickerMaskCellSize);
    for (let z = loZ; z <= hiZ; z++) {
        for (let y = loY; y <= hiY; y++) {
            for (let x = loX; x <= hiX; x++) {
                const key = (z + 1) * stickerMaskGridWidth * stickerMaskGridWidth +
                    (y + 1) * stickerMaskGridWidth + x + 1;
                let cell = stickerMaskGrid[key];
                if (!cell) stickerMaskGrid[key] = cell = [];
                cell.push(i);
            }
        }
    }
}



function getNormalizedHeadLocalPoint(localPoint) {
    if (!headLocalBounds) return null;

    const min = headLocalBounds.min;
    const max = headLocalBounds.max;

    return {
        x: (localPoint.x - min.x) /
            Math.max(0.0001, max.x - min.x),
        y: (localPoint.y - min.y) /
            Math.max(0.0001, max.y - min.y),
        z: (localPoint.z - min.z) /
            Math.max(0.0001, max.z - min.z)
    };
}


function getMaskNormalizedAllowed(n) {
    if (!stickerMaskHasPaint || !n) return null;
    const x = Math.floor(n.x / stickerMaskCellSize) + 1;
    const y = Math.floor(n.y / stickerMaskCellSize) + 1;
    const z = Math.floor(n.z / stickerMaskCellSize) + 1;
    if (x < 0 || y < 0 || z < 0 || x >= stickerMaskGridWidth ||
        y >= stickerMaskGridWidth || z >= stickerMaskGridWidth) return false;
    const cell = stickerMaskGrid[(z * stickerMaskGridWidth + y) * stickerMaskGridWidth + x];
    if (!cell) return false;
    for (let i = cell.length - 1; i >= 0; i--) {
        const s = stickerMaskStrokes[cell[i]];
        const dx = n.x - s[0], dy = n.y - s[1], dz = n.z - s[2];
        if (dx * dx + dy * dy + dz * dz <= s[3] * s[3]) return s[4] === 1;
    }
    return false;
}

function getMaskPointAllowed(worldPoint) {
    if (
        !stickerMaskHasPaint ||
        !headMesh ||
        !headLocalBounds
    ) {
        return null;
    }

    const local =
        headMesh.worldToLocal(
            worldPoint.clone()
        );

    const n =
        getNormalizedHeadLocalPoint(local);

    return getMaskNormalizedAllowed(n);
}

/* =========================================================
   NATURAL BLINK
========================================================= */

const clock =
    new THREE.Clock();

const mixer =
    new THREE.AnimationMixer(
        model
    );

// Blink вынесен в отдельный mixer: Mouth/Speech больше не могут
// смешением весов случайно открыть веки после Natural_Blink.
const blinkMixer =
    new THREE.AnimationMixer(
        model
    );

// Встроенные facial clips новой головы.
const sourceMouthOpenCloseClip =
    THREE.AnimationClip.findByName(
        gltf.animations || [],
        'Mouth_Open_Close'
    );

const sourceSpeechOClip =
    THREE.AnimationClip.findByName(
        gltf.animations || [],
        'Speech_O'
    );

const facialActions = {
    mouth: sourceMouthOpenCloseClip
        ? mixer.clipAction(sourceMouthOpenCloseClip)
        : null,
    speechO: sourceSpeechOClip
        ? mixer.clipAction(sourceSpeechOClip)
        : null
};

Object.values(facialActions).forEach(action => {
    if (!action) return;

    action.reset();
    action.enabled = true;
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    action.paused = false;
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(0);
});

if (!sourceMouthOpenCloseClip || !sourceSpeechOClip) {
    console.warn(
        '[GN HEAD] Facial clips check:',
        {
            Mouth_Open_Close: Boolean(sourceMouthOpenCloseClip),
            Speech_O: Boolean(sourceSpeechOClip),
            available: (gltf.animations || []).map(clip => clip.name)
        }
    );
}

function setFacialActionPose(action, clip, value) {
    if (!action || !clip) return;

    const v = THREE.MathUtils.clamp(Number(value || 0), 0, 1);

    action.enabled = true;
    action.paused = false;
    action.setEffectiveWeight(1);
    action.setEffectiveTimeScale(0);
    action.time = THREE.MathUtils.clamp(
        clip.duration * v,
        0,
        Math.max(0, clip.duration - 0.000001)
    );
}

function applyManualFacialPoses() {
    setFacialActionPose(
        facialActions.mouth,
        sourceMouthOpenCloseClip,
        SETTINGS.mouthOpenClosePose
    );

    setFacialActionPose(
        facialActions.speechO,
        sourceSpeechOClip,
        SETTINGS.speechOPose
    );

    // Пересэмпливаем bindings на выставленном action.time.
    mixer.update(0);
}

const sourceBlinkClip =
    THREE.AnimationClip.findByName(
        gltf.animations || [],
        'Natural_Blink'
    );

let blinkAction = null;
let manualBlinkClip = null;

let autoBlinkClip = null;

if (!sourceBlinkClip) {
    console.warn(
        '[GN HEAD] Natural_Blink clip not found. Available clips:',
        (gltf.animations || []).map(
            clip => clip.name
        )
    );
}

if (sourceBlinkClip) {
    const fps = 30;

    // Полный цикл: open -> close -> open.
    autoBlinkClip =
        THREE.AnimationUtils.subclip(
            sourceBlinkClip,
            'Natural_Blink_AUTO',
            Math.floor(0.60 * fps),
            Math.ceil(1.10 * fps),
            fps
        );

    autoBlinkClip.resetDuration();

    // Для keyframes нужен НЕ полный blink,
    // а только open -> fully closed.
    // Поэтому берём первую половину исходного моргания.
    manualBlinkClip =
        THREE.AnimationUtils.subclip(
            sourceBlinkClip,
            'Natural_Blink_MANUAL',
            Math.floor(0.60 * fps),
            Math.ceil(0.85 * fps),
            fps
        );

    manualBlinkClip.resetDuration();

    blinkAction =
        blinkMixer.clipAction(
            manualBlinkClip
        );

    blinkAction.reset();
    blinkAction.enabled = true;
    blinkAction.setLoop(
        THREE.LoopOnce,
        1
    );
    blinkAction.clampWhenFinished = true;
    blinkAction.play();

    // Не paused: иначе mixer может не пересэмплировать pose.
    // Замораживаем clip через нулевой timeScale.
    blinkAction.paused = false;
    blinkAction.setEffectiveTimeScale(0);
}

let blinkTimer = null;
let blinkPlaying = false;

function applyManualBlinkPose() {
    if (
        !blinkAction ||
        !manualBlinkClip
    ) {
        return;
    }

    const v =
        THREE.MathUtils.clamp(
            Number(
                SETTINGS.blinkPose || 0
            ),
            0,
            1
        );

    blinkPlaying = false;

    if (
        blinkAction.getClip() !==
        manualBlinkClip
    ) {
        blinkAction.stop();

        blinkAction =
        blinkMixer.clipAction(
                manualBlinkClip
            );

        blinkAction.reset();
        blinkAction.play();
    }

    blinkAction.enabled = true;
    blinkAction.paused = false;
    blinkAction.setEffectiveWeight(1);
    blinkAction.setEffectiveTimeScale(0);
    // Action мог быть остановлен предыдущим прогоном сценария.
    // play() повторно активирует binding; time задаём сразу после него.
    blinkAction.play();

    // 0 = fully open, 1 = fully closed.
    // Напрямую задаём локальное время action.
    blinkAction.time =
        THREE.MathUtils.clamp(
            manualBlinkClip.duration * v,
            0,
            Math.max(
                0,
                manualBlinkClip.duration - 0.000001
            )
        );

    // Пересчитываем Natural_Blink отдельным mixer ПОСЛЕ mouth/speech.
    // Это гарантирует, что значение век не будет сброшено другим facial clip.
    blinkMixer.update(0);
}

function forceManualBlinkPose(value) {
    if (!manualBlinkClip) return;

    SETTINGS.blinkPose = THREE.MathUtils.clamp(Number(value || 0), 0, 1);

    blinkMixer.stopAllAction();
    blinkAction = blinkMixer.clipAction(manualBlinkClip);
    blinkAction.reset();
    blinkAction.enabled = true;
    blinkAction.paused = false;
    blinkAction.setEffectiveWeight(1);
    blinkAction.setEffectiveTimeScale(0);
    blinkAction.play();
    blinkAction.time = THREE.MathUtils.clamp(
        manualBlinkClip.duration * SETTINGS.blinkPose,
        0,
        Math.max(0, manualBlinkClip.duration - 0.000001)
    );
    blinkMixer.update(0);
}

// =========================================================
// LIQUID REVEAL <-> NATURAL_BLINK
// Every reveal starts with the actual Natural_Blink fully closed.
// =========================================================
function setRevealEyeballsVisible(visible) {
    // Во время формирования головы сами глазные яблоки и зрачки
    // вообще не рендерим. Веки остаются частью головы и продолжают
    // участвовать в liquid-reveal.
    eyeMeshes.forEach(mesh => {
        mesh.visible = visible;
    });

    pupilMeshes.forEach(mesh => {
        mesh.visible = visible;
    });
}

gnRevealBeforeReplay = () => {
    clearTimeout(blinkTimer);
    blinkTimer = null;
    blinkPlaying = false;

    // 1 = fully closed in Natural_Blink_MANUAL.
    forceManualBlinkPose(1);

    // Не даём белкам/зрачкам просвечивать сквозь закрытые веки
    // во время самой liquid-анимации.
    setRevealEyeballsVisible(false);
};

// Prepare the final material before starting the page intro.
// This source is embedded into the scene module by tools/build.mjs.
Object.assign(SETTINGS,{imageMaterialEnabled:true,imageMaterialMapping:0,imageMaterialIntensity:1,imageMaterialOpacity:1,imageMaterialBrightness:1,imageMaterialScale:1,imageMaterialOffsetX:0,imageMaterialOffsetY:0,imageMaterialRotation:0,imageMaterialEdgeInset:0.04,imageMaterialHighlightSuppression:0});
let uploadedMaterialTexture=null,uploadedMaterialData=null,uploadedMaterialRun=0;
SETTINGS.modelSmoothing=0;
SETTINGS.modelBuiltinMatcapEnabled=true;
function readFloatAttribute(attribute){
 const values=new Float32Array(attribute.count*3);
 for(let i=0;i<attribute.count;i++){values[i*3]=attribute.getX(i);values[i*3+1]=attribute.getY(i);values[i*3+2]=attribute.getZ(i);}
 return values;
}
function makeSmoothingCache(geometry){
 const original=readFloatAttribute(geometry.attributes.position),ids=[],groups=[],lookup=new Map();
 for(let i=0;i<original.length/3;i++){
  const key=[0,1,2].map(k=>Math.round(original[i*3+k]*1e6)).join(',');
  let id=lookup.get(key);if(id===undefined){id=groups.length;lookup.set(key,id);groups.push([]);}ids.push(id);groups[id].push(i);
 }
 const neighbors=groups.map(()=>new Set()),index=geometry.index;
 for(let i=0;i<(index?index.count:ids.length);i+=3){
  const triangle=[0,1,2].map(k=>ids[index?index.getX(i+k):i+k]);
  for(const a of triangle)for(const b of triangle)if(a!==b)neighbors[a].add(b);
 }
 function smooth(values){
  let points=groups.map(group=>Array.from(values.slice(group[0]*3,group[0]*3+3)));
  for(let pass=0;pass<8;pass++){
   const factor=pass%2===0?.25:-.26;
   points=points.map((p,i)=>neighbors[i].size?p.map((v,k)=>v+factor*([...neighbors[i]].reduce((sum,j)=>sum+points[j][k],0)/neighbors[i].size-v)):p);
  }
  const result=values.slice();groups.forEach((group,id)=>group.forEach(i=>points[id].forEach((v,k)=>result[i*3+k]=v)));return result;
 }
 return {position:geometry.attributes.position,normal:geometry.attributes.normal,morphPosition:geometry.morphAttributes.position,morphNormal:geometry.morphAttributes.normal,
  original,smooth:smooth(original),groups,targets:(geometry.morphAttributes.position||[]).map(attr=>{const values=readFloatAttribute(attr);return {original:values,smooth:smooth(values)};})};
}
function applySmoothing(geometry,cache,amount){
 if(amount===0){
  geometry.setAttribute('position',cache.position);geometry.setAttribute('normal',cache.normal);
  if(cache.morphPosition)geometry.morphAttributes.position=cache.morphPosition;else delete geometry.morphAttributes.position;
  if(cache.morphNormal)geometry.morphAttributes.normal=cache.morphNormal;else delete geometry.morphAttributes.normal;
 }else{
  function blended(source){const values=source.original.slice();for(let i=0;i<values.length;i++)values[i]+=(source.smooth[i]-values[i])*amount;return new THREE.Float32BufferAttribute(values,3);}
  geometry.setAttribute('position',blended(cache));
  if(cache.targets.length)geometry.morphAttributes.position=cache.targets.map(blended);else delete geometry.morphAttributes.position;
  function normals(position){
   const probe=new THREE.BufferGeometry();probe.setIndex(geometry.index);probe.setAttribute('position',position);probe.computeVertexNormals();
   const normal=probe.attributes.normal;
   for(const group of cache.groups){const sum=new THREE.Vector3();for(const i of group)sum.add(new THREE.Vector3().fromBufferAttribute(normal,i));sum.normalize();for(const i of group)normal.setXYZ(i,sum.x,sum.y,sum.z);}
   const result=normal.clone();probe.dispose();return result;
  }
  const position=geometry.attributes.position,baseNormals=normals(position);geometry.setAttribute('normal',baseNormals);
  if(cache.targets.length)geometry.morphAttributes.normal=geometry.morphAttributes.position.map(target=>{
   const targetPosition=target.clone();
   if(geometry.morphTargetsRelative)for(let i=0;i<target.count;i++)targetPosition.setXYZ(i,target.getX(i)+position.getX(i),target.getY(i)+position.getY(i),target.getZ(i)+position.getZ(i));
   const result=normals(targetPosition);
   if(geometry.morphTargetsRelative)for(let i=0;i<result.count;i++)result.setXYZ(i,result.getX(i)-baseNormals.getX(i),result.getY(i)-baseNormals.getY(i),result.getZ(i)-baseNormals.getZ(i));
   return result;
  });
  else delete geometry.morphAttributes.normal;
 }
 geometry.computeBoundingBox();geometry.computeBoundingSphere();geometry.boundsTree?.refit();
 // Three caches morphs in a GPU texture; invalidate it after changing the shapes.
 geometry.dispose();
}
const smoothingCache=new Map();
function syncModelSmoothing(){
 const amount=Math.max(0,Math.min(1,SETTINGS.modelSmoothing));
 for(const mesh of allMeshes){
  if(mesh.material!==headMatcapMaterial&&!mesh.userData.pbrMaterial)continue;
  const geometry=mesh.geometry;
  let cache=smoothingCache.get(geometry);if(!cache){cache=makeSmoothingCache(geometry);smoothingCache.set(geometry,cache);}
  applySmoothing(geometry,cache,amount);
 }
}
// The beard lies very close to the face. Bias its depth without moving the geometry.
for(const mesh of allMeshes){
 if(mesh.material!==headMatcapMaterial)continue;
 const isBeard=/beard/i.test(mesh.name);
 const previous=mesh.onBeforeRender;
 mesh.onBeforeRender=function(...args){
  previous?.apply(this,args);
  headMatcapMaterial.polygonOffset=isBeard;
  headMatcapMaterial.polygonOffsetFactor=isBeard?-1:0;
  headMatcapMaterial.polygonOffsetUnits=isBeard?-1:0;
 };
 if(isBeard)mesh.renderOrder=1;
}
const originalHeadCompile=headMatcapMaterial.onBeforeCompile;
headMatcapMaterial.onBeforeCompile=shader=>{
 originalHeadCompile(shader);
 shader.uniforms.uImageMaterial={value:uploadedMaterialTexture};
 shader.uniforms.uBuiltinMatcapEnabled={value:SETTINGS.modelBuiltinMatcapEnabled?1:0};
 shader.uniforms.uImageEnabled={value:uploadedMaterialTexture&&SETTINGS.imageMaterialEnabled?1:0};
 for(const name of ['Mapping','Intensity','Opacity','Brightness','Scale','Rotation','EdgeInset','HighlightSuppression'])shader.uniforms['uImage'+name]={value:SETTINGS['imageMaterial'+name]};
 shader.uniforms.uImageOffset={value:new THREE.Vector2(SETTINGS.imageMaterialOffsetX,SETTINGS.imageMaterialOffsetY)};
 shader.vertexShader='varying vec3 vGNImagePosition,vGNImageNormal;varying vec2 vGNImageUv;\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGNImagePosition=position;vGNImageNormal=normal;');
 shader.vertexShader=shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvGNImageUv=uv;');
 shader.fragmentShader='varying vec3 vGNImagePosition,vGNImageNormal;varying vec2 vGNImageUv;uniform sampler2D uImageMaterial;uniform float uBuiltinMatcapEnabled,uImageEnabled,uImageMapping,uImageIntensity,uImageOpacity,uImageBrightness,uImageScale,uImageRotation,uImageEdgeInset,uImageHighlightSuppression;uniform vec2 uImageOffset;\n'+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('vec3 gnMatcap = matcapColor.rgb;',`
 vec3 gnMatcap = uBuiltinMatcapEnabled>0.5?matcapColor.rgb:vec3(0.30+0.70*max(dot(normalize(normal),normalize(vec3(-0.4,0.7,1.0))),0.0));
 if(uImageEnabled>0.5){
   vec3 imageViewDir=normalize(vViewPosition);
   vec3 imageX=normalize(vec3(imageViewDir.z,0.0,-imageViewDir.x));
   vec3 imageY=cross(imageViewDir,imageX);
   vec2 imageUV=uImageMapping<0.5?vec2(dot(imageX,normal),dot(imageY,normal))*0.495+0.5:vec2(vGNImageUv.x,1.0-vGNImageUv.y);
   float imageCos=cos(uImageRotation),imageSin=sin(uImageRotation);
   imageUV=mat2(imageCos,-imageSin,imageSin,imageCos)*(imageUV-0.5)*uImageScale+0.5+uImageOffset;
   if(uImageMapping<0.5){
     // Sample inside the photographed sphere rather than its surrounding background.
     vec2 spherePoint=imageUV-0.5;
     float sphereRadius=max(0.05,0.495-clamp(uImageEdgeInset,0.0,0.4));
     spherePoint*=sphereRadius/0.495;
     float sphereDistance=length(spherePoint);
     if(sphereDistance>sphereRadius)spherePoint*=sphereRadius/sphereDistance;
     imageUV=spherePoint+0.5;
   }
   vec4 imageSample=texture2D(uImageMaterial,imageUV);
   if(uImageMapping>1.5){
     // Object-space triplanar coordinates stay fixed as the head rotates.
     vec3 weights=pow(abs(normalize(vGNImageNormal)),vec3(4.0));
     weights/=max(weights.x+weights.y+weights.z,0.00001);
     mat2 surfaceRotation=mat2(imageCos,-imageSin,imageSin,imageCos);
     vec2 tx=surfaceRotation*vGNImagePosition.yz*uImageScale*4.0+uImageOffset;
     vec2 ty=surfaceRotation*vGNImagePosition.xz*uImageScale*4.0+uImageOffset;
     vec2 tz=surfaceRotation*vGNImagePosition.xy*uImageScale*4.0+uImageOffset;
     // Mirror a central patch of the sphere, excluding its background and rim.
     tx=abs(fract(tx*0.5)*2.0-1.0)*0.42+0.29;
     ty=abs(fract(ty*0.5)*2.0-1.0)*0.42+0.29;
     tz=abs(fract(tz*0.5)*2.0-1.0)*0.42+0.29;
     imageSample=texture2D(uImageMaterial,tx)*weights.x+texture2D(uImageMaterial,ty)*weights.y+texture2D(uImageMaterial,tz)*weights.z;
     gnMatcap=vec3(1.0);
     gnSurfaceTexture=1.0;
   }
   // Compress only highlights; preserve the texture and each pixel's hue.
   float imageLuminance=dot(imageSample.rgb,vec3(0.2126,0.7152,0.0722));
   float highlightKnee=0.12;
   float aboveKnee=max(imageLuminance-highlightKnee,0.0);
   float softenedLuminance=min(imageLuminance,highlightKnee)+aboveKnee/(1.0+8.0*aboveKnee/highlightKnee);
   float compressedLuminance=mix(imageLuminance,softenedLuminance,clamp(uImageHighlightSuppression,0.0,1.0));
   imageSample.rgb*=compressedLuminance/max(imageLuminance,0.00001);
   float imageWeight=clamp(uImageIntensity*uImageOpacity*imageSample.a,0.0,1.0);
   gnMatcap=mix(gnMatcap,imageSample.rgb*uImageBrightness,imageWeight);
   // A stable average retains the uploaded material's color in the diffuse base.
   vec3 imageTone=(texture2D(uImageMaterial,vec2(0.5)).rgb+texture2D(uImageMaterial,vec2(0.3,0.5)).rgb+texture2D(uImageMaterial,vec2(0.7,0.5)).rgb+texture2D(uImageMaterial,vec2(0.5,0.3)).rgb+texture2D(uImageMaterial,vec2(0.5,0.7)).rgb)*0.2*uImageBrightness;
   gnMatcapTone=mix(gnMatcapTone,max(imageTone,vec3(0.025)),imageWeight);
 }
 `);
};
headMatcapMaterial.customProgramCacheKey=()=> 'gn-head-uploaded-image-v7';
headMatcapMaterial.needsUpdate=true;
function syncUploadedMaterial(){
 const u=headMaterialShader?.uniforms;if(!u?.uImageMaterial)return;
 u.uBuiltinMatcapEnabled.value=SETTINGS.modelBuiltinMatcapEnabled?1:0;
 u.uImageMaterial.value=uploadedMaterialTexture;u.uImageEnabled.value=uploadedMaterialTexture&&SETTINGS.imageMaterialEnabled?1:0;
 for(const name of ['Mapping','Intensity','Opacity','Brightness','Scale','Rotation','EdgeInset','HighlightSuppression'])u['uImage'+name].value=SETTINGS['imageMaterial'+name];
 u.uImageOffset.value.set(SETTINGS.imageMaterialOffsetX,SETTINGS.imageMaterialOffsetY);
}

// A world-space receiver and a shadow depth pass use the animated geometry.
// var is intentional: the render loop can run before this module tail initializes.
var groundShadowPlane,groundShadowLight,groundShadowBounds;
function syncGroundShadow(){
 if(!groundShadowPlane)return;
 const az=THREE.MathUtils.degToRad(SETTINGS.lightingAzimuth);
 const el=THREE.MathUtils.degToRad(SETTINGS.lightingElevation);
 const center=groundShadowBounds.getCenter(new THREE.Vector3());
 const direction=new THREE.Vector3(Math.sin(az)*Math.cos(el),Math.sin(el),Math.cos(az)*Math.cos(el));
 groundShadowLight.position.copy(center).addScaledVector(direction,20);
 groundShadowLight.target.position.copy(center);
 groundShadowLight.color.set(SETTINGS.lightingColor);
 groundShadowLight.intensity=SETTINGS.lightingIntensity*(SETTINGS.modelMaterialMode===2?3:1);
 groundShadowLight.shadow.radius=1+SETTINGS.groundShadowSoftness*5;
 groundShadowPlane.material.color.set(SETTINGS.groundShadowColor);
 groundShadowPlane.position.set(center.x+SETTINGS.groundShadowOffsetX,groundShadowBounds.min.y+SETTINGS.groundShadowOffsetY,center.z);
 groundShadowPlane.scale.set(SETTINGS.groundShadowFloorSize,SETTINGS.groundShadowFloorSize,1);
 updateGroundShadow();
}
function updateGroundShadow(){
 if(!groundShadowPlane)return;
 const arrival=window.MD_MODEL_ARRIVAL||0;
 groundShadowPlane.visible=SETTINGS.groundShadowEnabled && arrival>0;
 groundShadowLight.castShadow=SETTINGS.groundShadowEnabled;
 // A light below the floor does not cast a shadow onto its upper side.
 const lightVisibility=THREE.MathUtils.smoothstep(SETTINGS.lightingElevation,0,6)*THREE.MathUtils.smoothstep(SETTINGS.lightingIntensity,0,.15);
 groundShadowPlane.material.opacity=SETTINGS.groundShadowOpacity*lightVisibility*arrival;
}
model.updateMatrixWorld(true);
groundShadowBounds=new THREE.Box3().setFromObject(model);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFShadowMap;
model.traverse(object=>{if(object.isMesh)object.castShadow=true;});
groundShadowLight=new THREE.DirectionalLight(SETTINGS.lightingColor,SETTINGS.lightingIntensity);
groundShadowLight.castShadow=true;
groundShadowLight.shadow.mapSize.set(2048,2048);
Object.assign(groundShadowLight.shadow.camera,{near:1,far:60,left:-12,right:12,top:12,bottom:-12});
groundShadowLight.shadow.camera.updateProjectionMatrix();
groundShadowLight.shadow.bias=-.00005;
groundShadowLight.shadow.normalBias=.015;
scene.add(groundShadowLight,groundShadowLight.target);
groundShadowPlane=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.ShadowMaterial({color:SETTINGS.groundShadowColor,opacity:0,transparent:true,depthWrite:false}));
groundShadowPlane.rotation.x=-Math.PI/2;
groundShadowPlane.receiveShadow=true;
groundShadowPlane.frustumCulled=false;
scene.add(groundShadowPlane);
syncGroundShadow();

renderer.debug.onShaderError=(gl,program,vertex,fragment)=>{let el=document.querySelector('#gn-shader-diagnostic');if(!el){el=document.createElement('pre');el.id='gn-shader-diagnostic';el.hidden=true;document.body.append(el);}el.textContent=gl.getProgramInfoLog(program)+'\n'+gl.getShaderInfoLog(vertex)+'\n'+gl.getShaderInfoLog(fragment);};
// PBR textures use the whole seamless image, in a common rest-pose coordinate space.
Object.assign(SETTINGS,{pbrScale:.65,pbrNormalStrength:.4,pbrHeightStrength:.012,pbrRoughnessMapStrength:1,pbrOffsetX:0,pbrOffsetY:0,pbrRotation:0});
var pbrMaterial,pbrAmbient,pbrUniforms,pbrMeshes=[],pbrMaps={},pbrMapData={},pbrLoadVersion=0;
const pbrFallback=new THREE.DataTexture(new Uint8Array([255,255,255,255]),1,1);pbrFallback.needsUpdate=true;
pbrUniforms={uPBRColor:{value:pbrFallback},uPBRRough:{value:pbrFallback},uPBRNormal:{value:pbrFallback},uPBRHeight:{value:pbrFallback},uPBRHas:{value:new THREE.Vector4()},uPBRGlowStrength:{value:1.2},uPBRGlowSpeed:{value:1.35},uPBRGlowRainbow:{value:1},uPBRGlowTint:{value:new THREE.Color("#5900ff")},uPBRGlowTime:{value:0},uPBRGlowEnabled:{value:1},uPBRMatte:{value:0},uPBRScale:{value:SETTINGS.pbrScale},uPBRNormalStrength:{value:SETTINGS.pbrNormalStrength},uPBRHeightStrength:{value:SETTINGS.pbrHeightStrength},uPBRRoughStrength:{value:1},uPBRRotation:{value:0},uPBROffset:{value:new THREE.Vector2()},uPBRBind:{value:new THREE.Matrix4()},uPBRBindNormal:{value:new THREE.Matrix3()}};
pbrUniforms.uOilBrightness={value:0};
pbrUniforms.uOilEdgeRainbow={value:0};
pbrUniforms.uOilEnabled={value:0};
pbrUniforms.uOilFlowAmount={value:0};
pbrUniforms.uOilFlowScale={value:0};
pbrUniforms.uOilFlowSecondary={value:0};
pbrUniforms.uOilFlowSpeed={value:0};
pbrUniforms.uOilImpact={value:0};
pbrUniforms.uOilImpactBrightness={value:0};
pbrUniforms.uOilImpactColorA={value:new THREE.Color(SETTINGS.revealTint)};
pbrUniforms.uOilImpactColorB={value:new THREE.Color(SETTINGS.revealGlowColor)};
pbrUniforms.uOilImpactHighlight={value:new THREE.Color(SETTINGS.revealHighlightColor)};
pbrUniforms.uOilImpactSaturation={value:0};
pbrUniforms.uOilImpactSpeed={value:0};
pbrUniforms.uOilImpactStrength={value:0};
pbrUniforms.uOilIridescence={value:0};
pbrUniforms.uOilMix={value:0};
pbrUniforms.uOilSaturation={value:0};
pbrUniforms.uOilScale={value:0};
pbrUniforms.uOilShift={value:0};
pbrUniforms.uOilTime={value:0};
function updatePBROil(){
pbrUniforms.uOilBrightness.value=SETTINGS.oilBrightness;
pbrUniforms.uOilEdgeRainbow.value=SETTINGS.oilEdgeRainbow;
pbrUniforms.uOilEnabled.value=SETTINGS.oilEnabled?1:0;
pbrUniforms.uOilFlowAmount.value=SETTINGS.oilFlowAmount;
pbrUniforms.uOilFlowScale.value=SETTINGS.oilFlowScale;
pbrUniforms.uOilFlowSecondary.value=SETTINGS.oilFlowSecondary;
pbrUniforms.uOilFlowSpeed.value=SETTINGS.oilFlowSpeed;
pbrUniforms.uOilImpact.value=oilImpact;
pbrUniforms.uOilImpactBrightness.value=SETTINGS.oilImpactBrightness;
pbrUniforms.uOilImpactSaturation.value=SETTINGS.oilImpactSaturation;
pbrUniforms.uOilImpactSpeed.value=SETTINGS.oilImpactSpeed;
pbrUniforms.uOilImpactStrength.value=SETTINGS.oilImpactStrength;
pbrUniforms.uOilIridescence.value=SETTINGS.oilIridescence;
pbrUniforms.uOilMix.value=SETTINGS.oilMix;
pbrUniforms.uOilSaturation.value=SETTINGS.oilSaturation;
pbrUniforms.uOilScale.value=SETTINGS.oilScale;
pbrUniforms.uOilShift.value=SETTINGS.oilShift;
pbrUniforms.uOilTime.value=oilElapsed;
}
pbrMaterial=new THREE.MeshStandardMaterial({color:0xffffff,roughness:1,metalness:0,transparent:true,depthWrite:true});
pbrMaterial.onBeforeCompile=function(shader){
 Object.assign(shader.uniforms,pbrUniforms);
 shader.uniforms.uPBRSmoothHand={value:this.userData.pbrSmoothHand?1:0};
 shader.uniforms.uPBRBind={value:this.userData.pbrBind||new THREE.Matrix4()};shader.uniforms.uPBRBindNormal={value:this.userData.pbrBindNormal||new THREE.Matrix3()};
 installGnRevealShader(shader,true);
 shader.vertexShader='varying vec3 vGnOilPos;varying vec3 vPBRPosition,vPBRNormal,vPBRView;uniform mat4 uPBRBind;uniform mat3 uPBRBindNormal;\n'+shader.vertexShader;
 shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvGnOilPos=transformed;vPBRPosition=(uPBRBind*vec4(position,1.0)).xyz;vPBRNormal=normalize(uPBRBindNormal*normal);');
 shader.vertexShader=shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nvPBRView=-mvPosition.xyz;');
 shader.fragmentShader=`
 varying vec3 vPBRPosition,vPBRNormal,vPBRView;
 uniform sampler2D uPBRColor,uPBRRough,uPBRNormal,uPBRHeight;
 uniform vec4 uPBRHas;
 uniform float uPBRSmoothHand;
 uniform float uPBRMatte,uPBRScale,uPBRNormalStrength,uPBRHeightStrength,uPBRRoughStrength,uPBRRotation;
 uniform vec2 uPBROffset;
uniform float uOilBrightness;
uniform float uOilEdgeRainbow;
uniform float uOilEnabled;
uniform float uOilFlowAmount;
uniform float uOilFlowScale;
uniform float uOilFlowSecondary;
uniform float uOilFlowSpeed;
uniform float uOilImpact;
uniform float uOilImpactBrightness;
uniform vec3 uOilImpactColorA;
uniform vec3 uOilImpactColorB;
uniform vec3 uOilImpactHighlight;
uniform float uOilImpactSaturation;
uniform float uOilImpactSpeed;
uniform float uOilImpactStrength;
uniform float uOilIridescence;
uniform float uOilMix;
uniform float uOilSaturation;
uniform float uOilScale;
uniform float uOilShift;
uniform float uOilTime;
        vec3 gnOilPalette(float t) {
            vec3 a = vec3(0.50);
            vec3 b = vec3(0.50);
            vec3 c = vec3(1.0);
            vec3 d = vec3(0.00, 0.33, 0.67);
            return a + b * cos(6.28318530718 * (c * t + d));
        }

        vec3 gnOilSaturation(vec3 c, float amount) {
            float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
            return mix(vec3(l), c, amount);
        }
 varying vec3 vGnOilPos;
 uniform float uPBRGlowTime,uPBRGlowEnabled,uPBRGlowStrength,uPBRGlowSpeed,uPBRGlowRainbow; uniform vec3 uPBRGlowTint;
 vec2 pbrUV(vec2 p){float c=cos(uPBRRotation),s=sin(uPBRRotation);return mat2(c,-s,s,c)*p*uPBRScale+uPBROffset;}
 vec3 pbrWeights(){vec3 w=pow(abs(normalize(vPBRNormal)),vec3(4.0));return w/max(dot(w,vec3(1.0)),.00001);}
 vec4 pbrSample(sampler2D map){vec3 w=pbrWeights();return texture2D(map,pbrUV(vPBRPosition.yz))*w.x+texture2D(map,pbrUV(vPBRPosition.zx))*w.y+texture2D(map,pbrUV(vPBRPosition.xy))*w.z;}
 // Derivative cotangent frames orient each normal projection to the actual surface.
 vec3 pbrMappedNormal(vec3 base,vec2 uv){
  vec3 q0=dFdx(-vPBRView),q1=dFdy(-vPBRView);
  vec2 st0=dFdx(uv),st1=dFdy(uv);
  vec3 q1perp=cross(q1,base),q0perp=cross(base,q0);
  vec3 T=q1perp*st0.x+q0perp*st1.x,B=q1perp*st0.y+q0perp*st1.y;
  float inv=inversesqrt(max(max(dot(T,T),dot(B,B)),1e-12));
  vec3 mapN=texture2D(uPBRNormal,uv).xyz*2.0-1.0;
  mapN.xy*=uPBRNormalStrength;
  return normalize(T*inv*mapN.x+B*inv*mapN.y+base*mapN.z);
 }
 vec3 pbrHeightNormal(vec3 base,float h){
  vec3 dx=dFdx(-vPBRView),dy=dFdy(-vPBRView);
  vec3 R1=cross(dy,base),R2=cross(base,dx);
  float det=dot(dx,R1);
  vec3 gradient=sign(det)*(dFdx(h)*R1+dFdy(h)*R2);
  return normalize(abs(det)*base-gradient);
 }
 `+shader.fragmentShader;
 shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
 float gnRoughness=roughnessFactor;
        if (uOilEnabled > 0.5) {
            vec3 gnN = normalize(normal);
            vec3 gnV = normalize(vPBRView);
            float gnFacing = clamp(1.0 - abs(dot(gnN, -gnV)), 0.0, 1.0);
            float gnFresnel = pow(gnFacing, 3.0);

            // Те же две flow-волны, что в материале колибри.
            float gnFlowA = sin(
                vGnOilPos.y * uOilFlowScale +
                vGnOilPos.x * uOilFlowScale * 0.55 +
                (uPBRGlowTime*uPBRGlowSpeed) * (uOilFlowSpeed + uOilImpact * uOilImpactSpeed) * 6.28318530718
            );
            float gnFlowB = sin(
                vGnOilPos.z * uOilFlowScale * 1.35 -
                vGnOilPos.x * uOilFlowScale * 0.35 -
                (uPBRGlowTime*uPBRGlowSpeed) * (uOilFlowSpeed + uOilImpact * uOilImpactSpeed * 0.72) * 4.39822971503
            );
            float gnFlow =
                (gnFlowA * 0.5 + gnFlowB * 0.5 * uOilFlowSecondary) *
                uOilFlowAmount;

            float gnIriPos =
                gnFacing * uOilScale +
                uOilShift +
                gnFlow;

            vec3 gnOil = mix(mix(uPBRGlowTint,vec3(.65,.04,.9),.5+.5*sin(gnIriPos*6.28)),gnOilPalette(gnIriPos),uPBRGlowRainbow);

            // В покое оставляем исходную бензиновую палитру.
            // Во время удара НЕ усиливаем rainbow — переводим её
            // в ту же blue/lilac гамму, что loading highlight.
            float gnImpactPhase =
                0.5 +
                0.5 *
                sin(
                    gnIriPos * 4.2 +
                    gnFlow * 0.55 +
                    (uPBRGlowTime*uPBRGlowSpeed) * 1.35
                );

            vec3 gnImpactPalette =
                mix(
                    uOilImpactColorA,
                    uOilImpactColorB,
                    gnImpactPhase
                );

            // Небольшой белый highlight, чтобы вспышка не стала плоской.
            float gnImpactHighlight =
                pow(
                    clamp(
                        gnFresnel + gnFacing * 0.32,
                        0.0,
                        1.0
                    ),
                    2.2
                );

            gnImpactPalette =
                mix(
                    gnImpactPalette,
                    uOilImpactHighlight,
                    gnImpactHighlight * 0.14
                );

            // 0.74 — заметно уводит impact в сине-сиреневый,
            // но сохраняет немного исходной "бензиновой" глубины.
            gnOil =
                mix(
                    gnOil,
                    gnImpactPalette,
                    uOilImpact * 0.74
                );

            float gnImpactSat =
                mix(
                    uOilSaturation,
                    max(
                        uOilSaturation,
                        0.72 + uOilImpactSaturation * 0.35
                    ),
                    uOilImpact
                );

            float gnImpactBrightness =
                1.0 +
                uOilImpactBrightness *
                uOilImpact;

            gnOil =
                gnOilSaturation(
                    gnOil,
                    gnImpactSat
                ) *
                uOilBrightness *
                gnImpactBrightness;

            float gnEdge =
                pow(gnFacing, 2.8) *
                (uOilEdgeRainbow +
                 uOilImpact * uOilImpactStrength * 1.2);

            float gnStrength = clamp(
                uOilMix *
                    (uOilIridescence +
                     gnFresnel * 0.55 +
                     gnEdge * 0.20) +
                uOilImpact * uOilImpactStrength,
                0.0,
                1.0
            );

            vec3 gnOilSurface =
                outgoingLight * mix(vec3(0.72), gnOil * 1.22, 0.72) +
                gnOil * gnEdge * 0.18;

            outgoingLight = mix(outgoingLight, gnOilSurface, clamp(mix(gnStrength*uPBRGlowStrength,gnStrength,uOilImpact),0.0,1.0));
        }
 #include <opaque_fragment>`);
 shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
 if(uPBRHas.x>.5)diffuseColor.rgb*=pbrSample(uPBRColor).rgb;`);
 shader.fragmentShader=shader.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>
 if(uPBRHas.y>.5)roughnessFactor*=mix(1.0,pbrSample(uPBRRough).g,uPBRRoughStrength);
 roughnessFactor=max(roughnessFactor,uPBRMatte);`);
 shader.fragmentShader=shader.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>
 vec3 pbrBaseNormal=normal;
 if(uPBRSmoothHand<.5&&uPBRHas.z>.5){vec3 w=pbrWeights();normal=normalize(pbrMappedNormal(pbrBaseNormal,pbrUV(vPBRPosition.yz))*w.x+pbrMappedNormal(pbrBaseNormal,pbrUV(vPBRPosition.zx))*w.y+pbrMappedNormal(pbrBaseNormal,pbrUV(vPBRPosition.xy))*w.z);}
 if(uPBRSmoothHand<.5&&uPBRHas.w>.5&&uPBRHeightStrength>0.0)normal=pbrHeightNormal(normal,pbrSample(uPBRHeight).r*uPBRHeightStrength);`);
};
pbrMaterial.customProgramCacheKey=()=> 'gn-pbr-triplanar-v1';
pbrAmbient=new THREE.HemisphereLight(0xffffff,0x777777,SETTINGS.lightingAmbient*2);scene.add(pbrAmbient);
function registerPBRMesh(mesh){
 if(!pbrMaterial||pbrMeshes.includes(mesh))return;
 pbrMeshes.push(mesh);
 model.updateWorldMatrix(true,false);mesh.updateWorldMatrix(true,false);
 mesh.userData.pbrBind=new THREE.Matrix4().copy(model.matrixWorld).invert().multiply(mesh.matrixWorld);
 mesh.userData.pbrBindNormal=new THREE.Matrix3().getNormalMatrix(mesh.userData.pbrBind);
 const material=pbrMaterial.clone();material.onBeforeCompile=pbrMaterial.onBeforeCompile;material.customProgramCacheKey=pbrMaterial.customProgramCacheKey;
 material.userData.pbrBind=mesh.userData.pbrBind;material.userData.pbrBindNormal=mesh.userData.pbrBindNormal;
 material.userData.pbrSmoothHand=!!mesh.userData.pbrSmoothHand;
 const beard=/beard/i.test(mesh.name);material.polygonOffset=beard;material.polygonOffsetFactor=beard?-1:0;material.polygonOffsetUnits=beard?-1:0;
 mesh.userData.pbrMaterial=material;

 mesh.castShadow=true;mesh.receiveShadow=true;
 mesh.material=SETTINGS.modelMaterialMode===2?mesh.userData.pbrMaterial:headMatcapMaterial;
}
scene.traverse(mesh=>{if(mesh.isMesh&&mesh.material===headMatcapMaterial)registerPBRMesh(mesh);});
function syncPBRMaterial(){
 if(!pbrMaterial)return;
 const enabled=SETTINGS.modelMaterialMode===2;
 pbrUniforms.uPBRGlowEnabled.value=SETTINGS.oilEnabled?1:0;
 for(const light of [earringAmbientLight,earringKeyLight,earringFillLight])if(light)light.visible=!enabled;
 pbrMeshes.forEach(mesh=>{mesh.material=enabled?mesh.userData.pbrMaterial:headMatcapMaterial;});
 pbrAmbient.visible=enabled;pbrAmbient.intensity=SETTINGS.lightingAmbient*2;
 pbrMaterial.color.set(SETTINGS.modelColor).multiplyScalar(SETTINGS.modelBrightness);
 pbrMaterial.metalness=THREE.MathUtils.clamp(SETTINGS.modelMetalness,0,1);
 pbrMaterial.roughness=THREE.MathUtils.clamp(Math.max(SETTINGS.modelRoughness,SETTINGS.modelMatte),.04,1);
 pbrMeshes.forEach(mesh=>{const mat=mesh.userData.pbrMaterial;mat.color.copy(pbrMaterial.color);mat.metalness=pbrMaterial.metalness;mat.roughness=pbrMaterial.roughness;});
 pbrUniforms.uPBRMatte.value=SETTINGS.modelMatte;
 pbrUniforms.uPBRScale.value=SETTINGS.pbrScale;
 pbrUniforms.uPBRNormalStrength.value=SETTINGS.pbrNormalStrength;
 pbrUniforms.uPBRHeightStrength.value=SETTINGS.pbrHeightStrength;
 pbrUniforms.uPBRRoughStrength.value=SETTINGS.pbrRoughnessMapStrength;
 pbrUniforms.uPBRRotation.value=SETTINGS.pbrRotation;
 pbrUniforms.uPBROffset.value.set(SETTINGS.pbrOffsetX,SETTINGS.pbrOffsetY);
 const slots=['color','roughness','normal','height'],uniforms=['uPBRColor','uPBRRough','uPBRNormal','uPBRHeight'];
 slots.forEach((key,i)=>{pbrUniforms[uniforms[i]].value=pbrMaps[key]||pbrFallback;pbrUniforms.uPBRHas.value.setComponent(i,pbrMaps[key]?1:0);});
}
async function loadPBRMap(role,url,name){
 if(!['color','roughness','normal','height'].includes(role))throw new Error('Unknown PBR map');
 const texture=await textureLoader.loadAsync(url);
 texture.colorSpace=role==='color'?THREE.SRGBColorSpace:THREE.NoColorSpace;
 texture.wrapS=texture.wrapT=THREE.RepeatWrapping;
 texture.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
 pbrMaps[role]?.dispose();pbrMaps[role]=texture;pbrMapData[role]={name,url};
 syncPBRMaterial();
}
syncPBRMaterial();

async function loadFinalMaterial(){
 const response=await fetch('https://sonsam240.github.io/tilda/releases/v4/src/final-material-settings.json');
 if(!response.ok)throw new Error('Не удалось загрузить настройки материала');
 const config=await response.json();
 for(const [key,value] of Object.entries(config.settings)){
  if(!Object.prototype.hasOwnProperty.call(SETTINGS,key))continue;
  const type=typeof SETTINGS[key];
  if(type==='number'&&typeof value==='number'&&Number.isFinite(value))SETTINGS[key]=value;
  else if(type==='boolean'&&typeof value==='boolean')SETTINGS[key]=value;
  else if(type==='string'&&typeof value==='string'&&/^#[0-9a-f]{6}$/i.test(value))SETTINGS[key]=value;
 }
 await Promise.all(Object.entries(config.maps).map(([role,map])=>loadPBRMap(role,map.url,map.name)));
 camera.zoom=Math.max(.5,Math.min(4,SETTINGS.modelZoom));camera.updateProjectionMatrix();
 syncModelSmoothing();updateHeadMaterialUniforms();updateEyeWhiteUniforms();pupilMaterial.color.set(SETTINGS.eyePupilColor);
 updateEarringMaterial();updateEarringGeometry();updateEarringTransform();
 updateGnRevealUniformSettings();syncGnRevealPalette();syncPBRMaterial();syncGroundShadow();
 headRig.position.y=SETTINGS.modelOffsetY;headRig.updateMatrixWorld(true);
 groundShadowBounds.setFromObject(model);
 gnRevealState.p=SETTINGS.revealEnabled?0:1;syncGroundShadow();
 // Compile before starting the clock: the first visible frame has its PBR shader ready.
 if(renderer.compileAsync)await renderer.compileAsync(scene,camera);else renderer.compile(scene,camera);
 document.documentElement.dataset.modelMaterialReady='true';
}
await loadFinalMaterial();

window.GN_GLOW={get(){return {enabled:pbrUniforms.uPBRGlowEnabled.value>0,strength:pbrUniforms.uPBRGlowStrength.value,speed:pbrUniforms.uPBRGlowSpeed.value,rainbow:pbrUniforms.uPBRGlowRainbow.value,tint:'#'+pbrUniforms.uPBRGlowTint.value.getHexString(),brightness:SETTINGS.oilBrightness,saturation:SETTINGS.oilSaturation,impactStrength:SETTINGS.oilImpactStrength,impactBrightness:SETTINGS.oilImpactBrightness,impactDuration:SETTINGS.oilImpactDuration,impactSpeed:SETTINGS.oilImpactSpeed,impactSaturation:SETTINGS.oilImpactSaturation};},set(v){for(const [key,name] of Object.entries({brightness:'oilBrightness',saturation:'oilSaturation',impactStrength:'oilImpactStrength',impactBrightness:'oilImpactBrightness',impactDuration:'oilImpactDuration',impactSpeed:'oilImpactSpeed',impactSaturation:'oilImpactSaturation'}))if(Number.isFinite(v[key]))SETTINGS[name]=Math.max(key==='impactDuration'?.05:0,Math.min(4,v[key]));for(const [key,name] of Object.entries({strength:'uPBRGlowStrength',speed:'uPBRGlowSpeed',rainbow:'uPBRGlowRainbow'}))if(Number.isFinite(v[key]))pbrUniforms[name].value=Math.max(0,Math.min(key==='rainbow'?1:4,v[key]));if(/^#[0-9a-f]{6}$/i.test(v.tint||''))pbrUniforms.uPBRGlowTint.value.set(v.tint);if(typeof v.enabled==='boolean'){SETTINGS.oilEnabled=v.enabled;pbrUniforms.uPBRGlowEnabled.value=v.enabled?1:0;}}};
window.dispatchEvent(new Event('gn:glow-ready'));


if(window.MD_FINISH_LOAD)await window.MD_FINISH_LOAD();

// First page load: close eyelids BEFORE the reveal starts.
if (SETTINGS.revealEnabled) {
    gnRevealBeforeReplay();
    replayGnReveal();
} else {
    setRevealEyeballsVisible(true);
    formGnReveal();

    requestAnimationFrame(() => {
        startDeferredInteractionAssets();
    });
}


function enterScriptedBlinkMode() {
    clearTimeout(
        blinkTimer
    );

    blinkTimer = null;
    blinkPlaying = false;

    if (blinkAction) {
        blinkAction.stop();
    }

    // Сразу применяем текущий keyframe blinkPose.
    // Дальше updateCharacterKeyframeControls() будет обновлять
    // Natural_Blink каждый кадр вместе с движением головы/рук.
    applyManualBlinkPose();
}

function leaveScriptedBlinkMode() {
    blinkPlaying = false;

    if (
        SETTINGS.autoBlinkEnabled &&
        !document.hidden
    ) {
        scheduleBlink();
    }
}


function randomBlinkDelay() {
    return THREE.MathUtils.randFloat(
        SETTINGS.blinkMinDelay,
        SETTINGS.blinkMaxDelay
    ) * 1000;
}

function scheduleBlink() {
    clearTimeout(blinkTimer);
    blinkTimer = null;

    if (
        !SETTINGS.autoBlinkEnabled ||
        characterKeyframePlaying ||
        headDeparture ||
        !blinkAction ||
        document.hidden
    ) {
        return;
    }

    blinkTimer =
        setTimeout(
            playBlink,
            randomBlinkDelay()
        );
}

function playBlink() {
    blinkTimer = null;
    if (
        !SETTINGS.autoBlinkEnabled ||
        characterKeyframePlaying ||
        headDeparture
    ) {
        return;
    }

    if (
        !blinkAction ||
        blinkPlaying ||
        document.hidden
    ) {
        scheduleBlink();
        return;
    }

    blinkPlaying = true;

    // Для auto blink переключаемся на полный open->close->open clip.
    if (
        autoBlinkClip &&
        blinkAction.getClip() !== autoBlinkClip
    ) {
        blinkAction.stop();

        blinkAction =
        blinkMixer.clipAction(
                autoBlinkClip
            );
    }

    blinkAction.stop();
    blinkAction.reset();
    blinkAction.enabled = true;
    blinkAction.paused = false;
    blinkAction.timeScale =
        SETTINGS.blinkTimeScale;

    blinkAction.setEffectiveWeight(1);

    blinkAction.setLoop(
        THREE.LoopOnce,
        1
    );

    blinkAction.clampWhenFinished =
        false;

    blinkAction.play();

    const onFinished =
        event => {
            if (
                event.action !==
                blinkAction
            ) {
                return;
            }

            blinkMixer.removeEventListener(
                'finished',
                onFinished
            );

            blinkAction.stop();
            blinkAction.reset();

            blinkPlaying = false;

            scheduleBlink();
        };

    blinkMixer.addEventListener(
        'finished',
        onFinished
    );
}

/* =========================================================
   EYE FOLLOW — ВРАЩАЕМ ИМЕННО GAZE
========================================================= */

let targetHeadRotX = 0;
let targetHeadRotY = 0;

let currentHeadRotX = 0;
let currentHeadRotY = 0;

let targetRotX =
    (
        SETTINGS.rotXMin +
        SETTINGS.rotXMax
    ) / 2;

let targetRotY = 0;

let currentRotX =
    targetRotX;

let currentRotY = 0;

function updateEyeTarget(
    clientX,
    clientY
) {
    if (
        !SETTINGS.eyeFollowEnabled &&
        !SETTINGS.headFollowEnabled
    ) {
        return;
    }

    const width =
        Math.max(
            1,
            window.innerWidth
        );

    const height =
        Math.max(
            1,
            window.visualViewport
                ? window.visualViewport.height
                : window.innerHeight
        );

    const normalizedX =
        THREE.MathUtils.clamp(
            clientX / width,
            0,
            1
        );

    const normalizedY =
        THREE.MathUtils.clamp(
            clientY / height,
            0,
            1
        );

    if (SETTINGS.eyeFollowEnabled) {
        targetRotX =
            THREE.MathUtils.lerp(
                SETTINGS.rotXMin,
                SETTINGS.rotXMax,
                normalizedY
            );

        targetRotY =
            THREE.MathUtils.lerp(
                SETTINGS.rotYMin,
                SETTINGS.rotYMax,
                normalizedX
            );
    }

    // Глаза продолжают следить за курсором.
    // Вращение головы пока отключено отдельным флагом.
    if (SETTINGS.headFollowEnabled) {
        const centeredX =
            normalizedX - 0.5;

        const centeredY =
            normalizedY - 0.5;

        targetHeadRotY =
            THREE.MathUtils.clamp(
                centeredX * SETTINGS.headFollowX,
                -SETTINGS.maxHeadRotateY,
                SETTINGS.maxHeadRotateY
            );

        targetHeadRotX =
            THREE.MathUtils.clamp(
                centeredY * SETTINGS.headFollowY,
                -SETTINGS.maxHeadRotateX,
                SETTINGS.maxHeadRotateX
            );
    } else {
        targetHeadRotX = 0;
        targetHeadRotY = 0;
    }
}

function centerEyes() {
    targetRotX =
        SETTINGS.eyeFollowEnabled
            ? (
                SETTINGS.rotXMin +
                SETTINGS.rotXMax
            ) / 2
            : SETTINGS.eyeAnimRotX;

    targetRotY =
        SETTINGS.eyeFollowEnabled
            ? 0
            : SETTINGS.eyeAnimRotY;

    currentRotX = targetRotX;
    currentRotY = targetRotY;

    targetHeadRotX = 0;
    targetHeadRotY = 0;
}

window.addEventListener(
    'pointermove',
    event => {
        const overHead=window.MD_MODEL_INTERACTIVE&&isCharacterTap(event.clientX,event.clientY);
        document.documentElement.classList.toggle('md-head-hover',!!overHead);
        if(!window.MD_MODEL_INTERACTIVE)return;
        updateEyeTarget(
            event.clientX,
            event.clientY
        );
    },
    {
        passive: true
    }
);

window.addEventListener(
    'blur',
    centerEyes
);

document.addEventListener(
    'mouseout',
    event => {
        if (!event.relatedTarget) {
            centerEyes();
        }
    }
);



/* =========================================================
   STICKERS ON MODEL — CURVED PATCH + BVH
   Маленькая сетка стикера проецируется на поверхность головы.
   Никакого SimplifyModifier и никакого обхода всей головы через
   DecalGeometry на каждый клик.
========================================================= */

const stickerRaycaster = new THREE.Raycaster();
const stickerProjectRaycaster = new THREE.Raycaster();

// three-mesh-bvh: возвращаем только ближайшее попадание.
// Для curved patch это особенно важно — на один стикер идёт
// несколько коротких лучей, и нам везде нужен только первый hit.
stickerRaycaster.firstHitOnly = true;
stickerProjectRaycaster.firstHitOnly = true;
const stickerPointer = new THREE.Vector2();
const activeStickers = [];

const stickerWorldNormal = new THREE.Vector3();
const stickerNormalMatrix = new THREE.Matrix3();
const stickerTangent = new THREE.Vector3();
const stickerBitangent = new THREE.Vector3();
const stickerRefAxis = new THREE.Vector3();
const stickerSamplePoint = new THREE.Vector3();
const stickerRayOrigin = new THREE.Vector3();
const stickerRayDirection = new THREE.Vector3();
const stickerProjectedPoint = new THREE.Vector3();
const stickerProjectedNormal = new THREE.Vector3();
const stickerProjectedNormalMatrix = new THREE.Matrix3();
const stickerHeadWorldScale = new THREE.Vector3();

let lastStickerTextureIndex = -1;

function randomStickerTexture() {
    if (stickerTextures.length <= 1) {
        lastStickerTextureIndex = 0;
        return stickerTextures[0];
    }

    let index;

    do {
        index =
            Math.floor(
                Math.random() *
                stickerTextures.length
            );
    } while (
        index === lastStickerTextureIndex
    );

    lastStickerTextureIndex = index;
    return stickerTextures[index];
}

function createSmokeStickerMaterial(texture, localMaskTexture = null) {
    return new THREE.ShaderMaterial({
        uniforms: {
            uMap: { value: texture },
            uLocalMask: { value: localMaskTexture },
            uHasLocalMask: { value: localMaskTexture ? 1 : 0 },
            uTime: { value: 0 },
            uDissolve: { value: 0 },
            uOpacity: { value: SETTINGS.stickerOpacity },
            uBrightness: { value: SETTINGS.stickerBrightness },
            uSaturation: { value: SETTINGS.stickerSaturation },
            uContrast: { value: SETTINGS.stickerContrast },
            uSmokeIntensity: { value: SETTINGS.stickerSmokeIntensity }
        },

        vertexShader: `
            varying vec2 vUv;

            void main() {
                vUv = uv;

                gl_Position =
                    projectionMatrix *
                    modelViewMatrix *
                    vec4(position, 1.0);
            }
        `,

        fragmentShader: `
            uniform sampler2D uMap;
            uniform sampler2D uLocalMask;
            uniform float uHasLocalMask;
            uniform float uTime;
            uniform float uDissolve;
            uniform float uOpacity;
            uniform float uBrightness;
            uniform float uSaturation;
            uniform float uContrast;
            uniform float uSmokeIntensity;

            varying vec2 vUv;

            float smokeHash(vec2 p) {
                return fract(
                    sin(dot(p, vec2(127.1, 311.7))) *
                    43758.5453123
                );
            }

            float smokeNoise(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);

                return mix(
                    mix(
                        smokeHash(i),
                        smokeHash(i + vec2(1.0, 0.0)),
                        f.x
                    ),
                    mix(
                        smokeHash(i + vec2(0.0, 1.0)),
                        smokeHash(i + vec2(1.0, 1.0)),
                        f.x
                    ),
                    f.y
                );
            }

            float smokeFbm(vec2 p) {
                float value = 0.0;
                float amplitude = 0.5;

                for (int i = 0; i < 5; i++) {
                    value += amplitude * smokeNoise(p);
                    p = p * 2.03 + 17.17;
                    amplitude *= 0.5;
                }

                return value;
            }

            void main() {
                vec4 tex = texture2D(uMap, vUv);

                if (tex.a < 0.01) {
                    discard;
                }

                vec2 fogUv = vUv - 0.5;

                float n1 =
                    smokeFbm(
                        fogUv * 2.75 +
                        vec2(
                            uTime * 0.12,
                            uTime * -0.09
                        )
                    );

                float n2 =
                    smokeFbm(
                        fogUv * 6.20 +
                        vec2(
                            uTime * -0.16,
                            uTime * 0.13
                        ) +
                        n1 * 0.7
                    );

                float n3 =
                    smokeFbm(
                        fogUv * 12.0 +
                        vec2(uTime * 0.08)
                    );

                float field =
                    n1 * 0.56 +
                    n2 * 0.29 +
                    n3 * 0.15;

                field +=
                    (vUv.y - 0.5) * 0.10;

                float threshold =
                    mix(
                        -0.10,
                        1.10,
                        clamp(uDissolve, 0.0, 1.0)
                    );

                float transitionWidth = 0.065;

                float smokeMask =
                    smoothstep(
                        threshold - transitionWidth,
                        threshold + transitionWidth,
                        field
                    );

                /*
                 * HIGH-RES LOCAL MASK:
                 * Запретная зона больше НЕ хранится на вершинах patch.
                 * Она запечена в отдельную 128x128 texture и поэтому
                 * считается в fragment shader на каждом пикселе.
                 */
                float maskBase = 1.0;

                if (uHasLocalMask > 0.5) {
                    maskBase = texture2D(
                        uLocalMask,
                        vUv
                    ).r;
                }

                // Дым слегка разъедает только мягкую границу маски.
                // Внутри разрешённой области остаётся 1, внутри block — 0.
                float edgeNoise =
                    (field - 0.5) * 0.18 * uSmokeIntensity;

                float maskAlpha =
                    smoothstep(
                        0.08,
                        0.92,
                        maskBase + edgeNoise
                    );

                float alpha =
                    tex.a *
                    smokeMask *
                    maskAlpha *
                    uOpacity;

                if (alpha < 0.01) {
                    discard;
                }

                vec3 stickerColor = tex.rgb;
                float luma = dot(stickerColor, vec3(0.2126, 0.7152, 0.0722));
                stickerColor = mix(vec3(luma), stickerColor, uSaturation);
                stickerColor = (stickerColor - 0.5) * uContrast + 0.5;
                stickerColor *= uBrightness;

                gl_FragColor =
                    vec4(stickerColor, alpha);
            }
        `,

        transparent: true,
        depthTest: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        toneMapped: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
        polygonOffsetUnits: -4
    });
}


async function warmupStickerPipeline() {
    if (
        typeof renderer.initTexture ===
        'function'
    ) {
        stickerTextures.forEach(texture => {
            try {
                renderer.initTexture(texture);
            } catch (error) {
                console.warn(
                    '[GN HEAD] sticker texture warmup:',
                    error
                );
            }
        });
    }

    const warmupGeometry =
        new THREE.PlaneGeometry(0.01, 0.01);

    const warmupMeshes = [];

    stickerTextures.forEach(texture => {
        const material =
            createSmokeStickerMaterial(texture);

        const mesh =
            new THREE.Mesh(
                warmupGeometry,
                material
            );

        mesh.position.set(10000, 10000, 10000);
        scene.add(mesh);
        warmupMeshes.push(mesh);
    });

    if (typeof renderer.compileAsync === 'function') {
        await renderer.compileAsync(scene, camera);
    } else {
        renderer.compile(scene, camera);
    }
    renderer.render(scene, camera);

    warmupMeshes.forEach(mesh => {
        mesh.removeFromParent();
        mesh.material.dispose();
    });

    warmupGeometry.dispose();
}

function removeSticker(sticker) {
    const index =
        activeStickers.indexOf(sticker);

    if (index !== -1) {
        activeStickers.splice(index, 1);
    }

    if (!sticker.mesh) return;

    sticker.mesh.removeFromParent();

    const localMaskTexture =
        sticker.mesh.geometry?.userData?.localMaskTexture;

    localMaskTexture?.dispose();
    sticker.mesh.geometry?.dispose();
    sticker.mesh.material?.dispose();
    sticker.mesh = null;
}


function clearAllStickers() {
    // 1) Нормально удаляем всё, что зарегистрировано в activeStickers.
    [...activeStickers].forEach(
        sticker => {
            removeSticker(
                sticker
            );
        }
    );

    activeStickers.length = 0;

    // 2) Страховочная жёсткая очистка.
    // Если какой-то sticker-mesh остался в headRig,
    // но по какой-то причине уже выпал из activeStickers,
    // всё равно удаляем его из сцены.
    const orphanStickerMeshes = [];

    headRig.traverse(
        obj => {
            if (
                obj?.isMesh &&
                obj.name ===
                    'GN_Click_CurvedPatch_Sticker'
            ) {
                orphanStickerMeshes.push(
                    obj
                );
            }
        }
    );

    orphanStickerMeshes.forEach(
        mesh => {
            mesh.removeFromParent();

            const localMaskTexture =
                mesh.geometry
                    ?.userData
                    ?.localMaskTexture;

            localMaskTexture?.dispose();
            mesh.geometry?.dispose();

            if (
                Array.isArray(
                    mesh.material
                )
            ) {
                mesh.material.forEach(
                    material => {
                        material?.dispose();
                    }
                );
            } else {
                mesh.material?.dispose();
            }
        }
    );

    console.log(
        '[GN HEAD] stickers cleared'
    );
}

function blurMaskPixels(source, width, height, radius = 2) {
    if (radius <= 0) return source;

    let src = source;
    let dst = new Float32Array(source.length);

    // Два separable box-pass дают мягкую границу без заметной сетки.
    for (let pass = 0; pass < 2; pass++) {
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let count = 0;

                for (let k = -radius; k <= radius; k++) {
                    const sx = Math.max(0, Math.min(width - 1, x + k));
                    sum += src[y * width + sx];
                    count++;
                }

                dst[y * width + x] = sum / count;
            }
        }

        [src, dst] = [dst, src];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let sum = 0;
                let count = 0;

                for (let k = -radius; k <= radius; k++) {
                    const sy = Math.max(0, Math.min(height - 1, y + k));
                    sum += src[sy * width + x];
                    count++;
                }

                dst[y * width + x] = sum / count;
            }
        }

        [src, dst] = [dst, src];
    }

    return src;
}

function createStickerLocalMaskTexture(maskCoords, segments) {
    const size = Math.max(
        64,
        Math.min(
            256,
            Math.round(
                SETTINGS.stickerMaskTextureSize || 128
            )
        )
    );

    const stride = segments + 1;

    // Query the same spatial index for click filtering and texture baking.
    const maskSample = { x: 0, y: 0, z: 0 };
    function sampleAllowed(x, y, z) {
        maskSample.x = x; maskSample.y = y; maskSample.z = z;
        return getMaskNormalizedAllowed(maskSample) === true ? 1 : 0;
    }

    const values = new Float32Array(size * size);

    for (let py = 0; py < size; py++) {
        const v = py / (size - 1);
        const gy = v * segments;
        const iy = Math.min(segments - 1, Math.floor(gy));
        const fy = gy - iy;

        for (let px = 0; px < size; px++) {
            const u = px / (size - 1);
            const gx = u * segments;
            const ix = Math.min(segments - 1, Math.floor(gx));
            const fx = gx - ix;

            const i00 = (iy * stride + ix) * 3;
            const i10 = (iy * stride + ix + 1) * 3;
            const i01 = ((iy + 1) * stride + ix) * 3;
            const i11 = ((iy + 1) * stride + ix + 1) * 3;

            const ax = maskCoords[i00] * (1 - fx) + maskCoords[i10] * fx;
            const ay = maskCoords[i00 + 1] * (1 - fx) + maskCoords[i10 + 1] * fx;
            const az = maskCoords[i00 + 2] * (1 - fx) + maskCoords[i10 + 2] * fx;

            const bx = maskCoords[i01] * (1 - fx) + maskCoords[i11] * fx;
            const by = maskCoords[i01 + 1] * (1 - fx) + maskCoords[i11 + 1] * fx;
            const bz = maskCoords[i01 + 2] * (1 - fx) + maskCoords[i11 + 2] * fx;

            const nx = ax * (1 - fy) + bx * fy;
            const ny = ay * (1 - fy) + by * fy;
            const nz = az * (1 - fy) + bz * fy;

            values[py * size + px] =
                sampleAllowed(nx, ny, nz);
        }
    }

    const blurred = blurMaskPixels(
        values,
        size,
        size,
        Math.max(
            0,
            Math.round(
                SETTINGS.stickerMaskBlurRadius || 2
            )
        )
    );

    const data = new Uint8Array(size * size * 4);

    for (let i = 0; i < blurred.length; i++) {
        const value = Math.round(
            THREE.MathUtils.clamp(
                blurred[i],
                0,
                1
            ) * 255
        );

        const di = i * 4;
        data[di] = value;
        data[di + 1] = value;
        data[di + 2] = value;
        data[di + 3] = 255;
    }

    const texture = new THREE.DataTexture(
        data,
        size,
        size,
        THREE.RGBAFormat,
        THREE.UnsignedByteType
    );

    texture.flipY = false;
    texture.colorSpace = THREE.NoColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;

    return texture;
}

function buildCurvedStickerGeometry(hit,size,roll,aspect=1){
 const target=hit.object;target.updateWorldMatrix(true,false);
 const matrix=target.matrixWorld,normalMatrix=new THREE.Matrix3().getNormalMatrix(matrix);
 const normal=hit.face.normal.clone().applyMatrix3(normalMatrix).normalize();
 const tangent=new THREE.Vector3().crossVectors(Math.abs(normal.y)<.92?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0),normal).normalize();
 const bitangent=new THREE.Vector3().crossVectors(normal,tangent).normalize();
 const tx=tangent.clone();tangent.multiplyScalar(Math.cos(roll)).addScaledVector(bitangent,Math.sin(roll));bitangent.multiplyScalar(Math.cos(roll)).addScaledVector(tx,-Math.sin(roll));
 const basis=new THREE.Matrix4().makeBasis(tangent,bitangent,normal).setPosition(hit.point),inverse=basis.clone().invert(),meshInverse=matrix.clone().invert();
 const width=size*Math.max(1,aspect),height=size/Math.min(1,aspect),depth=size*.35;
 const positions=[],uvs=[],attachments=[],va=new THREE.Vector3(),vb=new THREE.Vector3(),vc=new THREE.Vector3();
 const geometry=target.geometry,index=geometry.index,count=index?index.count:geometry.attributes.position.count;
 const planes=[[0,width*.5,1],[0,width*.5,-1],[1,height*.5,1],[1,height*.5,-1],[2,depth,1],[2,depth,-1]];
 function clip(vertices,axis,limit,sign){const output=[];for(let i=0;i<vertices.length;i++){const from=vertices[i],to=vertices[(i+1)%vertices.length],d0=limit-sign*from.p.getComponent(axis),d1=limit-sign*to.p.getComponent(axis);if(d0>=0)output.push(from);if((d0>=0)!==(d1>=0)){const t=d0/(d0-d1);output.push({p:from.p.clone().lerp(to.p,t),bary:from.bary.clone().lerp(to.bary,t)});}}return output;}
 for(let i=0;i<count;i+=3){
  const ia=index?index.getX(i):i,ib=index?index.getX(i+1):i+1,ic=index?index.getX(i+2):i+2;
  target.getVertexPosition(ia,va);target.getVertexPosition(ib,vb);target.getVertexPosition(ic,vc);
  const world=[va,vb,vc].map(v=>v.clone().applyMatrix4(matrix));
  const faceNormal=new THREE.Vector3().crossVectors(world[1].clone().sub(world[0]),world[2].clone().sub(world[0])).normalize();
  if(faceNormal.dot(normal)<.15)continue;
  let polygon=world.map((point,j)=>({p:point.applyMatrix4(inverse),bary:new THREE.Vector3(j===0?1:0,j===1?1:0,j===2?1:0)}));
  for(const plane of planes){polygon=clip(polygon,...plane);if(polygon.length<3)break;}
  if(polygon.length<3)continue;
  for(let j=1;j<polygon.length-1;j++)for(const vertex of [polygon[0],polygon[j],polygon[j+1]]){
   const local=vertex.p.clone().applyMatrix4(basis).addScaledVector(faceNormal,SETTINGS.stickerSurfaceOffset||.004).applyMatrix4(meshInverse);
   positions.push(local.x,local.y,local.z);uvs.push(vertex.p.x/width+.5,vertex.p.y/height+.5);attachments.push({a:ia,b:ib,c:ic,bary:vertex.bary});
  }
 }
 const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));result.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));result.computeVertexNormals();result.computeBoundingSphere();result.userData.surfaceMesh=target;result.userData.attachments=attachments;return result;
}

function createStickerOnHit(hit) {
    if (!hit?.object || !hit.face) return;

    const size =
        SETTINGS.stickerSize *
        THREE.MathUtils.randFloat(
            0.90,
            1.10
        );

    const roll =
        THREE.MathUtils.randFloat(
            -0.40,
            0.40
        );

    const geometry =
        buildCurvedStickerGeometry(
            hit,
            size,
            roll
        );

    if(!geometry.attributes.position.count){geometry.dispose();return;}

    const material =
        createSmokeStickerMaterial(
            randomStickerTexture(),
            geometry.userData.localMaskTexture || null
        );

    const mesh =
        new THREE.Mesh(
            geometry,
            material
        );

    mesh.name =
        'GN_Click_CurvedPatch_Sticker';

    mesh.renderOrder = 10000;
    mesh.frustumCulled = false;

    hit.object.add(mesh);

    const sticker = {
        mesh,
        age: 0,
        life: SETTINGS.stickerLife,
        holdTime: SETTINGS.stickerHoldTime,
        dissolveDuration:
            SETTINGS.stickerDissolveDuration,
        timeOffset:
            Math.random() * 20
    };

    activeStickers.push(sticker);

    while (
        activeStickers.length >
        SETTINGS.stickerMaxCount
    ) {
        removeSticker(activeStickers[0]);
    }
}

function updateStickerSurface(sticker){
 const geometry=sticker.mesh.geometry,target=geometry.userData.surfaceMesh;
 if(!target || (!target.isSkinnedMesh&&!target.morphTargetInfluences))return;
 const position=geometry.attributes.position,va=new THREE.Vector3(),vb=new THREE.Vector3(),vc=new THREE.Vector3(),normal=new THREE.Vector3(),edge=new THREE.Vector3(),point=new THREE.Vector3();
 const scale=target.getWorldScale(new THREE.Vector3()),offset=(SETTINGS.stickerSurfaceOffset||.004)/Math.max(.001,Math.min(scale.x,scale.y,scale.z));
 geometry.userData.attachments.forEach((binding,i)=>{if(!binding)return;target.getVertexPosition(binding.a,va);target.getVertexPosition(binding.b,vb);target.getVertexPosition(binding.c,vc);normal.crossVectors(edge.subVectors(vb,va),point.subVectors(vc,va)).normalize();point.copy(va).multiplyScalar(binding.bary.x).addScaledVector(vb,binding.bary.y).addScaledVector(vc,binding.bary.z).addScaledVector(normal,offset);position.setXYZ(i,point.x,point.y,point.z);});
 position.needsUpdate=true;geometry.computeVertexNormals();
}
function updateStickers(delta) {
    for (
        let i = activeStickers.length - 1;
        i >= 0;
        i--
    ) {
        const sticker =
            activeStickers[i];
        updateStickerSurface(sticker);

        sticker.age += delta;

        const mesh =
            sticker.mesh;

        if (!mesh) {
            activeStickers.splice(i, 1);
            continue;
        }

        const uniforms =
            mesh.material.uniforms;

        uniforms.uTime.value =
            sticker.age +
            sticker.timeOffset;

        mesh.scale.setScalar(1);

        uniforms.uOpacity.value = SETTINGS.stickerOpacity;
        uniforms.uBrightness.value = SETTINGS.stickerBrightness;
        uniforms.uSaturation.value = SETTINGS.stickerSaturation;
        uniforms.uContrast.value = SETTINGS.stickerContrast;
        uniforms.uSmokeIntensity.value = SETTINGS.stickerSmokeIntensity;

        if (
            sticker.age >
            sticker.holdTime
        ) {
            const p =
                THREE.MathUtils.clamp(
                    (
                        sticker.age -
                        sticker.holdTime
                    ) /
                    sticker.dissolveDuration,
                    0,
                    1
                );

            const smooth =
                p * p * (3 - 2 * p);

            uniforms.uDissolve.value =
                smooth;
        } else {
            uniforms.uDissolve.value = 0;
        }

        if (
            sticker.age >=
            sticker.life
        ) {
            removeSticker(sticker);
        }
    }
}



function getNormalizedHeadPoint(worldPoint) {
    if (
        !headMesh ||
        !headLocalBounds
    ) {
        return null;
    }

    const p =
        headMesh.worldToLocal(
            worldPoint.clone()
        );

    const min =
        headLocalBounds.min;

    const max =
        headLocalBounds.max;

    return {
        x:
            (p.x - min.x) /
            Math.max(
                0.0001,
                max.x - min.x
            ),

        y:
            (p.y - min.y) /
            Math.max(
                0.0001,
                max.y - min.y
            ),

        z:
            (p.z - min.z) /
            Math.max(
                0.0001,
                max.z - min.z
            )
    };
}

function isInsideStickyArea(
    worldPoint
) {
    const n =
        getNormalizedHeadPoint(
            worldPoint
        );

    if (!n) {
        return false;
    }

    if (
        n.x < SETTINGS.stickMinX ||
        n.x > SETTINGS.stickMaxX ||
        n.y < SETTINGS.stickMinY ||
        n.y > SETTINGS.stickMaxY ||
        n.z < SETTINGS.stickMinZ ||
        n.z > SETTINGS.stickMaxZ
    ) {
        return false;
    }

    return true;
}

function getEyeWorldCenter(
    eyeObject
) {
    if (!eyeObject) {
        return null;
    }

    const p =
        new THREE.Vector3();

    eyeObject.getWorldPosition(p);

    return p;
}

function isInsideEyeBlockZone(
    worldPoint
) {
    const radius =
        SETTINGS.eyeBlockRadius;

    const leftCenter =
        getEyeWorldCenter(
            eyeballLeft
        );

    const rightCenter =
        getEyeWorldCenter(
            eyeballRight
        );

    if (
        leftCenter &&
        worldPoint.distanceTo(
            leftCenter
        ) < radius
    ) {
        return true;
    }

    if (
        rightCenter &&
        worldPoint.distanceTo(
            rightCenter
        ) < radius
    ) {
        return true;
    }

    return false;
}

// =========================================================
// TAP PARTICLES — небольшой разлёт из точки удара
// =========================================================

const tapParticleBursts = [];

function createTapDigitTexture(digit) {
    const c =
        document.createElement(
            'canvas'
        );

    c.width = 256;
    c.height = 256;

    const ctx =
        c.getContext('2d');

    ctx.clearRect(
        0,
        0,
        256,
        256
    );

    // Один цвет для всех разлетающихся цифр.
    // Берём сиреневый оттенок из loading highlight.
    const digitColor =
        SETTINGS.revealGlowColor || '#5900ff';

    ctx.font =
        '700 188px Arial, Helvetica, sans-serif';

    ctx.textAlign =
        'center';

    ctx.textBaseline =
        'middle';

    ctx.lineWidth = 3.0;
    ctx.strokeStyle =
        'rgba(255,255,255,0.20)';

    ctx.shadowBlur = 18;
    ctx.shadowColor =
        digitColor;

    ctx.strokeText(
        digit,
        128,
        136
    );

    ctx.fillStyle =
        digitColor;

    ctx.fillText(
        digit,
        128,
        136
    );

    const texture =
        new THREE.CanvasTexture(
            c
        );

    texture.colorSpace =
        THREE.SRGBColorSpace;

    texture.minFilter =
        THREE.LinearFilter;

    texture.magFilter =
        THREE.LinearFilter;

    texture.generateMipmaps =
        false;

    texture.needsUpdate =
        true;

    return texture;
}

const tapDigitTextures = [
    createTapDigitTexture('0'),
    createTapDigitTexture('1')
];

function triggerTapParticles(hit) {
    if (!SETTINGS.tapParticleEnabled) {
        return;
    }

    const count = Math.max(
        1,
        Math.round(SETTINGS.tapParticleCount)
    );

    const worldBox =
        new THREE.Box3()
            .setFromObject(headRig);

    const center =
        worldBox.getCenter(
            new THREE.Vector3()
        );

    const boxSize =
        worldBox.getSize(
            new THREE.Vector3()
        );

    const radius =
        Math.max(
            boxSize.x,
            boxSize.y,
            boxSize.z
        ) * 0.58;

    const particles = [];


    for (
        let i = 0;
        i < count;
        i++
    ) {
        const u =
            Math.random();

        const v =
            Math.random();

        const theta =
            u *
            Math.PI *
            2;

        const phi =
            Math.acos(
                2 * v - 1
            );

        const dir =
            new THREE.Vector3(
                Math.sin(phi) *
                Math.cos(theta),
                Math.cos(phi),
                Math.sin(phi) *
                Math.sin(theta)
            );

        const startRadius =
            radius *
            (
                0.72 +
                Math.random() *
                0.30
            );

        const position =
            center
                .clone()
                .addScaledVector(
                    dir,
                    startRadius
                );

        const helper =
            Math.abs(dir.y) < 0.92
                ? new THREE.Vector3(0, 1, 0)
                : new THREE.Vector3(1, 0, 0);

        const tangentA =
            new THREE.Vector3()
                .crossVectors(
                    helper,
                    dir
                )
                .normalize();

        const tangentB =
            new THREE.Vector3()
                .crossVectors(
                    dir,
                    tangentA
                )
                .normalize();

        const angle =
            Math.random() *
            Math.PI *
            2;

        const lateral =
            SETTINGS.tapParticleSpread *
            (
                0.15 +
                Math.random() *
                0.35
            );

        const moveDir =
            dir
                .clone()
                .addScaledVector(
                    tangentA,
                    Math.cos(angle) *
                    lateral
                )
                .addScaledVector(
                    tangentB,
                    Math.sin(angle) *
                    lateral
                )
                .normalize();

        const speed =
            SETTINGS.tapParticleSpeed *
            (
                0.65 +
                Math.random() *
                0.75
            );

        const velocity =
            moveDir
                .multiplyScalar(
                    speed
                );

        // Вместо круглой частицы — 0 или 1.
        // Сам glyph уже содержит gradient violet -> blue -> white.
        const digitIndex =
            Math.random() > 0.5
                ? 1
                : 0;

        const material =
            new THREE.SpriteMaterial({
                map:
                    tapDigitTextures[
                        digitIndex
                    ],
                color:
                    0xffffff,
                transparent:
                    true,
                opacity:
                    SETTINGS.tapParticleOpacity,
                depthWrite:
                    false,
                depthTest:
                    true,
                blending:
                    THREE.AdditiveBlending,
                toneMapped:
                    false
            });

        const sprite =
            new THREE.Sprite(
                material
            );

        const size =
            SETTINGS.tapParticleSize *
            3.10 *
            (
                0.90 +
                Math.random() *
                0.22
            );

        sprite.scale.set(
            size * 0.72,
            size,
            1
        );

        sprite.position.copy(
            position
        );

        sprite.frustumCulled =
            false;

        scene.add(
            sprite
        );

        particles.push({
            sprite,
            material,
            velocity,
            baseSize:
                size
        });
    }

    tapParticleBursts.push({
        particles,
        age:
            0,
        life:
            Math.max(
                0.05,
                SETTINGS.tapParticleLife
            ),
        startOpacity:
            SETTINGS.tapParticleOpacity
    });
}

function updateTapParticles(delta) {
    for (
        let i =
            tapParticleBursts.length - 1;
        i >= 0;
        i--
    ) {
        const burst =
            tapParticleBursts[i];

        burst.age +=
            delta;

        const t =
            THREE.MathUtils.clamp(
                burst.age /
                burst.life,
                0,
                1
            );

        for (
            let p = 0;
            p < burst.particles.length;
            p++
        ) {
            const particle =
                burst.particles[p];

            particle.velocity.y -=
                SETTINGS.tapParticleGravity *
                delta;

            particle.sprite.position
                .addScaledVector(
                    particle.velocity,
                    delta
                );

            const fade =
                Math.pow(
                    1 - t,
                    1.55
                );

            particle.material.opacity =
                burst.startOpacity *
                fade;

            const scale =
                particle.baseSize *
                (
                    1.0 -
                    t * 0.24
                );

            particle.sprite.scale.set(
                scale * 0.72,
                scale,
                1
            );
        }

        if (t >= 1) {
            for (
                let p = 0;
                p < burst.particles.length;
                p++
            ) {
                const particle =
                    burst.particles[p];

                particle.sprite
                    .removeFromParent();

                particle.material
                    .dispose();
            }

            tapParticleBursts.splice(
                i,
                1
            );
        }
    }
}


// =========================================================
// IMPACT HALO — мягкий цветной круговой ореол вокруг модели
// =========================================================

const impactHalos = [];

const impactHaloCanvas =
    document.createElement('canvas');

impactHaloCanvas.width = 512;
impactHaloCanvas.height = 512;

const impactHaloTexture =
    new THREE.CanvasTexture(
        impactHaloCanvas
    );

impactHaloTexture.colorSpace =
    THREE.SRGBColorSpace;

function hslToRgbHalo(h, s, l) {
    const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const q =
            l < 0.5
                ? l * (1 + s)
                : l + s - l * s;

        const p =
            2 * l - q;

        r = hue2rgb(
            p, q, h + 1 / 3
        );
        g = hue2rgb(
            p, q, h
        );
        b = hue2rgb(
            p, q, h - 1 / 3
        );
    }

    return [
        r * 255,
        g * 255,
        b * 255
    ];
}

function updateImpactHaloTexture() {
    const canvas =
        impactHaloCanvas;

    const size =
        canvas.width;

    const ctx =
        canvas.getContext('2d');

    const img =
        ctx.createImageData(
            size,
            size
        );

    const data =
        img.data;

    const ringCenter =
        THREE.MathUtils.clamp(
            SETTINGS.impactHaloRingRadius,
            0.15,
            0.9
        );

    const ringWidth =
        Math.max(
            0.01,
            SETTINGS.impactHaloThickness
        );

    const softness =
        Math.max(
            0.01,
            SETTINGS.impactHaloSoftness
        );

    const hueShift =
        SETTINGS.impactHaloHueShift;

    const sat =
        THREE.MathUtils.clamp(
            SETTINGS.impactHaloSaturation,
            0,
            1.5
        );

    const rainbowMix =
        THREE.MathUtils.clamp(
            SETTINGS.impactHaloRainbow,
            0,
            1
        );

    const solidColor =
        new THREE.Color(
            SETTINGS.impactHaloColor
        );

    for (
        let y = 0;
        y < size;
        y++
    ) {
        for (
            let x = 0;
            x < size;
            x++
        ) {
            const u =
                (x + 0.5) /
                size * 2 - 1;

            const v =
                (y + 0.5) /
                size * 2 - 1;

            const r =
                Math.sqrt(
                    u * u +
                    v * v
                );

            const angle =
                Math.atan2(
                    v,
                    u
                );

            const hue =
                (
                    angle /
                    (
                        Math.PI *
                        2
                    )
                    +
                    1
                    +
                    hueShift
                ) % 1;

            const dist =
                Math.abs(
                    r -
                    ringCenter
                );

            const ring =
                Math.max(
                    0,
                    1 -
                    dist /
                    ringWidth
                );

            const glow =
                Math.max(
                    0,
                    1 -
                    dist /
                    softness
                );

            const alpha =
                Math.max(
                    ring *
                    ring *
                    0.95,

                    glow *
                    glow *
                    0.38
                ) *
                (
                    r <= 0.99
                        ? 1
                        : 0
                );

            const [
                rainbowR,
                rainbowG,
                rainbowB
            ] =
                hslToRgbHalo(
                    hue,
                    Math.min(
                        sat,
                        1
                    ),
                    0.60
                );

            const rr =
                THREE.MathUtils.lerp(
                    solidColor.r * 255,
                    rainbowR,
                    rainbowMix
                );

            const gg =
                THREE.MathUtils.lerp(
                    solidColor.g * 255,
                    rainbowG,
                    rainbowMix
                );

            const bb =
                THREE.MathUtils.lerp(
                    solidColor.b * 255,
                    rainbowB,
                    rainbowMix
                );

            const i =
                (
                    y *
                    size +
                    x
                ) * 4;

            data[i + 0] = rr;
            data[i + 1] = gg;
            data[i + 2] = bb;
            data[i + 3] =
                Math.round(
                    alpha *
                    255
                );
        }
    }

    ctx.putImageData(
        img,
        0,
        0
    );

    impactHaloTexture.needsUpdate =
        true;
}

updateImpactHaloTexture();

function triggerImpactHalo() {
    if (!SETTINGS.impactHaloEnabled) {
        return;
    }

    const worldBox =
        new THREE.Box3()
            .setFromObject(headRig);

    const center =
        worldBox.getCenter(
            new THREE.Vector3()
        );

    const boxSize =
        worldBox.getSize(
            new THREE.Vector3()
        );

    const maxSize =
        Math.max(
            boxSize.x,
            boxSize.y,
            boxSize.z
        );

    const startScale =
        maxSize *
        SETTINGS.impactHaloSize;

    const material =
        new THREE.SpriteMaterial({
            map:
                impactHaloTexture,
            color:
                new THREE.Color(
                    SETTINGS.impactHaloBright,
                    SETTINGS.impactHaloBright,
                    SETTINGS.impactHaloBright
                ),
            transparent:
                true,
            opacity:
                SETTINGS.impactHaloOpacity,
            depthWrite:
                false,
            depthTest:
                false,
            blending:
                THREE.AdditiveBlending,
            toneMapped:
                false
        });

    const sprite =
        new THREE.Sprite(
            material
        );

    sprite.position.copy(
        center
    );

    sprite.scale.set(
        startScale,
        startScale,
        1
    );

    sprite.frustumCulled = false;

    scene.add(sprite);

    impactHalos.push({
        sprite,
        material,
        center,
        age: 0,
        life:
            Math.max(
                0.05,
                SETTINGS.impactHaloLife
            ),
        startScale,
        endScale:
            startScale *
            (
                1 +
                SETTINGS.impactHaloExpand
            ),
        startOpacity:
            SETTINGS.impactHaloOpacity
    });
}

function updateImpactHalos(delta) {
    for (
        let i =
            impactHalos.length - 1;
        i >= 0;
        i--
    ) {
        const halo =
            impactHalos[i];

        halo.age += delta;

        const t =
            THREE.MathUtils.clamp(
                halo.age /
                halo.life,
                0,
                1
            );

        const eased =
            1 - Math.pow(
                1 - t,
                2.2
            );

        const scale =
            THREE.MathUtils.lerp(
                halo.startScale,
                halo.endScale,
                eased
            );

        halo.sprite.position.copy(
            halo.center
        );

        halo.sprite.scale.set(
            scale,
            scale,
            1
        );

        halo.material.opacity =
            halo.startOpacity *
            Math.pow(
                1 - t,
                1.8
            );

        halo.material.color.setRGB(
            SETTINGS.impactHaloBright,
            SETTINGS.impactHaloBright,
            SETTINGS.impactHaloBright
        );

        if (t >= 1) {
            halo.sprite.removeFromParent();
            halo.material.dispose();
            impactHalos.splice(i, 1);
        }
    }
}

// =========================================================
// HEAD RECOIL — короткий пружинящий откат при успешном тапе
// =========================================================
let recoilZ = 0;
let recoilVelZ = 0;
let recoilRotX = 0;
let recoilRotY = 0;
let recoilVelRotX = 0;
let recoilVelRotY = 0;

// 0..1 — временная радужная вспышка материала после удара.
let oilImpact = 0;

// 0..1 — при recoil персонаж снова щурится через Natural_Blink.
// Не отдельная геометрия: используем тот же настоящий blink clip.
let recoilSquint = 0;
let recoilSquintWasActive = false;

function triggerHeadRecoil(clientX, clientY) {
    window.dispatchEvent(new CustomEvent('gn:character-impact',{detail:{x:clientX,y:clientY}}));
    const rect = canvas.getBoundingClientRect();
    const nx = THREE.MathUtils.clamp((clientX - rect.left) / Math.max(1, rect.width), 0, 1) * 2 - 1;
    const ny = THREE.MathUtils.clamp((clientY - rect.top) / Math.max(1, rect.height), 0, 1) * 2 - 1;

    // От камеры = отрицательный Z. Угол идёт от точки удара.
    recoilVelZ -= SETTINGS.recoilDistance * 9.0;
    recoilVelRotY += nx * SETTINGS.recoilAngle * 18.0;
    recoilVelRotX += ny * SETTINGS.recoilAngle * 13.0;

    // Одновременно с recoil включаем краткую радужную вспышку.
    oilImpact = 1.0;

    // И возвращаем старую реакцию глаз: при резком отходе назад
    // персонаж прищуривается.
    recoilSquint = 0.82;
    recoilSquintWasActive = true;

    clearTimeout(blinkTimer);
    blinkTimer = null;
    blinkPlaying = false;
}

function followDamping(ease, delta) {
    const perFrame = Math.max(0.001, Math.min(0.95, ease));
    return -Math.expm1(Math.log1p(-perFrame) * 60 * Math.max(0, delta));
}

function updateHeadRecoil(delta) {
    const k = SETTINGS.recoilSpring;
    const d = SETTINGS.recoilDamping;

    // Fixed small integration steps prevent the spring from jittering on long frames.
    const steps = Math.max(1, Math.ceil(delta * 240));
    const step = delta / steps;
    for (let i = 0; i < steps; i++) {
        recoilVelZ += (-k * recoilZ - d * recoilVelZ) * step;
        recoilZ += recoilVelZ * step;
        recoilVelRotX += (-k * recoilRotX - d * recoilVelRotX) * step;
        recoilRotX += recoilVelRotX * step;
        recoilVelRotY += (-k * recoilRotY - d * recoilVelRotY) * step;
        recoilRotY += recoilVelRotY * step;
    }

    // Прищур быстро появляется вместе с ударом и затем мягко отпускает.
    // Скорость связана с реальным временем, а не FPS.
    if (recoilSquint > 0.0001) {
        recoilSquint =
            Math.max(
                0,
                recoilSquint -
                delta * 1.85
            );
    } else {
        recoilSquint = 0;
    }
}

function isCharacterTap(clientX, clientY) {
    const rect =
        canvas.getBoundingClientRect();

    if (
        rect.width <= 0 ||
        rect.height <= 0
    ) {
        return false;
    }

    stickerPointer.x =
        (
            (
                clientX -
                rect.left
            ) /
            rect.width
        ) * 2 - 1;

    stickerPointer.y =
        -(
            (
                clientY -
                rect.top
            ) /
            rect.height
        ) * 2 + 1;

    stickerRaycaster.setFromCamera(
        stickerPointer,
        camera
    );

    // Для запуска анимаций считаем тап по ЛЮБОЙ части
    // основной модели: голова, глаза, веки и т.д.
    // Стикерная mask здесь вообще не участвует.
    const hits =
        stickerRaycaster.intersectObjects(
            clickableMeshes,
            false
        );

    return hits.length > 0;
}


function tryPlaceSticker(clientX, clientY) {
    // Пока проигрывается scripted animation,
    // стикеры клеить нельзя.
    if (characterKeyframePlaying) {
        return false;
    }

    const rect =
        canvas.getBoundingClientRect();

    if (
        rect.width <= 0 ||
        rect.height <= 0
    ) {
        return false;
    }

    stickerPointer.x =
        (
            (
                clientX -
                rect.left
            ) /
            rect.width
        ) * 2 - 1;

    stickerPointer.y =
        -(
            (
                clientY -
                rect.top
            ) /
            rect.height
        ) * 2 + 1;

    stickerRaycaster.setFromCamera(
        stickerPointer,
        camera
    );

    if (!headMesh) {
        return false;
    }

    // ВАЖНО:
    // raycast только по mesh головы.
    // Глаза / pupil / веки физически исключены из hit-тестов.
    const hits =
        stickerRaycaster.intersectObjects(
            clickableMeshes,
            false
        );

    if (!hits.length) {
        return false;
    }

    const hit =
        hits[0];

    createStickerOnHit(
        hit
    );

    triggerTapParticles(
        hit
    );



    return true;
}

// Стикер создаётся в момент pointerdown.
//
// Простая логика:
// каждые 5 тапов по персонажу запускаем следующую анимацию.
// ANIM 2 -> ANIM 3 -> ANIM 2 -> ANIM 3 ...
// Скорость тапов не имеет значения.
let characterTapCount = 0;
let nextTapAnimation = 1; // Face turn, shot, note, middle finger, flight
let headDeparture = null;
let headNoteStarted=null;

function applyFlightHandGrip(side, value) {
    SETTINGS[side==='left'?'handLeftGrip':'handRightGrip']=value;
    for(const item of handExtraAnimations[side]||[])SETTINGS[item.key]=value;
}

function sampleHeadDeparture(elapsed) {
    const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
    let x=0,y=0,z=0,yaw=0,pitch=0,scale=1,flap=0;
    if(elapsed<1600){
        const p=ease(elapsed/1600);z=-65*p;y=22*p;
        pitch=-.5*ease(elapsed/550);
        flap=Math.sin(Math.PI*elapsed/650)**2*ease(elapsed/180)*(1-ease((elapsed-1200)/400));
        scale=1-ease((p-.7)/.3);
    }else if(elapsed<6600){
        // Move to the return path while completely out of sight.
        const p=ease((elapsed-1600)/5000);z=-65+62*p;y=22-34*p;
        pitch=-.5*(1-p);scale=0;
    }else if(elapsed<8900){
        const p=ease((elapsed-6600)/2300);y=-12*(1-p);z=-3*(1-p);
        scale=ease((elapsed-6600)/500);
    }
    return {x,y,z,yaw,pitch,scale,flap,done:elapsed>=8900};
}

function startHeadDeparture() {
    if(headDeparture || characterKeyframePlaying)return;
    handIntroAnimation=null;
    handKeyframeAnimation=null;
    characterAnimationRunId++;
    headDeparture={started:performance.now(),elapsed:0,last:performance.now(),playing:true,speed:1,preview:false,scale:headRig.scale.clone(),
        grips:[SETTINGS.handLeftGrip,SETTINGS.handRightGrip],
        fingers:Object.fromEntries(['left','right'].flatMap(side=>(handExtraAnimations[side]||[]).map(item=>[item.key,SETTINGS[item.key]]))),
        headSettings:Object.fromEntries(['headAnimRotX','headAnimRotY','headAnimRotZ','headAnimScale','blinkPose'].map(key=>[key,SETTINGS[key]])),
        pitch:headRig.rotation.x,yaw:headRig.rotation.y,roll:headRig.rotation.z,
        hands:[leftHandRig,rightHandRig].filter(Boolean).map(rig=>({rig,
            position:rig.position.clone(),rotation:rig.rotation.clone(),
            scale:rig.scale.clone(),visible:rig.visible}))};
    recoilZ=recoilVelZ=recoilRotX=recoilRotY=recoilVelRotX=recoilVelRotY=0;
    targetHeadRotX=targetHeadRotY=currentHeadRotX=currentHeadRotY=0;
    targetRotX=currentRotX=.125;targetRotY=currentRotY=0;
    SETTINGS.headAnimRotX=SETTINGS.headAnimRotY=SETTINGS.headAnimRotZ=0;SETTINGS.headAnimScale=1;
    enterScriptedBlinkMode();
    window.MD_MODEL_INTERACTIVE=false;
    document.documentElement.classList.remove('md-head-hover');
}

// Editable flight poses use the same clock and rig as the actual reaction.
const flightPoseKeys=['x','y','z','yaw','pitch','roll','scale','eyeX','eyeY','blink'];
const flightHandKeys=['x','y','z','rx','ry','rz','scale','grip','index','middle','ring','little','thumb'];
const flightNeutralHead={x:0,y:0,z:0,yaw:0,pitch:0,roll:0,scale:1,eyeX:.125,eyeY:0};
const flightRestLeft={x:-1.3,y:-.95,z:.65,rx:1,ry:2.2,rz:.2,scale:.6,grip:.24};
const flightRestRight={...flightRestLeft,x:1.3,ry:-2.2,rz:-.2};
const flightRaisedLeft={x:-1.1,y:.15,z:.65,rx:1.0471975511965976,ry:-.20943951023931956,rz:-.5235987755982988,scale:.6,grip:.23};
const flightRaisedRight={...flightRaisedLeft,x:1.1,rz:.5235987755982988};
const flightDownLeft={x:-1.5,y:-1.25,z:.25,rx:3.2288591161895095,ry:-.20943951023931956,rz:.3490658503988659,scale:.5,grip:.23};
const flightDownRight={...flightDownLeft,x:1.5,ry:.20943951023931956,rz:-.3490658503988659};
const defaultFlightFrames=[
    {time:0,head:{...flightNeutralHead},left:{...flightRestLeft,scale:0,grip:.65},right:{...flightRestRight,scale:0,grip:.65}},
    {time:300,head:{...flightNeutralHead},left:{...flightRestLeft,grip:.65},right:{...flightRestRight,grip:.65}},
    {time:600,head:{...flightNeutralHead,pitch:-.5061454830783556,eyeX:-.2},left:{...flightRaisedLeft},right:{...flightRaisedRight}},
    // Hands start the downward impulse 120 ms before upward travel.
    {time:720,head:{...flightNeutralHead,y:-.12,pitch:-.56,eyeX:-.25},
        left:{...flightDownLeft,x:-1.35,y:-.65,rx:2.4,scale:.56},right:{...flightDownRight,x:1.35,y:-.65,rx:2.4,scale:.56}},
    {time:840,ease:'in',head:{...flightNeutralHead,y:.45,pitch:-.62,eyeX:-.28},left:{...flightDownLeft},right:{...flightDownRight}},
    {time:1280,head:{...flightNeutralHead,y:30,z:-8,pitch:-.5,eyeX:-.28,scale:0},left:{...flightDownLeft},right:{...flightDownRight}},
    {time:6280,head:{...flightNeutralHead,y:-12,z:-3,scale:0},left:{...flightRestLeft,scale:0},right:{...flightRestRight,scale:0}},
    {time:6780,head:{...flightNeutralHead,y:-10,z:-2,scale:1},left:{...flightRestLeft,scale:0},right:{...flightRestRight,scale:0}},
    {time:7780,head:{...flightNeutralHead},left:{...flightRestLeft,scale:0},right:{...flightRestRight,scale:0}}
];
const shotRest={x:-1,y:-1.4,z:.3,rx:1,ry:2.2,rz:.2,scale:0,grip:.6,index:.6,middle:.6,ring:.6,little:.6,thumb:.6};
// Same raised hand placement as ANIM 2; only the index stays extended.
const shotAim={...shotRest,y:-.9,z:1.4,rx:255*Math.PI/180,ry:100*Math.PI/180,rz:-173*Math.PI/180,scale:.6,index:.22,thumb:.25};
const shotHiddenRight={...shotRest,x:1,ry:-2.2,rz:-.2,scale:0};
const defaultShotFrames=[
    {time:0,head:{...flightNeutralHead,blink:0},left:{...shotRest},right:{...shotHiddenRight}},
    {time:650,head:{...flightNeutralHead,blink:.55},left:{...shotAim},right:{...shotHiddenRight}},
    {time:1000,head:{...flightNeutralHead,blink:.68},left:{...shotAim},right:{...shotHiddenRight}},
    {time:1100,head:{...flightNeutralHead,z:-.12,pitch:-.055,blink:.78},left:{...shotAim,z:shotAim.z-.28,rx:shotAim.rx-.13},right:{...shotHiddenRight}},
    {time:1450,head:{...flightNeutralHead,blink:.5},left:{...shotAim},right:{...shotHiddenRight}},
    {time:2200,head:{...flightNeutralHead,blink:.3},left:{...shotAim},right:{...shotHiddenRight}},
    {time:3200,head:{...flightNeutralHead,blink:0},left:{...shotRest},right:{...shotHiddenRight}}
].map(frame=>({...frame,time:frame.time*.8}));
let flightReaction='shot',flightFrames=structuredClone(defaultShotFrames),flightFrameLibrary={};
function validateFlightFrames(frames){
    if(!Array.isArray(frames)||frames.length<2||frames.length>100)throw Error('Нужно от 2 до 100 кадров');
    const sorted=structuredClone(frames).sort((a,b)=>a.time-b.time);
    sorted.forEach((f,i)=>{
        f.head.blink??=0;
        for(const side of ['left','right'])for(const token of ['index','middle','ring','little','thumb'])f[side][token]??=f[side].grip;
        if(!Number.isFinite(f.time)||f.time<0||f.time>120000||(i&&f.time<=sorted[i-1].time))throw Error('Время кадров должно различаться');
        for(const [part,keys] of [['head',flightPoseKeys],['left',flightHandKeys],['right',flightHandKeys]]){
            if(!keys.every(k=>Number.isFinite(f[part]?.[k])))throw Error('Некорректные значения кадра');
            if(f[part].scale<0||f[part].scale>5)throw Error('Размер: от 0 до 5');
            if(part!=='head'&&(f[part].grip<0||f[part].grip>1))throw Error('Сжатие кисти: от 0 до 1');
        }
    });
    if(sorted[0].time!==0)throw Error('Первый кадр должен быть в 0 секунд');
    return sorted;
}
flightFrames=validateFlightFrames(flightFrames);
flightFrameLibrary.flight=validateFlightFrames(defaultFlightFrames);
try{
    const saved=localStorage.getItem('md-head-flight-v2');
    if(saved){
        const candidate=validateFlightFrames(JSON.parse(saved).frames);
        // A blank editor draft must not replace the approved flight reaction.
        if(candidate.some(frame=>Math.abs(frame.head.y)>1||Math.abs(frame.head.z)>1))flightFrameLibrary.flight=candidate;
        const rest=flightFrameLibrary.flight.find(f=>f.time===300),raised=flightFrameLibrary.flight.find(f=>f.time===600);
        for(const side of ['left','right']){
            if(rest?.[side].grip===.24&&raised?.[side].grip===.23&&flightFrameLibrary.flight[0][side].grip===.65)rest[side].grip=.65;
        }
    }
}catch{}
try{
    const saved=localStorage.getItem('md-head-shot-v1');
    if(saved){
        const data=JSON.parse(saved);
        flightFrames=validateFlightFrames(data.frames);
        if(!data.shotSpeedRevision&&flightFrames.at(-1).time===3200)flightFrames.forEach(frame=>frame.time*=.8);
        for(const frame of flightFrames){
            const p=frame.left;
            const oldRaised=p.index===.85&&p.ry===2.8&&p.rz===.1&&(p.rx===1||p.rx===.87);
            const oldForward=p.index===0&&Math.abs(p.ry+.0548762274411039)<1e-9&&Math.abs(p.rz+2.8731902083168106)<1e-9;
            if(oldRaised||oldForward){
                const recoil=p.z===1.22;
                Object.assign(p,shotAim,{z:shotAim.z-(recoil?.28:0),rx:shotAim.rx-(recoil?.13:0)});
            }
        }
    }
}catch{}
function sampleEditableFlight(time){
    let i=0;while(i<flightFrames.length-2&&time>flightFrames[i+1].time)i++;
    const a=flightFrames[i],b=flightFrames[i+1];
    let t=Math.max(0,Math.min(1,(time-a.time)/(b.time-a.time)));t=a.ease==='in'?t*t:t*t*(3-2*t);
    const result={done:time>=flightFrames.at(-1).time};
    for(const [part,keys] of [['head',flightPoseKeys],['left',flightHandKeys],['right',flightHandKeys]]){
        result[part]={};for(const key of keys)result[part][key]=a[part][key]+(b[part][key]-a[part][key])*t;
    }
    return result;
}
function stopHeadDeparture(){
    if(!headDeparture)return;
    headRig.scale.copy(headDeparture.scale);
    for(const h of headDeparture.hands){h.rig.position.copy(h.position);h.rig.rotation.copy(h.rotation);h.rig.scale.copy(h.scale);h.rig.visible=h.visible;}
    [SETTINGS.handLeftGrip,SETTINGS.handRightGrip]=headDeparture.grips;updateHandGrips();
    Object.assign(SETTINGS,headDeparture.fingers,headDeparture.headSettings);updateHandGrips();
    headDeparture=null;
    forceManualBlinkPose(0);
    leaveScriptedBlinkMode();
    window.MD_FINGER_SHOT?.(null);
    targetHeadRotX=targetHeadRotY=currentHeadRotX=currentHeadRotY=0;
    targetRotX=currentRotX=.125;targetRotY=currentRotY=0;
}
window.MD_FLIGHT_EDITOR={
    get:()=>({version:1,reaction:flightReaction,shotSpeedRevision:2,frames:structuredClone(flightFrames)}),
    select:reaction=>{
        if(!['flight','shot'].includes(reaction))return;
        stopHeadDeparture();flightFrameLibrary[flightReaction]=structuredClone(flightFrames);
        localStorage.setItem(flightReaction==='flight'?'md-head-flight-v2':'md-head-shot-v1',JSON.stringify(window.MD_FLIGHT_EDITOR.get()));
        flightReaction=reaction;flightFrames=validateFlightFrames(flightFrameLibrary[reaction]||(reaction==='flight'?defaultFlightFrames:defaultShotFrames));
    },
    sample:sampleEditableFlight,
    set:data=>{flightFrames=validateFlightFrames(data.frames);},
    state:()=>({time:headDeparture?.elapsed||0,playing:!!headDeparture?.playing,duration:flightFrames.at(-1).time,active:!!headDeparture}),
    preview:(time=0,playing=false,speed=.25)=>{
        if(document.getElementById('md-work-slider')?.dataset.mdIntro!=='ready'||!leftHandRig||!rightHandRig)return false;
        if(!headDeparture)startHeadDeparture();
        if(!headDeparture)return false;
        Object.assign(headDeparture,{elapsed:Math.max(0,Math.min(time,flightFrames.at(-1).time)),last:performance.now(),preview:true,playing,speed,pitch:0,yaw:0,roll:0});return true;
    },
    speed:value=>{if(headDeparture)headDeparture.speed=value;},
    stop:stopHeadDeparture,
    save:()=>localStorage.setItem(flightReaction==='flight'?'md-head-flight-v2':'md-head-shot-v1',JSON.stringify(window.MD_FLIGHT_EDITOR.get())),
    reset:()=>{flightFrames=validateFlightFrames([0,1000].map(time=>({time,head:{...flightNeutralHead},left:{...flightRestLeft},right:{...flightRestRight}})));}
};

function registerCharacterTap() {
    characterTapCount++;

    console.log(
        '[GN HEAD] tap',
        characterTapCount,
        '/ 5'
    );

    if (characterTapCount < 5) {
        return;
    }

    characterTapCount = 0;

    if(nextTapAnimation===3){
        window.MD_FLIGHT_EDITOR.select('flight');
        startHeadDeparture();
        nextTapAnimation=1;
        return;
    }
    if(nextTapAnimation===4){
        window.MD_FLIGHT_EDITOR.select('shot');
        startHeadDeparture();
        nextTapAnimation=5;
        return;
    }
    if(nextTapAnimation===5){
        headNoteStarted=performance.now();
        window.MD_MODEL_INTERACTIVE=false;
        nextTapAnimation=2;
        return;
    }

    if (nextTapAnimation === 1) {
        clearAllStickers();
        runCharacterAnimation(2, [0, 1, 2, 1, 0]);
        nextTapAnimation = 4;
        return;
    }

    runCharacterAnimation(1, [0, 1, 0], { 1: 3000 });

    nextTapAnimation = 3;
}

window.addEventListener(
    'pointerdown',
    event => {
        if(!window.MD_MODEL_INTERACTIVE)return;
        if (
            event.button !== undefined &&
            event.button !== 0
        ) {
            return;
        }

        const hitCharacter =
            isCharacterTap(
                event.clientX,
                event.clientY
            );

        // Sticker logic is completely independent.
        tryPlaceSticker(
            event.clientX,
            event.clientY
        );

        if (
            hitCharacter &&
            !characterKeyframePlaying
        ) {
            triggerImpactHalo();
            triggerHeadRecoil(event.clientX,event.clientY);
            registerCharacterTap();
        }
    },
    {
        passive: true
    }
);


/* =========================================================
   VISIBILITY
========================================================= */

document.addEventListener(
    'visibilitychange',
    () => {
        if (document.hidden) {
                    clearTimeout(
                blinkTimer
            );

            if (blinkAction) {
                blinkAction.stop();
                blinkAction.reset();
            }

            blinkPlaying = false;

            centerEyes();
        } else if (
            characterKeyframePlaying
        ) {
            applyManualBlinkPose();
            applyManualFacialPoses();
        } else if (
            SETTINGS.autoBlinkEnabled
        ) {
            scheduleBlink();
        }
    }
);

/* =========================================================
   TILDA ZOOM
========================================================= */

function getTildaZoomScale() {
    const rect =
        container.getBoundingClientRect();

    const offsetWidth =
        container.offsetWidth;

    const offsetHeight =
        container.offsetHeight;

    if (
        !offsetWidth ||
        !offsetHeight
    ) {
        return 1;
    }

    const scaleX =
        rect.width /
        offsetWidth;

    const scaleY =
        rect.height /
        offsetHeight;

    const scale =
        Math.max(
            scaleX,
            scaleY
        );

    if (
        !Number.isFinite(scale) ||
        scale <= 0
    ) {
        return 1;
    }

    return scale;
}

function syncMaterialPanelScale() {
    // Material/reveal panel removed.
}


/* =========================================================
   RESIZE
========================================================= */

let gnLastRenderWidth = 0;
let gnLastRenderHeight = 0;
let gnLastPixelRatio = 0;
let gnResizeFrame = 0;
let gnSceneBounds=null;

function resize() {
    gnSceneBounds=canvas.getBoundingClientRect();
    const width = Math.max(1, container.clientWidth);
    const height = Math.max(1, container.clientHeight);
    const mobile = window.innerWidth <= 768;
    const ratioLimit = mobile ? SETTINGS.maxPixelRatioMobile : SETTINGS.maxPixelRatio;
    const pixelRatio = Math.min(
        (window.devicePixelRatio || 1) * getTildaZoomScale(),
        ratioLimit || SETTINGS.maxPixelRatio,
        Math.sqrt((SETTINGS.maxRenderPixels || 2500000) / (width * height))
    );
    if (width === gnLastRenderWidth && height === gnLastRenderHeight &&
        Math.abs(pixelRatio - gnLastPixelRatio) < 0.001) return;
    gnLastRenderWidth = width;
    gnLastRenderHeight = height;
    gnLastPixelRatio = pixelRatio;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    syncMaterialPanelScale();
}

function scheduleResize() {
    if (gnResizeFrame) return;
    gnResizeFrame = requestAnimationFrame(() => {
        gnResizeFrame = 0;
        resize();
    });
}

resize();

// =========================================================
// REVEAL HEAD POSE
// Пока идёт liquid reveal:
// 1) голова смотрит строго прямо — cursor-follow отключён;
// 2) в начале слегка наклонена вниз;
// 3) ближе к появлению глаз плавно поднимается;
// 4) только после завершения reveal возвращается cursor-follow.
// =========================================================
const GN_REVEAL_HEAD_DOWN_X = 0.32;

// Подъём головы начинается немного раньше открытия глаз.
const GN_REVEAL_HEAD_RAISE_START = 0.66;
const GN_REVEAL_HEAD_RAISE_END = 0.94;

function smootherStep01(value) {
    const t =
        THREE.MathUtils.clamp(
            value,
            0,
            1
        );

    return (
        t * t * t *
        (
            t *
            (
                t * 6 -
                15
            ) +
            10
        )
    );
}

function updateRevealHeadPose() {
    if (
        !SETTINGS.revealEnabled ||
        gnRevealState.p >= 0.9999
    ) {
        return false;
    }

    const progress =
        THREE.MathUtils.clamp(
            Number(gnRevealState.p || 0),
            0,
            1
        );

    const raiseRaw =
        (
            progress -
            GN_REVEAL_HEAD_RAISE_START
        ) /
        Math.max(
            0.0001,
            GN_REVEAL_HEAD_RAISE_END -
            GN_REVEAL_HEAD_RAISE_START
        );

    const raise =
        smootherStep01(
            raiseRaw
        );

    // +X = лёгкий наклон головы вниз в текущей ориентации модели.
    // К GN_REVEAL_HEAD_RAISE_END приходит точно в 0 — лицо прямо.
    currentHeadRotX =
        THREE.MathUtils.lerp(
            GN_REVEAL_HEAD_DOWN_X,
            0,
            raise
        );

    // Во время reveal никакого горизонтального cursor-follow.
    currentHeadRotY = 0;

    return true;
}


function updateRecoilSquint() {
    // Reveal owns the eyelids while loading.
    if (
        SETTINGS.revealEnabled &&
        (
            gnRevealState.p < 0.9999 ||
            gnRevealEyesOpening ||
            gnRevealEyesLocked
        )
    ) {
        return false;
    }

    if (characterKeyframePlaying) {
        return false;
    }

    if (recoilSquint > 0.0001) {
        clearTimeout(blinkTimer);
        blinkTimer = null;
        blinkPlaying = false;

        // 0 = open, 1 = fully closed.
        // 0.82 gives a clear squint without fully shutting the eyes.
        forceManualBlinkPose(
            THREE.MathUtils.clamp(
                recoilSquint,
                0,
                0.82
            )
        );

        return true;
    }

    if (recoilSquintWasActive) {
        recoilSquintWasActive = false;
        forceManualBlinkPose(0);

        if (
            SETTINGS.autoBlinkEnabled &&
            !document.hidden
        ) {
            scheduleBlink();
        }
    }

    return false;
}


window.addEventListener(
    'resize',
    scheduleResize,
    {
        passive: true
    }
);

if (window.visualViewport) {
    window.visualViewport.addEventListener(
        'resize',
        scheduleResize,
        {
            passive: true
        }
    );
}

const resizeObserver =
    new ResizeObserver(
        scheduleResize
    );

resizeObserver.observe(
    container
);

// Прогреваем SVG + smoke shader заранее,
// чтобы первый клик не подвисал.
function scheduleStickerWarmup() {
    if (!stickerTextures.length) {
        return;
    }

    const runWarmup = () => {
        warmupStickerPipeline().catch(error => {
            console.warn(
                '[GN HEAD] sticker warmup deferred:',
                error
            );
        });
    };

    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(
            runWarmup,
            {
                timeout: 5000
            }
        );
    } else {
        setTimeout(
            runWarmup,
            1200
        );
    }
}

/* =========================================================
   INITIAL
========================================================= */

if (
    !document.hidden &&
    SETTINGS.autoBlinkEnabled
) {
    setTimeout(
        playBlink,
        650
    );
}

/* =========================================================
   RENDER
========================================================= */

let oilElapsed = 0;

// =========================================================
// REVEAL EYES
// Во время liquid-reveal глаза закрыты.
// После полного формирования головы веки плавно открываются.
// =========================================================
let gnRevealEyesLocked = false;
let gnRevealEyesOpening = false;
let gnRevealEyesOpenStart = 0;

// Глаза начинают открываться ещё ДО полного завершения reveal.
const GN_REVEAL_EYE_OPEN_PROGRESS = 0.80;

// Чуть более плавное и длинное открытие.
const GN_REVEAL_EYE_OPEN_DURATION = 620;

function updateRevealEyes(now) {
    if (!manualBlinkClip || !blinkAction) {
        return false;
    }

    const revealEnabled =
        SETTINGS.revealEnabled;

    const progress =
        THREE.MathUtils.clamp(
            Number(gnRevealState.p || 0),
            0,
            1
        );

    if (!revealEnabled) {
        setRevealEyeballsVisible(true);

        if (gnRevealEyesLocked || gnRevealEyesOpening) {
            forceManualBlinkPose(0);
        }

        gnRevealEyesLocked = false;
        gnRevealEyesOpening = false;

        return false;
    }

    // 0.00 -> 0.80:
    // веки полностью закрыты, белки и зрачки вообще не рендерим.
    if (
        progress <
        GN_REVEAL_EYE_OPEN_PROGRESS
    ) {
        gnRevealEyesLocked = true;
        gnRevealEyesOpening = false;

        clearTimeout(blinkTimer);
        blinkTimer = null;
        blinkPlaying = false;

        forceManualBlinkPose(1);
        setRevealEyeballsVisible(false);

        return true;
    }

    // Как только дошли примерно до 0.80:
    // возвращаем глазные яблоки ПОД закрытые веки
    // и начинаем плавное открытие Natural_Blink.
    if (
        gnRevealEyesLocked &&
        !gnRevealEyesOpening
    ) {
        setRevealEyeballsVisible(true);

        gnRevealEyesOpening = true;
        gnRevealEyesOpenStart = now;

        clearTimeout(blinkTimer);
        blinkTimer = null;
        blinkPlaying = false;
    }

    if (gnRevealEyesOpening) {
        const raw =
            THREE.MathUtils.clamp(
                (
                    now -
                    gnRevealEyesOpenStart
                ) /
                GN_REVEAL_EYE_OPEN_DURATION,
                0,
                1
            );

        // Более мягкая smootherstep-кривая:
        // медленнее старт/финиш, без резкого "раскрытия".
        const eased =
            raw * raw * raw *
            (
                raw *
                (
                    raw * 6 -
                    15
                ) +
                10
            );

        // Natural_Blink_MANUAL:
        // 1 = полностью закрыты
        // 0 = полностью открыты
        forceManualBlinkPose(
            1 - eased
        );

        if (raw >= 1) {
            forceManualBlinkPose(0);

            gnRevealEyesOpening = false;
            gnRevealEyesLocked = false;

            if (
                SETTINGS.autoBlinkEnabled &&
                !characterKeyframePlaying &&
                !document.hidden
            ) {
                scheduleBlink();
            }

            // Initial intro is now finished.
            // Only now start loading hands + sticker PNGs.
            startDeferredInteractionAssets();
        }

        return true;
    }

    // Если progress уже > 0.8 и открытие закончено,
    // глаза остаются обычными открытыми.
    setRevealEyeballsVisible(true);

    return false;
}


window.addEventListener(
    'resize',
    () => {
        if (
            thoughtVisible
        ) {
            placeThoughtCard();
        }
    }
);

let gnRenderFrame = 0;
let gnSceneInView = true;

function syncRenderActivity() {
    if (document.hidden || !gnSceneInView) {
        if (gnRenderFrame) cancelAnimationFrame(gnRenderFrame);
        gnRenderFrame = 0;
        return;
    }
    if (!gnRenderFrame) {
        // Discard time spent outside the viewport to avoid a simulation jump.
        clock.getDelta();
        gnRenderFrame = requestAnimationFrame(render);
    }
}

document.addEventListener('visibilitychange', syncRenderActivity);
if ('IntersectionObserver' in window) {
    const gnVisibilityObserver = new IntersectionObserver(entries => {
        gnSceneInView = entries[0]?.isIntersecting ?? true;
        syncRenderActivity();
    }, { rootMargin: '100px' });
    gnVisibilityObserver.observe(container);
}

// Manual gallery scrolling gets its own gaze reaction, outside the click queue.
function createScrollLook() {
    let since=null,last=-Infinity,cooldownUntil=0,started=null,origin=null,direction=-1,turnDirection=-1;
    return {
        activity(now,movement=-1) {
            if(movement)direction=Math.sign(movement);
            if(now-last>900)since=now;
            last=now;
        },
        sample(now,busy,current,cursor) {
            if(busy){started=null;since=null;return cursor;}
            if(now-last>900)since=null;
            if(started===null && since!==null && now-since>=3000 && now>=cooldownUntil){
                started=now;origin={...current};turnDirection=direction;since=null;cooldownUntil=now+15000;
            }
            if(started===null)return cursor;
            const elapsed=now-started;
            if(elapsed>=2400){started=null;return cursor;}
            // Positive pitch follows the cards below the character. Start in their travel direction.
            const poses=[origin,{headX:.16,headY:.65*turnDirection,eyeX:.25,eyeY:.2*turnDirection},
                {headX:.16,headY:-.65*turnDirection,eyeX:.25,eyeY:-.2*turnDirection},cursor];
            const times=[0,650,1550,2400];
            let i=0;while(elapsed>times[i+1])i++;
            let t=(elapsed-times[i])/(times[i+1]-times[i]);t=t*t*(3-2*t);
            const pose={};for(const key of Object.keys(cursor))pose[key]=poses[i][key]+(poses[i+1][key]-poses[i][key])*t;
            return pose;
        }
    };
}
const scrollLook=createScrollLook();
window.addEventListener('md:gallery-scroll-sound',event=>{
    if(event.detail?.speed>0)scrollLook.activity(performance.now(),event.detail.direction);
});

var modelArrivalStarted=0,wasFlightLook=false,flightReturnUntil=0;
function render() {
    gnRenderFrame = 0;
    if (document.hidden || !gnSceneInView) return;
    gnRenderFrame = requestAnimationFrame(render);

    const handNow =
        performance.now();

    updateGnRevealAnimation(
        handNow
    );

    const revealControlsBlink =
        updateRevealEyes(
            handNow
        );

    updateHandKeyframeAnimation(
        handNow
    );

    const delta =
        Math.min(
            clock.getDelta(),
            0.05
        );

    oilElapsed += delta;
    if(pbrUniforms) pbrUniforms.uPBRGlowTime.value=oilElapsed;

    if (model) {
        if (gnRevealState.p < 0.9999) {
            model.updateMatrixWorld(true);

            gnRevealBounds
                .setFromObject(model);

            const extra =
                0.25 *
                SETTINGS.revealBand;

            gnRevealShaders.forEach(shader => {
                const u =
                    shader.uniforms;

                if (!u?.uGnReveal) {
                    return;
                }

                u.uGnRevealMinY.value =
                    gnRevealBounds.min.y;

                u.uGnRevealMaxY.value =
                    gnRevealBounds.max.y +
                    extra;
            });
        }

        gnRevealShaders.forEach(shader => {
            const u =
                shader.uniforms;

            if (!u?.uGnReveal) {
                return;
            }

            u.uGnReveal.value =
                gnRevealState.p;

            u.uGnRevealTime.value =
                oilElapsed;
        });
    }

    // Плавно гасим радужный импульс после удара.
    oilImpact = Math.max(
        0,
        oilImpact - delta / Math.max(0.05, SETTINGS.oilImpactDuration)
    );

    if(pbrUniforms) updatePBROil();
    if (headMaterialShader) {
        headMaterialShader.uniforms.uOilTime.value = oilElapsed;
        headMaterialShader.uniforms.uOilImpact.value =
            oilImpact * oilImpact * (3.0 - 2.0 * oilImpact);
    }

    updateStickers(
        delta
    );

    updateTapParticles(
        delta
    );

    updateImpactHalos(
        delta
    );

    updateHeadRecoil(
        delta
    );

    updateCharacterKeyframeControls();

    // Recoil-squint применяем ПОСЛЕ всех keyframe/facial updates,
    // чтобы ни один последующий facial update в этом кадре его не перетёр.
    const recoilControlsBlink =
        updateRecoilSquint();

    if (
        SETTINGS.autoBlinkEnabled &&
        !characterKeyframePlaying &&
        !revealControlsBlink &&
        !headDeparture &&
        !recoilControlsBlink
    ) {
        blinkMixer.update(
            delta
        );
    }

    const galleryLoaded=document.getElementById('md-work-slider')?.dataset.mdIntro==='ready';
    const flightLook=!galleryLoaded&&window.MD_GALLERY_LOOK_TARGET;
    if(flightLook){
        const extent=Math.max(100,flightLook.headSize*1.5);
        const dx=THREE.MathUtils.clamp((flightLook.x-flightLook.headX)/extent,-1,1);
        const dy=THREE.MathUtils.clamp((flightLook.y-flightLook.headY)/extent,-1,1);
        const lookWeight=flightLook.weight??1;
        targetHeadRotY=dx*.65*lookWeight;
        targetHeadRotX=dy*.48*lookWeight;
        // Gaze is relative to the rotating head: compensate its current pose.
        targetRotY=THREE.MathUtils.clamp(dx*.8*lookWeight-currentHeadRotY,SETTINGS.rotYMin,SETTINGS.rotYMax);
        targetRotX=THREE.MathUtils.clamp(.125+dy*.32*lookWeight-currentHeadRotX,-.2,.45);
    } else if(wasFlightLook){
        targetHeadRotX=targetHeadRotY=0;
        targetRotX=.125;targetRotY=0;
        flightReturnUntil=handNow+700;
    }
    wasFlightLook=!!flightLook;
    const flightReturning=handNow<flightReturnUntil;
    const scrollPose=scrollLook.sample(handNow,
        !galleryLoaded || characterKeyframePlaying || !!headDeparture || headNoteStarted!==null || !!window.MD_FLIGHT_EDITING,
        {headX:currentHeadRotX,headY:currentHeadRotY,eyeX:currentRotX,eyeY:currentRotY},
        {headX:targetHeadRotX,headY:targetHeadRotY,eyeX:targetRotX,eyeY:targetRotY});
    const zoomTarget=(SETTINGS.modelZoom||1)*(galleryLoaded?1.16:1);
    const nextZoom=camera.zoom+(zoomTarget-camera.zoom)*.045;
    if(Math.abs(nextZoom-camera.zoom)>.00001){camera.zoom=nextZoom;camera.updateProjectionMatrix();}
    window.MD_MODEL_INTERACTIVE=galleryLoaded && !headDeparture && headNoteStarted===null && !window.MD_FLIGHT_EDITING;
    const approachReady=galleryLoaded||window.MD_GALLERY_APPROACH;
    if(approachReady&&!modelArrivalStarted)modelArrivalStarted=handNow;
    const arrivalT=approachReady?THREE.MathUtils.clamp((handNow-modelArrivalStarted)/1000,0,1):0;
    const arrival=arrivalT*arrivalT*(3-2*arrivalT);
    window.MD_MODEL_ARRIVAL=galleryLoaded?arrival:0;
    updateSleepEffect(oilElapsed);

    // Приоритет:
    // 1. loading/reveal pose;
    // 2. scripted keyframes;
    // 3. обычный cursor-follow.
    const revealControlsHead =
        updateRevealHeadPose() && !flightLook;

    if (!revealControlsHead) {
        if (
            SETTINGS.headFollowEnabled &&
            (galleryLoaded || flightLook || flightReturning) &&
            !characterKeyframePlaying && !headDeparture && !window.MD_FLIGHT_EDITING
        ) {
            currentHeadRotX +=
                (
                    scrollPose.headX -
                    currentHeadRotX
                ) *
                followDamping(flightLook ? .11 : flightReturning ? .09 : SETTINGS.headEase, delta);

            currentHeadRotY +=
                (
                    scrollPose.headY -
                    currentHeadRotY
                ) *
                followDamping(flightLook ? .11 : flightReturning ? .09 : SETTINGS.headEase, delta);
        } else {
            currentHeadRotX = 0;
            currentHeadRotY = 0;
        }
    }

    headRig.rotation.x = currentHeadRotX + recoilRotX + sleepMicroRotX;
    headRig.rotation.y = currentHeadRotY + recoilRotY + sleepMicroRotY;
    headRig.rotation.z = sleepMicroRotZ;
    const hoverOffset=window.MD_FLIGHT_EDITING?0:sleepFloatOffset + Math.sin((handNow-modelArrivalStarted)*.0011)*.12*arrival;
    headRig.position.y = SETTINGS.modelOffsetY + hoverOffset;
    headRig.position.z = recoilZ - 1.8*(1-arrival);
    headRig.position.x = 0;
    if(headDeparture){
        if(headDeparture.playing)headDeparture.elapsed+=(handNow-headDeparture.last)*headDeparture.speed;
        headDeparture.last=handNow;
        const elapsed=Math.min(headDeparture.elapsed,flightFrames.at(-1).time);
        const frame=sampleEditableFlight(elapsed),pose=frame.head;
        const settleT=Math.min(1,elapsed/1000);
        const settle=1-settleT*settleT*(3-2*settleT);
        headRig.position.x=pose.x;
        headRig.position.y=SETTINGS.modelOffsetY+pose.y+hoverOffset;
        headRig.position.z=pose.z;
        headRig.rotation.set(pose.pitch+headDeparture.pitch*settle,
            pose.yaw+headDeparture.yaw*settle,pose.roll+headDeparture.roll*settle);
        headRig.scale.copy(headDeparture.scale).multiplyScalar(pose.scale);
        for(const hand of headDeparture.hands){
            const rig=hand.rig,left=rig===leftHandRig,p=left?frame.left:frame.right;
            rig.visible=p.scale>0.0001;rig.scale.setScalar(p.scale);
            rig.position.set(p.x,p.y,p.z);rig.rotation.set(p.rx,p.ry,p.rz);
            applyFlightHandGrip(left?'left':'right',p.grip);
            for(const item of handExtraAnimations[left?'left':'right']||[])if(Number.isFinite(p[item.token]))SETTINGS[item.key]=p[item.token];
        }
        updateHandGrips();
        SETTINGS.blinkPose=pose.blink;applyManualBlinkPose();
        if(flightReaction==='shot'){
            window.MD_FINGER_SHOT?.({time:elapsed,playing:headDeparture.playing});
        }
        window.MD_MODEL_ARRIVAL*=pose.scale*Math.max(0,1+pose.z/8)*Math.max(0,1-Math.abs(pose.y)/3);
        if(frame.done){
            if(headDeparture.preview){headDeparture.playing=false;headDeparture.elapsed=elapsed;}
            else{stopHeadDeparture();window.MD_MODEL_INTERACTIVE=galleryLoaded&&!window.MD_FLIGHT_EDITING;}
        }
    }

    const speechPoint=new THREE.Vector3(headRig.position.x,headRig.position.y+SETTINGS.modelSize*.62,headRig.position.z).project(camera);
    const speechRect=gnSceneBounds;
    window.MD_HEAD_ANCHOR={x:speechRect.left+(speechPoint.x+1)*speechRect.width/2,y:speechRect.top+(1-speechPoint.y)*speechRect.height/2};

    if(headNoteStarted!==null){
        const elapsed=handNow-headNoteStarted;
        if(elapsed>=6100){headNoteStarted=null;window.MD_HEAD_NOTE?.(null);}
        else{
            window.MD_HEAD_NOTE?.({time:elapsed,...window.MD_HEAD_ANCHOR});
        }
    }

    // Во время reveal + плавного открытия глаз взгляд всегда строго вперёд.
    // Курсор в этот момент может двигаться, targetRotX/Y обновляются,
    // но на сами глаза они начнут влиять только ПОСЛЕ завершения открытия.
    const revealControlsEyes =
        (!galleryLoaded && !flightLook && !flightReturning) || SETTINGS.revealEnabled &&
        (
            gnRevealState.p < 0.9999 ||
            gnRevealEyesOpening ||
            gnRevealEyesLocked
        );

    if (revealControlsEyes) {
        // Центр рабочего диапазона = прямой взгляд.
        currentRotX =
            (
                SETTINGS.rotXMin +
                SETTINGS.rotXMax
            ) * 0.5;

        currentRotY = 0;
    } else if (
        SETTINGS.eyeFollowEnabled &&
        !characterKeyframePlaying && !headDeparture && !window.MD_FLIGHT_EDITING
    ) {
        currentRotX +=
            (
                scrollPose.eyeX -
                currentRotX
            ) *
            followDamping(flightLook ? .2 : flightReturning ? .12 : SETTINGS.eyeEase, delta);

        currentRotY +=
            (
                scrollPose.eyeY -
                currentRotY
            ) *
            followDamping(flightLook ? .2 : flightReturning ? .12 : SETTINGS.eyeEase, delta);
    } else {
        currentRotX =
            SETTINGS.eyeAnimRotX;

        currentRotY =
            SETTINGS.eyeAnimRotY;
    }

    if(headDeparture){
        const pose=sampleEditableFlight(headDeparture.elapsed).head;
        currentRotX=pose.eyeX;currentRotY=pose.eyeY;
    }

    // ВАЖНО:
    // вращаем те же Gaze-группы,
    // которые были доступны в рабочей debug-панели.
    if (gazeLeft) {
        gazeLeft.rotation.x =
            currentRotX;

        gazeLeft.rotation.y =
            currentRotY;
    }

    if (gazeRight) {
        gazeRight.rotation.x =
            currentRotX;

        gazeRight.rotation.y =
            currentRotY;
    }

    updateGroundShadow();
    renderer.render(
        scene,
        camera
    );
}

render();
if ('requestIdleCallback' in window) {
    window.requestIdleCallback(prepareThoughtNoiseField, { timeout: 3000 });
} else {
    setTimeout(prepareThoughtNoiseField, 1200);
}

// ANIM 1 временно отключена.
// Автозапуск после загрузки выключен.

// Live material controls, separate from the scene implementation.

const materialKeys=Object.keys(SETTINGS).filter(key=>/^(pbr|lighting|groundShadow|imageMaterial|oil|reveal|binary|earring|tapParticle|impactHalo)/.test(key)||/^model(Zoom|MaterialMode|BuiltinMatcapEnabled|Color|MatcapStrength|Brightness|Metalness|Roughness|Matte|Smoothing)$/.test(key)||/^eye(PupilColor|Color|RimShadow|BottomShadow|ShadowSoftness|MatcapStrength|Brightness|Metalness|Roughness|Matte)$/.test(key));
const materialDefaults=Object.fromEntries(materialKeys.map(key=>[key,SETTINGS[key]]));
window.GN_MATERIAL_EDITOR={
  defaults:{...materialDefaults},
  get(){return Object.fromEntries(materialKeys.map(key=>[key,SETTINGS[key]]));},
  set(values){
    for(const [key,value] of Object.entries(values)){
      if(!materialKeys.includes(key))continue;
      const original=materialDefaults[key];
      if(typeof original==='number'&&Number.isFinite(Number(value)))SETTINGS[key]=/MatcapStrength$/.test(key)?Math.max(0,Math.min(1,Number(value))):Number(value);
      else if(typeof original==='boolean'&&typeof value==='boolean')SETTINGS[key]=value;
      else if(typeof original==='string'&&/^#[0-9a-f]{6}$/i.test(value))SETTINGS[key]=value;
    }
    camera.zoom=Math.max(0.5,Math.min(4,SETTINGS.modelZoom));camera.updateProjectionMatrix();
    updateHeadMaterialUniforms();updateEyeWhiteUniforms();pupilMaterial.color.set(SETTINGS.eyePupilColor);updateGnRevealUniformSettings();syncGnRevealPalette();
    updateEarringMaterial();
    if('earringRadius' in values||'earringDepth' in values)updateEarringGeometry();
    updateEarringTransform();syncUploadedMaterial();syncPBRMaterial();syncGroundShadow();
    if("modelSmoothing" in values)syncModelSmoothing();
    window.dispatchEvent(new CustomEvent('gn:material-changed'));
  },
  pbrMaps(){return {...pbrMapData};},
  async restorePBRMaps(maps){for(const role of Object.keys(pbrMaps))if(!maps[role]){pbrMaps[role].dispose();delete pbrMaps[role];delete pbrMapData[role];}await Promise.all(Object.entries(maps).map(([role,data])=>loadPBRMap(role,data.url,data.name)));syncPBRMaterial();window.dispatchEvent(new CustomEvent('gn:material-changed'));},
  removePBRMap(role){pbrMaps[role]?.dispose();delete pbrMaps[role];delete pbrMapData[role];syncPBRMaterial();window.dispatchEvent(new CustomEvent('gn:material-changed'));},


  replay(){replayGnReveal();},
  texture(){return uploadedMaterialData;},
  async setTexture(dataURL,name='Материал',preserveTint=false){
    if(!/^data:image\//.test(dataURL))throw new Error('Выберите изображение');
    const run=++uploadedMaterialRun;
    const texture=await textureLoader.loadAsync(dataURL);
    if(run!==uploadedMaterialRun){texture.dispose();return;}
    texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;
    texture.anisotropy=Math.min(16,renderer.capabilities.getMaxAnisotropy());
    uploadedMaterialTexture?.dispose();uploadedMaterialTexture=texture;uploadedMaterialData={name,dataURL};
    if(!preserveTint){SETTINGS.modelColor="#ffffff";SETTINGS.modelMatcapStrength=1;SETTINGS.modelMaterialMode=SETTINGS.imageMaterialMapping===2?1:0;SETTINGS.oilEnabled=false;updateHeadMaterialUniforms();}
    syncUploadedMaterial();window.dispatchEvent(new CustomEvent('gn:material-changed'));
  },
  removeTexture(){uploadedMaterialRun++;uploadedMaterialTexture?.dispose();uploadedMaterialTexture=null;uploadedMaterialData=null;syncUploadedMaterial();}
};
window.dispatchEvent(new CustomEvent('gn:material-editor-ready'));


