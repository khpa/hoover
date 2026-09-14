import { applyMagnet, applyMove, armDash, createLevelState, parseDir, starsFor } from "@/engine";
import type { Dir, GameState, LevelDef } from "@/engine";

export type LastEvent = "idle" | "move" | "clean" | "bump" | "dash" | "magnet" | "arm";

export type TapeState = {
  open: boolean;
  program: string;
  index: number;
  playing: boolean;
};

export type SessionState = {
  level: LevelDef;
  game: GameState;
  lastEvent: LastEvent;
  combo: number;
  cleared: boolean;
  failed: boolean;
  stars: 0 | 1 | 2 | 3;
  tape: TapeState;
};

export type SessionAction =
  | { type: "move"; dir: Dir }
  | { type: "armDash" }
  | { type: "magnet" }
  | { type: "reset" }
  | { type: "openTape" }
  | { type: "closeTape" }
  | { type: "setProgram"; program: string }
  | { type: "playTape" }
  | { type: "tickTape" }
  | { type: "stopTape" };

const idleTape: TapeState = {
  open: false,
  program: "",
  index: 0,
  playing: false,
};

function withOutcome(level: LevelDef, game: GameState, lastEvent: LastEvent, combo: number): SessionState {
  const cleared = game.dirt.size === 0;
  return {
    level,
    game,
    lastEvent,
    combo,
    cleared,
    failed: !cleared && game.batteryLeft < 1,
    stars: cleared ? starsFor(game.moves, level.par) : 0,
    tape: idleTape,
  };
}

export function createSession(level: LevelDef): SessionState {
  return withOutcome(level, createLevelState(level), "idle", 0);
}

function applyGameMove(session: SessionState, dir: Dir): SessionState {
  const wasArmed = session.game.dashArmed;
  const previous = session.game.hoover;
  const previousCleaned = session.game.cleaned;
  const game = applyMove(session.game, dir);
  const moved = game.hoover.x !== previous.x || game.hoover.y !== previous.y;
  const cleanedNow = game.cleaned > previousCleaned;

  let lastEvent: LastEvent = "move";
  if (!moved) lastEvent = "bump";
  else if (cleanedNow) lastEvent = "clean";
  else if (wasArmed) lastEvent = "dash";

  const combo = lastEvent === "bump" ? 0 : cleanedNow ? session.combo + 1 : session.combo;
  const next = withOutcome(session.level, game, lastEvent, combo);
  next.tape = session.tape;
  return next;
}

export function reduceSession(session: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case "move":
      if (session.cleared || session.failed || session.tape.playing) return session;
      return applyGameMove(session, action.dir);
    case "armDash": {
      if (session.cleared || session.failed || session.tape.playing) return session;
      const game = armDash(session.game);
      if (game === session.game) return session;
      return { ...session, game, lastEvent: "arm" };
    }
    case "magnet": {
      if (session.cleared || session.tape.playing) return session;
      const previousCleaned = session.game.cleaned;
      const game = applyMagnet(session.game);
      if (game === session.game) return session;
      const cleanedNow = game.cleaned > previousCleaned;
      const next = withOutcome(
        session.level,
        game,
        "magnet",
        cleanedNow ? session.combo + 1 : session.combo,
      );
      next.tape = session.tape;
      return next;
    }
    case "reset":
      return createSession(session.level);
    case "openTape":
      return {
        ...session,
        tape: { ...session.tape, open: true, playing: false },
      };
    case "closeTape":
      return { ...session, tape: { ...session.tape, open: false, playing: false } };
    case "setProgram":
      return {
        ...session,
        tape: { ...session.tape, program: action.program.toUpperCase(), index: 0, playing: false },
      };
    case "playTape":
      if (!session.tape.program.length) return session;
      return {
        ...createSession(session.level),
        tape: { ...session.tape, open: true, index: 0, playing: true, program: session.tape.program },
      };
    case "tickTape": {
      if (!session.tape.playing) return session;
      const char = session.tape.program[session.tape.index];
      if (!char) {
        return { ...session, tape: { ...session.tape, playing: false } };
      }
      const dir = parseDir(char);
      const advanced = { ...session.tape, index: session.tape.index + 1 };
      const done = advanced.index >= session.tape.program.length;
      advanced.playing = !done;
      if (!dir) {
        return { ...session, tape: advanced };
      }
      const moved = applyGameMove(session, dir);
      return { ...moved, tape: { ...advanced, open: true } };
    }
    case "stopTape":
      return { ...session, tape: { ...session.tape, playing: false } };
    default:
      return session;
  }
}
