export function starsFor(
  moves: number,
  par: [number, number, number],
): 0 | 1 | 2 | 3 {
  if (moves <= par[0]) return 3;
  if (moves <= par[1]) return 2;
  return 1;
}
