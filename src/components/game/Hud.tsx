import Link from "next/link";
import type { SessionState } from "@/game/reducer";

type HudProps = {
  session: SessionState;
  muted: boolean;
  onMute: () => void;
  onTape: () => void;
  onReset: () => void;
};

const pill =
  "inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full border border-brass/40 px-3 font-score text-xs text-brass";

export function Hud({ session, muted, onMute, onTape, onReset }: HudProps) {
  const fluff = session.game.dirt.size;
  const charge = session.game.batteryMax
    ? Math.max(0, session.game.batteryLeft / session.game.batteryMax)
    : 0;

  return (
    <div className="text-hoover">
      <div className="flex items-center justify-between gap-2">
        <Link href="/play" className="inline-flex min-h-11 items-center font-score text-xs tracking-wide text-brass">
          Rooms
        </Link>
        <div className="flex flex-wrap justify-end gap-1.5">
          <button
            type="button"
            onClick={onMute}
            className={pill}
            aria-pressed={!muted}
            aria-label={muted ? "Unmute sound" : "Mute sound"}
          >
            {muted ? "Muted" : "Sound on"}
          </button>
          <button type="button" onClick={onTape} className={pill}>
            Tape
          </button>
          <button type="button" onClick={onReset} className={pill}>
            Retry
          </button>
        </div>
      </div>
      <h1 className="mt-1 font-display text-[1.75rem] leading-none sm:text-3xl">{session.level.name}</h1>
      <p className="mt-1 truncate text-sm text-hoover/80">{session.level.blurb}</p>
      <div className="mt-3">
        <div className="mb-1 flex justify-between font-score text-[10px] tracking-wide text-brass">
          <span>Battery</span>
          <span>
            {session.game.batteryLeft}/{session.game.batteryMax}
          </span>
        </div>
        <div
          role="meter"
          aria-label="Battery"
          aria-valuemin={0}
          aria-valuemax={session.game.batteryMax}
          aria-valuenow={session.game.batteryLeft}
          className="h-2.5 overflow-hidden rounded-full bg-navy-deep"
        >
          <div
            className={`h-full rounded-full ${charge < 0.25 ? "battery-low bg-cabinet-shine" : "bg-brass"}`}
            style={{ width: `${charge * 100}%` }}
          />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5" role="status" aria-atomic="true">
        <span className="whitespace-nowrap rounded-full bg-navy-deep px-2 py-1 font-score text-xs">
          {session.game.moves} moves
        </span>
        <span className="whitespace-nowrap rounded-full bg-navy-deep px-2 py-1 font-score text-xs">
          {fluff} fluff
        </span>
        {session.combo > 1 ? (
          <span className="whitespace-nowrap rounded-full bg-brass px-2 py-1 font-score text-xs text-navy-deep">
            COMBO x{session.combo}
          </span>
        ) : null}
      </div>
    </div>
  );
}
