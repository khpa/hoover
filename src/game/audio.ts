export type Sfx = "move" | "clean" | "bump" | "dash" | "magnet" | "win" | "fail" | "arm" | "coin";

export type Tone = {
  freq: number;
  duration: number;
  type: OscillatorType;
};

const TONES: Record<Sfx, Tone> = {
  move: { freq: 220, duration: 0.05, type: "square" },
  clean: { freq: 523, duration: 0.09, type: "triangle" },
  bump: { freq: 90, duration: 0.12, type: "sawtooth" },
  dash: { freq: 392, duration: 0.08, type: "square" },
  magnet: { freq: 659, duration: 0.14, type: "triangle" },
  win: { freq: 784, duration: 0.22, type: "triangle" },
  fail: { freq: 73, duration: 0.28, type: "sawtooth" },
  arm: { freq: 330, duration: 0.07, type: "square" },
  coin: { freq: 988, duration: 0.12, type: "square" },
};

export function toneFor(sfx: Sfx): Tone {
  return TONES[sfx];
}

const MUTE_KEY = "hoover-arcade-mute";
const MUTE_CHANGE = "hoover-arcade-mute-change";

function readMuted() {
  if (typeof window === "undefined") return true;
  const raw = window.localStorage.getItem(MUTE_KEY);
  return raw == null ? true : raw === "1";
}

type WebAudioWindow = Window & { webkitAudioContext?: typeof AudioContext };

let context: AudioContext | null = null;
let muted = true;

export function isMuted() {
  return muted;
}

export function hydrateMute() {
  muted = readMuted();
  return muted;
}

function emitMute() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MUTE_CHANGE));
  }
}

export function setMuted(next: boolean) {
  muted = next;
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MUTE_KEY, next ? "1" : "0");
  }
  emitMute();
  if (!muted) {
    unlockAudio();
  }
}

export function subscribeMute(onChange: () => void) {
  window.addEventListener(MUTE_CHANGE, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(MUTE_CHANGE, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function unlockAudio() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || (window as WebAudioWindow).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!context) context = new AudioCtx();
  if (context.state === "suspended") {
    void context.resume();
  }
  return context;
}

function beep(sfx: Sfx) {
  if (!context || muted || context.state === "closed") return;
  const tone = toneFor(sfx);
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = tone.type;
  osc.frequency.setValueAtTime(tone.freq, context.currentTime);
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + Math.max(tone.duration, 0.04));
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start();
  osc.stop(context.currentTime + tone.duration);
}

export function playSfx(sfx: Sfx) {
  if (muted || typeof window === "undefined") return;
  const ctx = unlockAudio();
  if (!ctx) return;
  if (ctx.state === "running") {
    beep(sfx);
    return;
  }
  void ctx.resume().then(() => beep(sfx));
}
