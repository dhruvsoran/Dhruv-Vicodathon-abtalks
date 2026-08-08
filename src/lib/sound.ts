/**
 * Brand sound for the curtain intro.
 *
 * Two layers, both generated at runtime so there is no audio asset to
 * download and nothing to block the first paint:
 *   1. a synthesised whoosh + chime as the curtain parts (Web Audio)
 *   2. the spoken word "ABTalks" (Web Speech API)
 *
 * Autoplay reality: every major browser blocks audio until the user has
 * interacted with the page. We therefore attempt playback, and if the audio
 * context is still suspended we arm a one-shot listener so the sound plays on
 * the first tap, click, key press or scroll instead of being lost.
 */

const KEY = "abtalks.sound";

let ctx: AudioContext | null = null;
let armed = false;
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

export function isMuted(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return localStorage.getItem(KEY) === "off";
  } catch {
    return false;
  }
}

export function setMuted(muted: boolean) {
  try {
    localStorage.setItem(KEY, muted ? "off" : "on");
  } catch {}
  if (muted && typeof window !== "undefined") {
    window.speechSynthesis?.cancel();
  }
}

/** Airy rising whoosh: filtered noise with a sweeping band-pass. */
function whoosh(ac: AudioContext, at: number) {
  const dur = 0.9;
  const frames = Math.floor(ac.sampleRate * dur);
  const buffer = ac.createBuffer(1, frames, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    // Soften the noise so it reads as air rather than static.
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
      voices.find((v) => /en-(GB|US|IN)/i.test(v.lang) && /female|samantha|aria|zira/i.test(v.name)) ??
      voices.find((v) => /^en/i.test(v.lang));
    if (preferred) u.voice = preferred;
    synth.speak(u);
  };

  if (synth.getVoices().length) say();
  else synth.addEventListener("voiceschanged", say, { once: true });
}

function emit() {
  if (played || isMuted()) return;
  const ac = getCtx();
  if (!ac) return;
  played = true;
  const now = ac.currentTime + 0.02;
  whoosh(ac, now);
  chime(ac, now + 0.1);
  speak();
}

/**
 * Play the brand sound, falling back to the first user gesture if the
 * browser's autoplay policy has suspended the audio context.
 */
export function playBrandSound() {
  if (played || isMuted()) return;
  const ac = getCtx();
  if (!ac) return;

  if (ac.state === "running") {
    emit();
    return;
  }

  ac.resume().then(
    () => emit(),
    () => armGesture(),
  );

  // resume() can also stay pending indefinitely while blocked.
  window.setTimeout(() => {
    if (!played) armGesture();
  }, 260);
}

function armGesture() {
  if (armed || played) return;
  armed = true;

  const fire = () => {
    const ac = getCtx();
    ac?.resume().finally(emit);
    off();
  };
  const off = () => {
    ["pointerdown", "keydown", "touchstart", "wheel", "scroll"].forEach((e) =>
      window.removeEventListener(e, fire),
    );
  };

  ["pointerdown", "keydown", "touchstart", "wheel", "scroll"].forEach((e) =>
    window.addEventListener(e, fire, { once: true, passive: true }),
  );
}

/** Lets the toggle replay the sound as confirmation when unmuting. */
export function replayBrandSound() {
  played = false;
  playBrandSound();
}
