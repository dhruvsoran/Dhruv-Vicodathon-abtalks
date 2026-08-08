/**
 * Brand sound for the curtain intro.
 *
 * Synthesised at runtime rather than shipped as an audio file: no extra
 * network request competing with first paint, and nothing to license.
 *
 * Scope is deliberately narrow — this plays exactly once, during the curtain
 * reveal, and never again. There is no toggle and no persisted setting,
 * because the sound is part of the opening moment rather than an ambient
 * feature of the site.
 *
 * Autoplay policy: browsers block audio until the user has interacted with
 * the page. If the context is blocked at curtain time we simply stay silent
 * rather than deferring the sound to a later gesture — a brand chime firing
 * seconds later, detached from the animation, would be worse than none.
 */

let ctx: AudioContext | null = null;
let played = false;

type WebkitWindow = Window & { webkitAudioContext?: typeof AudioContext };

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (ctx) return ctx;
  const AC = window.AudioContext ?? (window as WebkitWindow).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  return ctx;
}

/** Airy rising whoosh: filtered noise with a sweeping band-pass. */
function whoosh(ac: AudioContext, at: number) {
  const dur = 0.9;
  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    // Amplitude-shaped so it reads as air rather than static.
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames) * 0.6;
  }

  const src = ac.createBufferSource();
  src.buffer = buffer;

  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.Q.value = 1.1;
  band.frequency.setValueAtTime(320, at);
  band.frequency.exponentialRampToValueAtTime(2600, at + 0.55);
  band.frequency.exponentialRampToValueAtTime(900, at + dur);

  const gain = ac.createGain();
  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(0.14, at + 0.18);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  src.connect(band).connect(gain).connect(ac.destination);
  src.start(at);
  src.stop(at + dur);
}

/** Two-note ember chime, a rising fifth. */
function chime(ac: AudioContext, at: number) {
  [
    { f: 587.33, t: 0, g: 0.09 }, // D5
    { f: 880.0, t: 0.14, g: 0.075 }, // A5
  ].forEach(({ f, t, g }) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    const start = at + t;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(g, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 1.2);
  });
}

/** Speak the brand name. Spaced so voices say "A-B Talks", not "abtalks". */
function speak() {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  const say = () => {
    synth.cancel();
    const u = new SpeechSynthesisUtterance("A B Talks");
    u.rate = 0.92;
    u.pitch = 1.02;
    u.volume = 0.95;
    const voices = synth.getVoices();
    const preferred =
      voices.find(
        (v) => /en-(GB|US|IN)/i.test(v.lang) && /female|samantha|aria|zira/i.test(v.name),
      ) ?? voices.find((v) => /^en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    synth.speak(u);
  };

  if (synth.getVoices().length) say();
  else synth.addEventListener("voiceschanged", say, { once: true });
}

function emit() {
  if (played) return;
  const ac = getCtx();
  if (!ac || ac.state !== "running") return;
  played = true;
  const now = ac.currentTime + 0.02;
  whoosh(ac, now);
  chime(ac, now + 0.1);
  speak();
}

const GESTURES = ["pointerdown", "keydown", "touchstart", "wheel", "scroll"] as const;

/**
 * Warm the audio context as early as possible.
 *
 * Browsers block audio until the page has been interacted with. Calling this
 * on mount means that by the time the curtain parts, any interaction the
 * visitor has already made (a tap, a scroll, a key press) has unlocked
 * playback — so the brand sound is far more likely to be audible.
 */
export function primeAudio() {
  const ac = getCtx();
  if (!ac || ac.state === "running") return;

  const unlock = () => {
    ac.resume().catch(() => {});
    GESTURES.forEach((e) => window.removeEventListener(e, unlock));
  };
  GESTURES.forEach((e) => window.addEventListener(e, unlock, { passive: true }));
}

/**
 * Play the brand sound once, on the beat the curtain parts.
 *
 * If the browser has blocked audio, we allow a **short grace window** during
 * which the visitor's first interaction still triggers it. The window is
 * deliberately bounded: a brand chime firing minutes later, detached from the
 * animation, would be worse than silence.
 */
export function playBrandSound(graceMs = 2500) {
  if (played) return;
  const ac = getCtx();
  if (!ac) return;

  if (ac.state === "running") {
    emit();
    return;
  }

  ac.resume().then(emit, () => {});

  const fire = () => {
    ac.resume().then(emit, () => {});
    stop();
  };
  const stop = () => GESTURES.forEach((e) => window.removeEventListener(e, fire));

  GESTURES.forEach((e) => window.addEventListener(e, fire, { passive: true }));
  window.setTimeout(stop, graceMs);
}
