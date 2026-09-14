import { key } from "./coord";
import { createState } from "./simulate";
import type { GameState, LevelDef, LevelId, Progress } from "./types";

export const LEVELS: LevelDef[] = [
  {
    id: "porch",
    name: "Porch",
    blurb: "Two fluffs. Learn the pad.",
    width: 4,
    height: 4,
    start: { x: 1, y: 1 },
    dirt: [
      { x: 1, y: 2 },
      { x: 3, y: 1 },
    ],
    obstacles: [],
    par: [4, 6, 10],
    dashCharges: 0,
    magnetCharges: 0,
    battery: 18,
    slides: [],
  },
  {
    id: "hall",
    name: "Hall",
    blurb: "Skirting, a sideboard, and a runner rug.",
    width: 5,
    height: 5,
    start: { x: 0, y: 1 },
    dirt: [
      { x: 1, y: 0 },
      { x: 2, y: 3 },
      { x: 4, y: 2 },
    ],
    obstacles: [
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
    ],
    par: [10, 14, 20],
    dashCharges: 0,
    magnetCharges: 0,
    battery: 22,
    slides: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ],
  },
  {
    id: "lounge",
    name: "Lounge",
    blurb: "Sofa blocking the rug.",
    width: 6,
    height: 5,
    start: { x: 0, y: 0 },
    dirt: [
      { x: 2, y: 2 },
      { x: 5, y: 0 },
      { x: 5, y: 4 },
      { x: 3, y: 4 },
    ],
    obstacles: [
      { x: 1, y: 1 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 1 },
      { x: 3, y: 2 },
      { x: 4, y: 3 },
    ],
    par: [16, 20, 26],
    dashCharges: 0,
    magnetCharges: 0,
    battery: 28,
    slides: [
      { x: 2, y: 0 },
      { x: 3, y: 0 },
      { x: 4, y: 0 },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    blurb: "Dash the galley.",
    width: 6,
    height: 4,
    start: { x: 0, y: 1 },
    dirt: [
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 5, y: 3 },
    ],
    obstacles: [
      { x: 1, y: 0 },
      { x: 1, y: 2 },
      { x: 1, y: 3 },
      { x: 3, y: 0 },
      { x: 3, y: 2 },
      { x: 3, y: 3 },
    ],
    par: [8, 12, 16],
    dashCharges: 1,
    magnetCharges: 0,
    battery: 16,
    slides: [],
  },
  {
    id: "stairs",
    name: "Stairs",
    blurb: "Alcoves want the magnet.",
    width: 5,
    height: 5,
    start: { x: 2, y: 2 },
    dirt: [
      { x: 2, y: 3 },
      { x: 2, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 0, y: 4 },
      { x: 4, y: 0 },
    ],
    obstacles: [
      { x: 1, y: 3 },
      { x: 3, y: 3 },
      { x: 1, y: 1 },
      { x: 3, y: 1 },
    ],
    par: [10, 14, 18],
    dashCharges: 0,
    magnetCharges: 1,
    battery: 18,
    slides: [],
  },
  {
    id: "house",
    name: "Whole house",
    blurb: "Every room at once.",
    width: 7,
    height: 6,
    start: { x: 0, y: 0 },
    dirt: [
      { x: 2, y: 0 },
      { x: 6, y: 0 },
      { x: 0, y: 3 },
      { x: 3, y: 3 },
      { x: 6, y: 5 },
      { x: 2, y: 5 },
    ],
    obstacles: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
      { x: 5, y: 4 },
    ],
    par: [22, 28, 36],
    dashCharges: 1,
    magnetCharges: 1,
    battery: 40,
    slides: [
      { x: 3, y: 0 },
      { x: 4, y: 0 },
      { x: 5, y: 0 },
    ],
  },
];

export function isLevelId(id: string): id is LevelId {
  return LEVELS.some((entry) => entry.id === id);
}

export function getLevel(id: LevelId): LevelDef {
  const level = LEVELS.find((entry) => entry.id === id);
  if (!level) {
    throw new Error(`Unknown room: ${id}`);
  }
  return level;
}

export function nextLevelId(id: LevelId): LevelId | null {
  const index = LEVELS.findIndex((entry) => entry.id === id);
  return LEVELS[index + 1]?.id ?? null;
}

export function isUnlocked(id: LevelId, progress: Progress): boolean {
  if (id === LEVELS[0].id) return true;
  const index = LEVELS.findIndex((entry) => entry.id === id);
  const previous = LEVELS[index - 1];
  return (progress.stars[previous.id] ?? 0) > 0;
}

export function createLevelState(level: LevelDef): GameState {
  return createState({
    width: level.width,
    height: level.height,
    hoover: level.start,
    dirt: new Set(level.dirt.map(key)),
    obstacles: new Set(level.obstacles.map(key)),
    moves: 0,
    cleaned: 0,
    dashCharges: level.dashCharges,
    dashArmed: false,
    magnetLeft: level.magnetCharges,
    batteryLeft: level.battery,
    batteryMax: level.battery,
    slides: new Set(level.slides.map(key)),
  });
}
