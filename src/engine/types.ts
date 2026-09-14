export type Pos = { x: number; y: number };

export type Dir = "N" | "E" | "S" | "W";

export type GameState = {
  width: number;
  height: number;
  hoover: Pos;
  dirt: Set<string>;
  obstacles: Set<string>;
  slides: Set<string>;
  moves: number;
  cleaned: number;
  dashCharges: number;
  dashArmed: boolean;
  magnetLeft: number;
  batteryLeft: number;
  batteryMax: number;
};

export type LevelId = "porch" | "hall" | "lounge" | "kitchen" | "stairs" | "house";

export type LevelDef = {
  id: LevelId;
  name: string;
  blurb: string;
  width: number;
  height: number;
  start: Pos;
  dirt: Pos[];
  obstacles: Pos[];
  par: [number, number, number];
  dashCharges: number;
  magnetCharges: number;
  battery: number;
  slides: Pos[];
};

export type Progress = {
  stars: Partial<Record<LevelId, 0 | 1 | 2 | 3>>;
  bestMoves: Partial<Record<LevelId, number>>;
};
