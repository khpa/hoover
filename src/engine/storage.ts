import type { LevelId, Progress } from "./types";

export const STORAGE_KEY = "hoover-arcade-v2";

export const EMPTY_PROGRESS: Progress = { stars: {}, bestMoves: {} };

export function emptyProgress(): Progress {
  return { stars: {}, bestMoves: {} };
}

export function loadProgress(storage: Pick<Storage, "getItem">): Progress {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return emptyProgress();

  try {
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      stars: parsed.stars ?? {},
      bestMoves: parsed.bestMoves ?? {},
    };
  } catch {
    return emptyProgress();
  }
}

export function saveStars(
  storage: Pick<Storage, "getItem" | "setItem">,
  id: LevelId,
  stars: 1 | 2 | 3,
  moves: number,
): Progress {
  const current = loadProgress(storage);
  const previousStars = current.stars[id] ?? 0;
  const previousMoves = current.bestMoves[id];
  const next: Progress = {
    stars: {
      ...current.stars,
      [id]: Math.max(previousStars, stars) as 0 | 1 | 2 | 3,
    },
    bestMoves: {
      ...current.bestMoves,
      [id]: previousMoves == null ? moves : Math.min(previousMoves, moves),
    },
  };
  storage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
