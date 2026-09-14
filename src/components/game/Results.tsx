import Link from "next/link";
import { nextLevelId } from "@/engine";
import type { SessionState } from "@/game/reducer";
import { StarRow } from "@/components/game/StarRow";

type ResultsProps = {
  session: SessionState;
  bestMoves?: number;
  onRetry: () => void;
  onTape: () => void;
  onMagnet: () => void;
};

export function Results({ session, bestMoves, onRetry, onTape, onMagnet }: ResultsProps) {
  if (!session.cleared && !session.failed) return null;
  const next = nextLevelId(session.level.id);
  const clutch = session.failed && session.game.magnetLeft > 0;

  return (
    <div className="absolute inset-0 z-30 flex items-end justify-center bg-navy-deep/80 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="results-title"
        className="w-full max-w-sm rounded-[22px] border-4 border-brass bg-cabinet px-5 py-6 text-center text-hoover shadow-[0_12px_0_#6b0c1c]"
      >
        {session.failed ? (
          <>
            <p className="font-score text-xs tracking-wide text-brass">Battery flat</p>
            <h2 id="results-title" className="mt-1 font-display text-3xl">
              Still dusty
            </h2>
            <p className="mt-3 font-score text-sm">{session.game.dirt.size} fluff left</p>
            {clutch ? (
              <p className="mt-2 text-sm text-hoover/80">Magnet still has a charge. Clutch it.</p>
            ) : null}
          </>
        ) : (
          <>
            <p className="font-score text-xs tracking-wide text-brass">Room cleared</p>
            <h2 id="results-title" className="mt-1 font-display text-3xl">
              Fluff gone
            </h2>
            <div className="mt-4">
              <StarRow count={session.stars} size="lg" />
            </div>
            <p className="mt-4 font-score text-sm">
              {session.game.moves} moves
              {bestMoves != null ? ` · best ${bestMoves}` : ""}
            </p>
          </>
        )}
        <div className="mt-5 flex flex-col gap-2">
          {clutch ? (
            <button
              type="button"
              onClick={onMagnet}
              className="flex min-h-12 items-center justify-center rounded-full bg-brass font-display text-lg text-navy-deep"
            >
              Magnet clutch
            </button>
          ) : null}
          {session.cleared && next ? (
            <Link
              href={`/play/${next}`}
              className="flex min-h-12 items-center justify-center rounded-full bg-brass font-display text-lg text-navy-deep"
            >
              Next room
            </Link>
          ) : null}
          {session.cleared && !next ? (
            <Link
              href="/play"
              className="flex min-h-12 items-center justify-center rounded-full bg-brass font-display text-lg text-navy-deep"
            >
              Whole house done
            </Link>
          ) : null}
          <button
            type="button"
            onClick={onRetry}
            className="min-h-12 rounded-full border border-hoover/40 font-score text-sm"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onTape}
            className="min-h-12 rounded-full border border-hoover/40 font-score text-sm"
          >
            Tape deck
          </button>
        </div>
      </div>
    </div>
  );
}
