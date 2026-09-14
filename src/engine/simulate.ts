import { isBlocked, key, parseDir, step } from "./coord";
import type { Dir, GameState } from "./types";

function cloneState(state: GameState): GameState {
  return {
    ...state,
    hoover: { ...state.hoover },
    dirt: new Set(state.dirt),
    obstacles: new Set(state.obstacles),
    slides: new Set(state.slides),
  };
}

function vacuum(state: GameState): GameState {
  const cell = key(state.hoover);
  if (!state.dirt.has(cell)) return state;
  const dirt = new Set(state.dirt);
  dirt.delete(cell);
  return { ...state, dirt, cleaned: state.cleaned + 1 };
}

export function createState(seed: GameState): GameState {
  return vacuum(cloneState(seed));
}

function tryStep(state: GameState, dir: Dir): GameState {
  const next = step(state.hoover, dir);
  if (isBlocked(state, next)) return state;
  return vacuum({ ...state, hoover: next });
}

function advance(state: GameState, dir: Dir): GameState {
  let next = tryStep(state, dir);
  if (next.hoover.x === state.hoover.x && next.hoover.y === state.hoover.y) {
    return next;
  }

  while (next.slides.has(key(next.hoover))) {
    const hopped = tryStep(next, dir);
    if (hopped.hoover.x === next.hoover.x && hopped.hoover.y === next.hoover.y) {
      break;
    }
    next = hopped;
  }

  return next;
}

export function applyMove(state: GameState, dir: Dir): GameState {
  if (state.batteryLeft < 1) return state;

  let next = cloneState(state);
  const hops = next.dashArmed ? 2 : 1;
  next.dashArmed = false;
  next.moves += 1;
  next.batteryLeft -= 1;

  for (let i = 0; i < hops; i += 1) {
    next = advance(next, dir);
  }

  return next;
}

export function armDash(state: GameState): GameState {
  if (state.dashArmed || state.dashCharges < 1) return state;
  return { ...cloneState(state), dashCharges: state.dashCharges - 1, dashArmed: true };
}

export function applyMagnet(state: GameState): GameState {
  if (state.magnetLeft < 1) return state;

  const next = cloneState(state);
  next.magnetLeft -= 1;

  for (const dir of ["N", "E", "S", "W"] as const) {
    const neighbour = step(next.hoover, dir);
    const cell = key(neighbour);
    if (next.dirt.has(cell)) {
      next.dirt.delete(cell);
      next.cleaned += 1;
    }
  }

  return next;
}

export function applyInstructions(state: GameState, nesw: string): GameState {
  let next = state;
  for (const char of nesw) {
    const dir = parseDir(char);
    if (!dir) continue;
    next = applyMove(next, dir);
  }
  return next;
}
