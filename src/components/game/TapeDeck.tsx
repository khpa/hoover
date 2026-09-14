"use client";

import { useEffect, useRef } from "react";
import type { SessionState } from "@/game/reducer";

type TapeDeckProps = {
  session: SessionState;
  onClose: () => void;
  onChange: (program: string) => void;
  onPlay: () => void;
  onStop: () => void;
};

export function TapeDeck({ session, onClose, onChange, onPlay, onStop }: TapeDeckProps) {
  const field = useRef<HTMLTextAreaElement>(null);
  const open = session.tape.open;

  useEffect(() => {
    if (!open) return;
    field.current?.focus();
  }, [open]);

  if (!open) return null;
  const head = session.tape.program.slice(0, session.tape.index);

  return (
    <div className="absolute inset-0 z-40 flex items-end justify-center bg-navy-deep/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tape-title"
        className="w-full max-w-md rounded-[22px] border-4 border-brass-dark bg-navy px-4 py-5 text-lcd shadow-[0_12px_0_#0a0d1c]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-score text-xs text-brass">Tape deck</p>
            <h2 id="tape-title" className="font-display text-2xl text-hoover">
              NESW
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-full border border-brass/40 px-3 font-score text-xs text-brass"
          >
            Close
          </button>
        </div>
        <p className="mt-2 text-sm text-lcd/80">
          Paste a driving string. Same engine as the pad. The original sample is NNESEESWNWW.
        </p>
        <label className="mt-3 block font-score text-xs text-brass" htmlFor="tape-program">
          Program
        </label>
        <textarea
          ref={field}
          id="tape-program"
          value={session.tape.program}
          onChange={(event) => onChange(event.target.value)}
          rows={3}
          className="mt-1 w-full resize-none rounded-xl border border-brass/30 bg-navy-deep p-3 font-score text-lg uppercase tracking-[0.2em] text-brass focus:border-brass"
          placeholder="NNESEESWNWW"
          spellCheck={false}
        />
        <p className="mt-2 min-h-6 font-score text-sm text-cabinet-shine" aria-live="polite">
          {head}
          {session.tape.playing ? " ▌" : ""}
        </p>
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onPlay}
            className="min-h-12 flex-1 rounded-full bg-brass font-display text-lg text-navy-deep"
          >
            Play tape
          </button>
          <button
            type="button"
            onClick={onStop}
            className="min-h-12 rounded-full border border-brass/40 px-4 font-score text-sm text-brass"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
