"use client";

import Link from "next/link";
import { LEVELS, isUnlocked } from "@/engine";
import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { StarRow } from "@/components/game/StarRow";
import { useProgress } from "@/game/useProgress";

export function LevelSelect() {
  const progress = useProgress();

  return (
    <CabinetShell>
      <p className="font-score text-xs text-brass">Campaign</p>
      <h1 className="font-display text-3xl text-hoover">Six rooms</h1>
      <p className="mt-1 text-sm text-hoover/80">Clear one to unlock the next. Stars remember your best run.</p>
      <ol className="mt-5 grid gap-3">
        {LEVELS.map((level, index) => {
          const unlocked = isUnlocked(level.id, progress);
          const stars = progress.stars[level.id] ?? 0;
          const best = progress.bestMoves[level.id];
          const inner = (
            <div
              className={`flex min-h-16 items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 ${
                unlocked
                  ? "border-brass/50 bg-navy-deep/60 text-hoover"
                  : "border-navy bg-navy-deep/40 text-hoover/40"
              }`}
            >
              <div className="min-w-0">
                <p className="font-score text-xs text-brass">
                  {String(index + 1).padStart(2, "0")}
                  {unlocked ? "" : " · locked"}
                </p>
                <p className="font-display text-xl leading-none">{level.name}</p>
                <p className="mt-1 truncate text-sm">{level.blurb}</p>
              </div>
              <div className="shrink-0 text-right font-score text-sm">
                <StarRow count={stars} />
                {best != null ? <p className="mt-1 whitespace-nowrap">{best} moves</p> : null}
              </div>
            </div>
          );

          return (
            <li key={level.id}>
              {unlocked ? (
                <Link href={`/play/${level.id}`} className="block">
                  {inner}
                </Link>
              ) : (
                <div aria-disabled="true" aria-label={`${level.name}, locked`}>
                  {inner}
                </div>
              )}
            </li>
          );
        })}
      </ol>
      <Link href="/" className="mt-5 inline-flex min-h-11 items-center font-score text-sm text-brass">
        Back to the cabinet
      </Link>
    </CabinetShell>
  );
}
