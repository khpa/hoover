"use client";

import { useEffect, useRef, useState } from "react";
import { getLevel } from "@/engine";
import type { Dir, LevelId } from "@/engine";
import { playSfx, setMuted, unlockAudio } from "@/game/audio";
import { createSession, reduceSession, type SessionAction, type SessionState } from "@/game/reducer";
import { useMuted } from "@/game/useMuted";
import { recordStars, useProgress } from "@/game/useProgress";
import { Board } from "@/components/game/Board";
import { DPad } from "@/components/game/DPad";
import { Hud } from "@/components/game/Hud";
import { Results } from "@/components/game/Results";
import { TapeDeck } from "@/components/game/TapeDeck";

const arrows: Record<string, Dir> = {
  ArrowUp: "N",
  ArrowRight: "E",
  ArrowDown: "S",
  ArrowLeft: "W",
  w: "N",
  d: "E",
  s: "S",
  a: "W",
};

type GameClientProps = {
  levelId: LevelId;
};

function playOutcome(prev: SessionState, next: SessionState) {
  if (next === prev) return;
  if (next.cleared && !prev.cleared) {
    playSfx("win");
    return;
  }
  if (next.failed && !prev.failed) {
    playSfx("fail");
    return;
  }
  const moved = next.game.moves !== prev.game.moves;
  const armed = next.game.dashArmed !== prev.game.dashArmed;
  const magnet = next.game.magnetLeft !== prev.game.magnetLeft;
  if (next.lastEvent !== "idle" && (moved || armed || magnet || next.lastEvent !== prev.lastEvent)) {
    playSfx(next.lastEvent);
  }
  if (next.lastEvent === "bump" && typeof navigator !== "undefined") {
    navigator.vibrate?.(12);
  }
}

export function GameClient({ levelId }: GameClientProps) {
  const level = getLevel(levelId);
  const [session, setSession] = useState(() => createSession(level));
  const sessionRef = useRef(session);
  const muted = useMuted();
  const progress = useProgress();
  const busy = session.cleared || session.failed || session.tape.playing;

  function send(action: SessionAction) {
    unlockAudio();
    const prev = sessionRef.current;
    const next = reduceSession(prev, action);
    sessionRef.current = next;
    setSession(next);
    playOutcome(prev, next);
  }

  useEffect(() => {
    if (!session.cleared || session.stars === 0) return;
    recordStars(levelId, session.stars, session.game.moves);
  }, [session.cleared, session.stars, session.game.moves, levelId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) {
        return;
      }
      const current = sessionRef.current;
      if (event.key === "Escape" && current.tape.open) {
        event.preventDefault();
        send({ type: "closeTape" });
        return;
      }
      if (current.cleared || current.failed || current.tape.open) return;
      const dir = arrows[event.key] ?? arrows[event.key.toLowerCase()];
      if (!dir) return;
      event.preventDefault();
      send({ type: "move", dir });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!session.tape.playing) return;
    const timer = window.setInterval(() => send({ type: "tickTape" }), 280);
    return () => window.clearInterval(timer);
  }, [session.tape.playing]);

  function swipe(dx: number, dy: number) {
    if (sessionRef.current.cleared || sessionRef.current.failed || sessionRef.current.tape.open) return;
    if (Math.abs(dx) > Math.abs(dy)) {
      send({ type: "move", dir: dx > 0 ? "E" : "W" });
    } else {
      send({ type: "move", dir: dy < 0 ? "N" : "S" });
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (!next) playSfx("coin");
  }

  return (
    <div className={`flex min-h-dvh flex-col bg-cabinet ${session.lastEvent === "bump" ? "bumping" : ""}`}>
      <header className="px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <Hud session={session} muted={muted} onMute={toggleMute} onTape={() => send({ type: "openTape" })} onReset={() => send({ type: "reset" })} />
      </header>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-3 py-3">
        <Board game={session.game} onSwipe={swipe} />
        {session.lastEvent === "bump" ? (
          <p className="pointer-events-none absolute bottom-2 font-score text-xs text-brass" aria-live="polite">
            Bumped the skirting
          </p>
        ) : null}
        <Results
          session={session}
          bestMoves={progress.bestMoves[levelId]}
          onRetry={() => send({ type: "reset" })}
          onTape={() => send({ type: "openTape" })}
          onMagnet={() => send({ type: "magnet" })}
        />
        <TapeDeck
          session={session}
          onClose={() => send({ type: "closeTape" })}
          onChange={(program) => send({ type: "setProgram", program })}
          onPlay={() => send({ type: "playTape" })}
          onStop={() => send({ type: "stopTape" })}
        />
      </div>
      <div className="z-20 border-t border-brass-dark/40 bg-cabinet-deep px-4 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <DPad disabled={busy} onMove={(dir) => send({ type: "move", dir })} />
          <div className="flex gap-2">
            {level.dashCharges > 0 ? (
              <button
                type="button"
                disabled={busy || (session.game.dashCharges < 1 && !session.game.dashArmed)}
                aria-pressed={session.game.dashArmed}
                onClick={() => send({ type: "armDash" })}
                className={`min-h-14 min-w-24 rounded-2xl border-2 px-3 font-display text-lg ${
                  session.game.dashArmed
                    ? "border-brass bg-brass text-navy-deep"
                    : "border-brass-dark bg-navy text-brass"
                } disabled:opacity-40`}
              >
                Dash {session.game.dashCharges}
              </button>
            ) : null}
            {level.magnetCharges > 0 ? (
              <button
                type="button"
                disabled={session.cleared || session.tape.playing || session.game.magnetLeft < 1}
                onClick={() => send({ type: "magnet" })}
                className="min-h-14 min-w-24 rounded-2xl border-2 border-brass-dark bg-navy px-3 font-display text-lg text-brass disabled:opacity-40"
              >
                Magnet {session.game.magnetLeft}
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
