# Hoover

A pocket-arcade rebuild of a robot-vacuum tech test. Drive a hoover around a grid, clean fluff, bounce off the skirting, and paste NESW tapes into the deck.

## Play

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Rules

- The room is a grid. Origin `(0,0)` is the bottom-left cell. North increases `y`.
- The vacuum is always on. Landing on fluff cleans it once.
- Walls and furniture clamp the bot in place. The attempt still counts as a move.
- Dash arms the next move for two cells. Magnet cleans orthogonal neighbours.
- Stars come from move par when the room is clear. Progress lives in `localStorage`.

The original class-component Vite app lives on `master`. This game is `v2`.
