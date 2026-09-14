# Hoover Arcade v2 Design

Date: 2026-09-14

## Intent

Rebuild the original hoover tech-test as a portfolio arcade: same vacuum rules, six-level campaign, furniture obstacles, two power-ups, NESW tape deck, local stars. First 30 seconds should read as a game. No accounts, no backend.

## Original product (preserve)

- Rectangular grid room. Origin `(0,0)` is the bottom-left cell. Valid cells are `x = 0..width-1`, `y = 0..height-1`.
- Hoover moves N/E/S/W one cell at a time.
- A move that would leave the room (or enter furniture) is ignored; the hoover stays put. The attempt still counts as a move.
- The vacuum is always on. Landing on dirt cleans that cell once.
- Dirt already cleaned stays clean.

## Fixes vs original UI

- Render Y-up: `y = 0` is the bottom of the LCD. North/UP increases `y`.
- Drop `xNyM` string forms, hardcoded three dust slots, class components, and the old CSS kit.

## Game layer

- Six campaign levels, locked forward.
- 3-star scoring from move par when the room is cleared.
- Combo is a presentation flourish when dirt is cleaned without a wall/furniture bump since the last clean; not a separate stored score.
- Power-ups:
  - Dash: player arms one charge, next move tries two cells in that direction, stops before a block, still cleans every cell entered, consumes the arm.
  - Magnet: cleans orthogonal neighbours of the current cell, costs one charge, does not move, does not increment moves.
- NESW tape deck: paste a string such as `NNESEESWNWW`; playback ticks the same `applyMove` engine one letter at a time.
- Progress (stars, best moves per level) in `localStorage` key `hoover-arcade-v2`.
- Sound off by default (mute stub only).

## Canonical engine sample

Room 5×5, start `[1,2]`, patches `[1,0] [2,2] [2,3]`, instructions `NNESEESWNWW` → final `[1,3]`, cleaned `1`.

## Surfaces

- `/` landing (cabinet, insert-coin PLAY)
- `/play` level select
- `/play/[id]` play, results overlay, tape deck overlay

## Visual world

Pocket arcade: cherry cabinet `#C41E3A`, brass `#D4A54A`, navy `#1B1F3B`, mint LCD `#C6F4D6` on `#1A3A32`, lint-purple dirt, white hoover with a red stripe. Bungee wordmark, Chivo Mono scores, Figtree UI. British arcade copy. One landing boot; in-game motion only on actions; honor `prefers-reduced-motion`; D-pad targets ≥44px.

## Architecture

UI-free engine in `src/engine/`. React dispatches. `useReducer` over engine actions. CSS grid, not canvas. No Zustand, no auth, no backend.

## Out of scope

Accounts, global leaderboard, extra levels or power-ups, custom room builder, rewriting `master`.
