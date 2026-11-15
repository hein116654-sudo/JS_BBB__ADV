import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ==========================================
// 1. URL Parameters & Customization Setup
// ==========================================
const params = new URLSearchParams(window.location.search);
const THEMES = {
  pink: {
    sponge: 0xff9ebb,
    topSponge: 0xffb3c9,
    frosting: 0xfff5f8,
    drip: 0xff5d9e,
    accent: 0xff3b7f,
  },
  choco: {
    sponge: 0x5c3317,
    topSponge: 0x734222,
    frosting: 0x3b1e0e,
    drip: 0x261107,
    accent: 0xffb703,
  },
  blue: {
    sponge: 0x8ecae6,
    topSponge: 0xa8dadc,
    frosting: 0xf1faee,
    drip: 0x219ebc,
    accent: 0xffafcc,
  }
};

const currentConfig = {
  to: params.get('to') || 'Chit Thu',
  from: params.get('from') || 'Your Special Someone',
  msg: params.get('msg') || 'မွေးနေ့မှစပြီး နောင်နှစ်ပေါင်းများစွာတိုင်အောင် ပျော်ရွှင်ချမ်းမြေ့ပြီး စိတ်ကူးအိပ်မက်တွေ အကုန်ပြည့်ဝပါစေနော်! 🥳💐',
  theme: THEMES[params.get('theme')] ? params.get('theme') : 'pink'
};

// Hide settings icon automatically if opened as a gift link (?gift=1)
if (params.get('gift') === '1') {
  document.getElementById('open-customizer-btn').classList.add('hidden');
}

document.getElementById('display-to').textContent = currentConfig.to;
document.getElementById('display-from').textContent = currentConfig.from;
document.getElementById('display-msg').textContent = currentConfig.msg;

// ==========================================
// 2. Web Audio API (Sound Effects & Melody)
// ==========================================
let audioCtx = null;

function ensureAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playPopSound(pitch = 520) {
  try {
    ensureAudio();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(pitch * 1.6, audioCtx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.11);
  } catch (e) {}
}

function playBirthdayChime() {
  try {
    ensureAudio();
    // Happy Birthday first 2 phrases (C4 C4 D4 C4 F4 E4)
    const notes = [
      { f: 261.63, t: 0.0, d: 0.25 },
      { f: 261.63, t: 0.28, d: 0.2 },
      { f: 293.66, t: 0.52, d: 0.45 },
      { f: 261.63, t: 1.0, d: 0.45 },
      { f: 349.23, t: 1.5, d: 0.45 },
      { f: 329.63, t: 2.0, d: 0.8 },
    ];
    notes.forEach(({ f, t, d }) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, audioCtx.currentTime + t);
      gain.gain.setValueAtTime(0.001, audioCtx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.14, audioCtx.currentTime + t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + t + d);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(audioCtx.currentTime + t);
      osc.stop(audioCtx.currentTime + t + d + 0.05);
    });
  } catch (e) {}
}

// ==========================================
// 3. Three.js Scene, Camera, Lights
// ==========================================
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 3.6, 6.4);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 4;
controls.maxDistance = 9;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.target.set(0, 0.8, 0);

// Lights
const hemiLight = new THREE.HemisphereLight(0xffeef8, 0x26123d, 1.0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(4, 7, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(1024, 1024);
scene.add(dirLight);

const rimLight = new THREE.PointLight(0xff5d9e, 1.8, 12);
rimLight.position.set(-4, 3, -3);
scene.add(rimLight);

// Floating Background Sparkles
const starGeo = new THREE.BufferGeometry();
const starCount = 140;
const starPos = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i++) {
  starPos[i * 3] = (Math.random() - 0.5) * 16;
  starPos[i * 3 + 1] = Math.random() * 9 - 1;
  starPos[i * 3 + 2] = (Math.random() - 0.5) * 16;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xffd166,
  size: 0.07,
  transparent: true,
  opacity: 0.75
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ==========================================
// 4. Procedural 3D Cake Builder
// ==========================================
const cakeGroup = new THREE.Group();
scene.add(cakeGroup);

let topCakeMesh = null; // For raycasting manual candle placement
const TOP_TIER_Y = 1.66; // Y surface where candles stand

function buildCake(themeKey) {
  // Clear previous cake
  while (cakeGroup.children.length > 0) {
    cakeGroup.remove(cakeGroup.children[0]);
  }
  const palette = THEMES[themeKey];

  // Golden Cake Stand
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xffd166, metalness: 0.65, roughness: 0.25 });
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 1.85, 0.14, 48), plateMat);
  plate.position.y = 0.07;
  plate.receiveShadow = true;
  cakeGroup.add(plate);

  const standPedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.7, 0.45, 32), plateMat);
  standPedestal.position.y = -0.22;
  cakeGroup.add(standPedestal);

  // Bottom Tier
  const bottomSpongeMat = new THREE.MeshStandardMaterial({ color: palette.sponge, roughness: 0.55 });
  const bottomTier = new THREE.Mesh(new THREE.CylinderGeometry(1.55, 1.55, 0.82, 48), bottomSpongeMat);
  bottomTier.position.y = 0.55;
  bottomTier.castShadow = true;
  bottomTier.receiveShadow = true;
  cakeGroup.add(bottomTier);

  // Bottom Frosting Top + Drips
  const frostingMat = new THREE.MeshStandardMaterial({ color: palette.frosting, roughness: 0.35 });
  const bottomCap = new THREE.Mesh(new THREE.CylinderGeometry(1.59, 1.59, 0.12, 48), frostingMat);
  bottomCap.position.y = 0.94;
  cakeGroup.add(bottomCap);

  const dripMat = new THREE.MeshStandardMaterial({ color: palette.drip, roughness: 0.28 });
  for (let i = 0; i < 20; i++) {
    const angle = (i / 20) * Math.PI * 2;
    const dripLen = 0.15 + (i % 3) * 0.1;
    const drip = new THREE.Mesh(new THREE.CapsuleGeometry(0.065, dripLen, 6, 12), dripMat);
    drip.position.set(Math.cos(angle) * 1.56, 0.92 - dripLen / 2, Math.sin(angle) * 1.56);
    cakeGroup.add(drip);
  }

  // Top Tier
  const topSpongeMat = new THREE.MeshStandardMaterial({ color: palette.topSponge, roughness: 0.5 });
  topCakeMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.06, 1.06, 0.68, 48), topSpongeMat);
  topCakeMesh.position.y = 1.3;
  topCakeMesh.castShadow = true;
  topCakeMesh.receiveShadow = true;
  cakeGroup.add(topCakeMesh);

  // Top Frosting Cap
  const topCap = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 0.12, 48), frostingMat);
  topCap.position.y = 1.62;
  topCap.receiveShadow = true;
  cakeGroup.add(topCap);

  // Top Drips
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const dripLen = 0.12 + (i % 2) * 0.11;
    const drip = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, dripLen, 6, 10), dripMat);
    drip.position.set(Math.cos(angle) * 1.07, 1.6 - dripLen / 2, Math.sin(angle) * 1.07);
    cakeGroup.add(drip);
  }

  // Whipped Cream Dollops around top rim
  const dollopGeo = new THREE.SphereGeometry(0.11, 16, 16);
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const dollop = new THREE.Mesh(dollopGeo, frostingMat);
    dollop.scale.set(1, 0.85, 1);
    dollop.position.set(Math.cos(angle) * 0.92, 1.71, Math.sin(angle) * 0.92);
    cakeGroup.add(dollop);
  }

  // Cute 3D Strawberries / Cherries on bottom rim
  const berryMat = new THREE.MeshStandardMaterial({ color: palette.accent, roughness: 0.25 });
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x38b000, roughness: 0.5 });
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2 + 0.2;
    const berry = new THREE.Mesh(new THREE.SphereGeometry(0.095, 16, 16), berryMat);
    berry.scale.set(1, 1.15, 1);
    berry.position.set(Math.cos(angle) * 1.34, 1.05, Math.sin(angle) * 1.34);
    cakeGroup.add(berry);

    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.04, 5), leafMat);
    leaf.position.set(Math.cos(angle) * 1.34, 1.15, Math.sin(angle) * 1.34);
    cakeGroup.add(leaf);
  }

  // Colorful Sprinkles on top
  const sprinkleColors = [0xffd166, 0xff5d9e, 0x4cc9f0, 0x80ed99];
  for (let i = 0; i < 28; i++) {
    const r = Math.random() * 0.78;
    const a = Math.random() * Math.PI * 2;
    const spMat = new THREE.MeshStandardMaterial({ color: sprinkleColors[i % sprinkleColors.length] });
    const sp = new THREE.Mesh(new THREE.CapsuleGeometry(0.015, 0.05, 4, 6), spMat);
    sp.position.set(Math.cos(a) * r, 1.69, Math.sin(a) * r);
    sp.rotation.set(Math.PI / 2, 0, Math.random() * Math.PI);
    cakeGroup.add(sp);
  }
}

buildCake(currentConfig.theme);

// ==========================================
// 5. Candles, Flames & Smoke Particles
// ==========================================
const candles = [];
const smokeParticles = [];

function createStripeTexture(colorHex) {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = colorHex;
  for (let y = -64; y < 128; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(64, y + 24);
    ctx.lineTo(64, y + 34);
    ctx.lineTo(0, y + 10);
    ctx.closePath();
    ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const candleColors = ['#ff5d9e', '#4cc9f0', '#ffd166', '#9b5de5', '#00f5d4'];

function spawnCandle(x, z, delay = 0) {
  if (candles.length >= 12) return;
  const group = new THREE.Group();
  const color = candleColors[candles.length % candleColors.length];

  const waxMat = new THREE.MeshStandardMaterial({
    map: createStripeTexture(color),
    roughness: 0.4
  });
  const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.62, 16), waxMat);
  wax.position.y = 0.31;
  wax.castShadow = true;
  group.add(wax);

  // Wick
  const wick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.009, 0.009, 0.08, 8),
    new THREE.MeshBasicMaterial({ color: 0x222222 })
  );
  wick.position.y = 0.66;
  group.add(wick);

  // Outer Flame
  const flameGroup = new THREE.Group();
  flameGroup.position.y = 0.76;
  flameGroup.scale.set(0, 0, 0);

  const outerFlame = new THREE.Mesh(
    new THREE.SphereGeometry(0.055, 14, 14),
    new THREE.MeshBasicMaterial({ color: 0xff8c00, transparent: true, opacity: 0.9 })
  );
  outerFlame.scale.set(0.85, 1.85, 0.85);
  flameGroup.add(outerFlame);

  const innerFlame = new THREE.Mesh(
    new THREE.SphereGeometry(0.03, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xfff5aa })
  );
  innerFlame.scale.set(0.75, 1.5, 0.75);
  innerFlame.position.y = -0.015;
  flameGroup.add(innerFlame);

  const flameLight = new THREE.PointLight(0xffaa33, 0, 3.2);
  flameLight.position.y = 0.05;
  flameGroup.add(flameLight);

  group.add(flameGroup);

  // Start high above for drop-in animation
  group.position.set(x, TOP_TIER_Y + 2.4, z);
  scene.add(group);

  const candleObj = { group, flameGroup, flameLight, x, z, phase: Math.random() * Math.PI * 2 };
  candles.push(candleObj);

  gsap.to(group.position, {
    y: TOP_TIER_Y,
    duration: 0.65,
    delay,
    ease: 'bounce.out',
    onStart: () => playPopSound(480 + candles.length * 35)
  });
}

function spawnSmoke(x, y, z) {
  for (let i = 0; i < 5; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0xd8d8e6,
      transparent: true,
      opacity: 0.55
    });
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), mat);
    puff.position.set(
      x + (Math.random() - 0.5) * 0.05,
      y + i * 0.05,
      z + (Math.random() - 0.5) * 0.05
    );
    scene.add(puff);
    smokeParticles.push({
      mesh: puff,
      vx: (Math.random() - 0.5) * 0.008,
      vy: 0.012 + Math.random() * 0.008,
      life: 1.0
    });
  }
}

// ==========================================
// 6. State Machine & User Interactions
// ==========================================
// States: 'READY' -> 'PLANTED' -> 'LIT' -> 'BLOWN'
let state = 'READY';

const dot0 = document.getElementById('dot-0');
const dot1 = document.getElementById('dot-1');
const dot2 = document.getElementById('dot-2');
const statusText = document.getElementById('status-text');
const btnPlant = document.getElementById('btn-plant');
const btnLight = document.getElementById('btn-light');
const blowControls = document.getElementById('blow-controls');
const btnMic = document.getElementById('btn-mic');
const btnTapBlow = document.getElementById('btn-tap-blow');
const blowMeterWrap = document.getElementById('blow-meter-wrap');
const blowBarFill = document.getElementById('blow-bar-fill');
const blowPercent = document.getElementById('blow-percent');
const wishBackdrop = document.getElementById('wish-modal-backdrop');
const wishModal = document.getElementById('wish-modal');

function updateDots(step) {
  [dot0, dot1, dot2].forEach((d, idx) => {
    d.classList.toggle('active', idx === step);
  });
}

// Step 1: Plant Candles
btnPlant.addEventListener('click', () => {
  if (state !== 'READY') return;
  state = 'PLANTED';

  const count = 5;
  const radius = 0.52;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2;
    spawnCandle(Math.cos(a) * radius, Math.sin(a) * radius, i * 0.12);
  }

  btnPlant.classList.add('hidden');
  btnLight.classList.remove('hidden');
  updateDots(1);
  statusText.textContent = 'ကိတ်ပေါ် ထပ်တို့ပြီး ဖယောင်းတိုင် ထပ်စိုက်နိုင်သေးတယ်နော် ✨ အဆင်သင့်ဖြစ်ရင် မီးထွန်းမယ်!';
});

// Optional: Tap on top of cake to plant extra candles!
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let downPos = { x: 0, y: 0 };

renderer.domElement.addEventListener('pointerdown', (e) => {
  downPos = { x: e.clientX, y: e.clientY };
});

renderer.domElement.addEventListener('pointerup', (e) => {
  const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
  if (dist > 6) return; // Ignore drag/rotate gestures
  if (state !== 'READY' && state !== 'PLANTED') return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  if (topCakeMesh) {
    const hits = raycaster.intersectObject(topCakeMesh);
    if (hits.length > 0) {
      const p = hits[0].point;
      if (Math.hypot(p.x, p.z) < 0.78) {
        spawnCandle(p.x, p.z, 0);
        if (state === 'READY') {
          state = 'PLANTED';
          btnPlant.classList.add('hidden');
          btnLight.classList.remove('hidden');
          updateDots(1);
        }
      }
    }
  }
});

// Step 2: Light Candles
btnLight.addEventListener('click', () => {
  if (state !== 'PLANTED') return;
  state = 'LIT';

  // Dim room lights for dramatic candle glow
  gsap.to(hemiLight, { intensity: 0.35, duration: 1.0 });
  gsap.to(dirLight, { intensity: 0.45, duration: 1.0 });

  candles.forEach((c, i) => {
    gsap.to(c.flameGroup.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.45,
      delay: i * 0.14,
      ease: 'back.out(2)',
      onStart: () => playPopSound(700 + i * 40)
    });
    gsap.to(c.flameLight, {
      intensity: 1.35,
      duration: 0.5,
      delay: i * 0.14
    });
  });

  setTimeout(() => playBirthdayChime(), 500);

  btnLight.classList.add('hidden');
  blowControls.classList.remove('hidden');
  updateDots(2);
  statusText.textContent = 'ဆုတောင်းလေး တောင်းပြီး ဖယောင်းတိုင် မှုတ်လိုက်တော့! 🎂💨';
});

// Step 3A: Mic Blow Detection
let micStream = null;
let analyser = null;
let micActive = false;
let blowProgress = 0;

btnMic.addEventListener('click', async () => {
  try {
    ensureAudio();
    micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioCtx.createMediaStreamSource(micStream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    micActive = true;
    btnMic.classList.add('hidden');
    blowMeterWrap.classList.remove('hidden');
    statusText.textContent = 'ဖုန်း Mic နားကပ်ပြီး "ဖူး" ဆို မှုတ်လိုက်ပါ! 🌬️🔥';
  } catch (err) {
    statusText.textContent = 'Mic ခွင့်ပြုချက် မရပါ — အောက်က "နှိပ်ပြီး မှုတ်မယ်" ခလုတ်ကို သုံးပါ 👇';
    btnMic.classList.add('hidden');
  }
});

// Step 3B: Tap fallback to blow out
btnTapBlow.addEventListener('click', () => {
  if (state !== 'LIT') return;
  blowProgress = 100;
  blowBarFill.style.width = '100%';
  blowPercent.textContent = '100%';
  extinguishCandles();
});

function stopMic() {
  micActive = false;
  if (micStream) {
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
}

function extinguishCandles() {
  if (state !== 'LIT') return;
  state = 'BLOWN';
  stopMic();

  // Extinguish flames + spawn smoke
  candles.forEach((c, i) => {
    gsap.to(c.flameGroup.scale, {
      x: 0, y: 0, z: 0,
      duration: 0.28,
      delay: i * 0.05,
      ease: 'power2.in'
    });
    gsap.to(c.flameLight, {
      intensity: 0,
      duration: 0.25,
      delay: i * 0.05
    });
    setTimeout(() => {
      spawnSmoke(c.x, TOP_TIER_Y + 0.72, c.z);
    }, i * 50);
  });

  // Restore room brightness
  gsap.to(hemiLight, { intensity: 1.0, duration: 1.2 });
  gsap.to(dirLight, { intensity: 1.3, duration: 1.2 });

  // Confetti Celebration!
  fireConfetti();

  // Drop down Birthday Wish Modal after a short pause
  setTimeout(() => {
    wishBackdrop.classList.remove('hidden');
    gsap.fromTo(
      wishModal,
      { y: -window.innerHeight * 0.7, opacity: 0, scale: 0.85, rotation: -4 },
      { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 1.05, ease: 'bounce.out' }
    );
  }, 850);
}

function fireConfetti() {
  const colors = ['#ff5d9e', '#ffd166', '#4cc9f0', '#80ed99', '#ffffff'];
  confetti({
    particleCount: 80,
    spread: 75,
    origin: { y: 0.6 },
    colors
  });
  setTimeout(() => {
    confetti({ particleCount: 55, angle: 60, spread: 60, origin: { x: 0, y: 0.65 }, colors });
    confetti({ particleCount: 55, angle: 120, spread: 60, origin: { x: 1, y: 0.65 }, colors });
  }, 250);
}

// Replay Button
document.getElementById('btn-replay').addEventListener('click', () => {
  wishBackdrop.classList.add('hidden');
  candles.forEach(c => scene.remove(c.group));
  candles.length = 0;
  blowProgress = 0;
  blowBarFill.style.width = '0%';
  blowPercent.textContent = '0%';

  state = 'READY';
  updateDots(0);
  btnPlant.classList.remove('hidden');
  btnLight.classList.add('hidden');
  blowControls.classList.add('hidden');
  btnMic.classList.remove('hidden');
  blowMeterWrap.classList.add('hidden');
  statusText.textContent = 'မွေးနေ့ကိတ်လေးပေါ်မှာ ဖယောင်းတိုင် စိုက်ကြရအောင်! 🕯️';
});

// ==========================================
// 7. Seller Customizer Panel
// ==========================================
const customizerBackdrop = document.getElementById('customizer-backdrop');
document.getElementById('open-customizer-btn').addEventListener('click', () => {
  document.getElementById('input-to').value = currentConfig.to;
  document.getElementById('input-from').value = currentConfig.from;
  document.getElementById('input-msg').value = currentConfig.msg;
  document.getElementById('input-theme').value = currentConfig.theme;
  document.getElementById('copy-feedback').textContent = '';
  customizerBackdrop.classList.remove('hidden');
});

document.getElementById('close-customizer-btn').addEventListener('click', () => {
  customizerBackdrop.classList.add('hidden');
});

document.getElementById('btn-generate-link').addEventListener('click', async () => {
  const to = document.getElementById('input-to').value.trim() || 'Chit Thu';
  const from = document.getElementById('input-from').value.trim() || 'Special Someone';
  const msg = document.getElementById('input-msg').value.trim() || currentConfig.msg;
  const theme = document.getElementById('input-theme').value;

  const url = new URL(window.location.href.split('?')[0]);
  url.searchParams.set('to', to);
  url.searchParams.set('from', from);
  url.searchParams.set('msg', msg);
  url.searchParams.set('theme', theme);
  url.searchParams.set('gift', '1');

  // Apply live preview immediately
  currentConfig.to = to;
  currentConfig.from = from;
  currentConfig.msg = msg;
  currentConfig.theme = theme;
  document.getElementById('display-to').textContent = to;
  document.getElementById('display-from').textContent = from;
  document.getElementById('display-msg').textContent = msg;
  buildCake(theme);

  try {
    await navigator.clipboard.writeText(url.toString());
    document.getElementById('copy-feedback').textContent = '✅ Personalized Link ကို Copy ကူးပြီးပါပြီ!';
  } catch {
    document.getElementById('copy-feedback').textContent = url.toString();
  }
});

// ==========================================
// 8. Animation Loop
// ==========================================
const clock = new THREE.Clock();
const dataArray = new Uint8Array(128);

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  // Twinkle background stars
  stars.rotation.y = t * 0.03;

  // Mic Blow Analysis
  let blowIntensity = 0;
  if (state === 'LIT' && micActive && analyser) {
    analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;

    if (avg > 32) {
      blowIntensity = Math.min((avg - 32) / 50, 1);
      blowProgress = Math.min(100, blowProgress + blowIntensity * 5.5);
    } else {
      blowProgress = Math.max(0, blowProgress - 0.8);
    }

    const pct = Math.round(blowProgress);
    blowBarFill.style.width = `${pct}%`;
    blowPercent.textContent = `${pct}%`;

    if (blowProgress >= 100) {
      extinguishCandles();
    }
  }

  // Flicker & Sway Flames
  if (state === 'LIT') {
    candles.forEach((c) => {
      const flicker = 0.92 + Math.sin(t * 18 + c.phase) * 0.1 + Math.cos(t * 27 + c.phase) * 0.06;
      const sway = blowIntensity * 0.55;
      c.flameGroup.scale.set(
        flicker * (1 - sway * 0.3),
        flicker * (1 - sway * 0.4),
        flicker
      );
      c.flameGroup.rotation.z = Math.sin(t * 14 + c.phase) * (0.06 + sway * 0.7);
      c.flameLight.intensity = (1.25 + Math.sin(t * 22 + c.phase) * 0.25) * (1 - sway * 0.4);
    });
  }

  // Animate Smoke Particles
  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    const p = smokeParticles[i];
    p.mesh.position.x += p.vx;
    p.mesh.position.y += p.vy;
    p.mesh.scale.multiplyScalar(1.025);
    p.life -= 0.016;
    p.mesh.material.opacity = Math.max(0, p.life * 0.55);
    if (p.life <= 0) {
      scene.remove(p.mesh);
      smokeParticles.splice(i, 1);
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Responsive Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});