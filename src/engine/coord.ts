import type { Dir, GameState, Pos } from "./types";

export const DELTA: Record<Dir, Pos> = {
  N: { x: 0, y: 1 },
  E: { x: 1, y: 0 },
  S: { x: 0, y: -1 },
  W: { x: -1, y: 0 },
};

export function key(pos: Pos): string {
  return `${pos.x},${pos.y}`;
}

export function parseKey(value: string): Pos {
  const [x, y] = value.split(",").map(Number);
  return { x, y };
}

export function inBounds(
  room: Pick<GameState, "width" | "height">,
  pos: Pos,
): boolean {
  return pos.x >= 0 && pos.y >= 0 && pos.x < room.width && pos.y < room.height;
}

export function step(pos: Pos, dir: Dir): Pos {
  const delta = DELTA[dir];
  return { x: pos.x + delta.x, y: pos.y + delta.y };
}

export function isBlocked(state: GameState, pos: Pos): boolean {
  return !inBounds(state, pos) || state.obstacles.has(key(pos));
}

export function parseDir(char: string): Dir | null {
  if (char === "N" || char === "E" || char === "S" || char === "W") {
    return char;
  }
  return null;
}
