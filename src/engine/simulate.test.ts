import { describe, expect, test } from "vitest";
import { applyInstructions, applyMagnet, applyMove, armDash, createState } from "./simulate";
import { key } from "./coord";
import { starsFor } from "./score";
import type { GameState } from "./types";

function dirt(...cells: Array<[number, number]>) {
  return new Set(cells.map(([x, y]) => key({ x, y })));
}

function room(overrides: Partial<GameState> & Pick<GameState, "hoover">): GameState {
  return createState({
    width: 5,
    height: 5,
    dirt: new Set(),
    obstacles: new Set(),
    slides: new Set(),
    moves: 0,
    cleaned: 0,
    dashCharges: 0,
    dashArmed: false,
    magnetLeft: 0,
    batteryLeft: 30,
    batteryMax: 30,
    ...overrides,
  });
}

describe("canonical tech-test sample", () => {
  test("NNESEESWNWW ends at [1,3] and cleans one patch", () => {
    const start = room({
      hoover: { x: 1, y: 2 },
      dirt: dirt([1, 0], [2, 2], [2, 3]),
    });

    const end = applyInstructions(start, "NNESEESWNWW");

    expect(end.hoover).toEqual({ x: 1, y: 3 });
    expect(end.cleaned).toBe(1);
    expect(end.dirt).toEqual(dirt([1, 0], [2, 2]));
  });
});

describe("applyMove", () => {
  test("north increases y", () => {
    const end = applyMove(room({ hoover: { x: 1, y: 1 } }), "N");
    expect(end.hoover).toEqual({ x: 1, y: 2 });
    expect(end.moves).toBe(1);
  });

  test("clamps against the wall and still counts a move", () => {
    const end = applyMove(room({ hoover: { x: 0, y: 0 } }), "W");
    expect(end.hoover).toEqual({ x: 0, y: 0 });
    expect(end.moves).toBe(1);
  });

  test("clamps against furniture", () => {
    const end = applyMove(
      room({
        hoover: { x: 1, y: 1 },
        obstacles: dirt([2, 1]),
      }),
      "E",
    );
    expect(end.hoover).toEqual({ x: 1, y: 1 });
    expect(end.moves).toBe(1);
  });

  test("cleans dirt on landing once", () => {
    const first = applyMove(
      room({
        hoover: { x: 0, y: 0 },
        dirt: dirt([1, 0]),
      }),
      "E",
    );
    expect(first.cleaned).toBe(1);
    expect(first.dirt.size).toBe(0);

    const second = applyMove(first, "W");
    const third = applyMove(second, "E");
    expect(third.cleaned).toBe(1);
  });

  test("does not mutate the input state", () => {
    const start = room({ hoover: { x: 1, y: 1 }, dirt: dirt([1, 2]) });
    applyMove(start, "N");
    expect(start.hoover).toEqual({ x: 1, y: 1 });
    expect(start.dirt).toEqual(dirt([1, 2]));
    expect(start.moves).toBe(0);
  });
});

describe("dash", () => {
  test("armed dash tries two cells and consumes the arm", () => {
    const armed = armDash(
      room({
        hoover: { x: 0, y: 0 },
        dashCharges: 1,
        dirt: dirt([1, 0], [2, 0]),
      }),
    );
    expect(armed.dashArmed).toBe(true);
    expect(armed.dashCharges).toBe(0);

    const end = applyMove(armed, "E");
    expect(end.hoover).toEqual({ x: 2, y: 0 });
    expect(end.cleaned).toBe(2);
    expect(end.dashArmed).toBe(false);
    expect(end.moves).toBe(1);
  });

  test("dash stops before a wall and still cleans entered cells", () => {
    const armed = armDash(
      room({
        width: 2,
        height: 1,
        hoover: { x: 0, y: 0 },
        dashCharges: 1,
        dirt: dirt([1, 0]),
      }),
    );
    const end = applyMove(armed, "E");
    expect(end.hoover).toEqual({ x: 1, y: 0 });
    expect(end.cleaned).toBe(1);
    expect(end.dashArmed).toBe(false);
  });

  test("armDash is a no-op without charges", () => {
    const start = room({ hoover: { x: 0, y: 0 }, dashCharges: 0 });
    const end = armDash(start);
    expect(end.dashArmed).toBe(false);
    expect(end.dashCharges).toBe(0);
  });
});

describe("magnet", () => {
  test("cleans orthogonal neighbours without moving", () => {
    const start = room({
      hoover: { x: 1, y: 1 },
      magnetLeft: 1,
      dirt: dirt([1, 2], [2, 1], [1, 0], [0, 1], [2, 2]),
    });
    const end = applyMagnet(start);
    expect(end.hoover).toEqual({ x: 1, y: 1 });
    expect(end.moves).toBe(0);
    expect(end.magnetLeft).toBe(0);
    expect(end.cleaned).toBe(4);
    expect(end.dirt).toEqual(dirt([2, 2]));
  });

  test("is a no-op without charges", () => {
    const start = room({
      hoover: { x: 1, y: 1 },
      magnetLeft: 0,
      dirt: dirt([1, 2]),
    });
    const end = applyMagnet(start);
    expect(end.dirt.size).toBe(1);
    expect(end.magnetLeft).toBe(0);
  });
});

describe("starsFor", () => {
  test("awards 3, 2, or 1 star from par thresholds", () => {
    const par: [number, number, number] = [6, 9, 12];
    expect(starsFor(6, par)).toBe(3);
    expect(starsFor(9, par)).toBe(2);
    expect(starsFor(12, par)).toBe(1);
    expect(starsFor(20, par)).toBe(1);
  });
});

describe("battery", () => {
  test("drains one charge per move", () => {
    const end = applyMove(room({ hoover: { x: 1, y: 1 }, batteryLeft: 5, batteryMax: 5 }), "N");
    expect(end.batteryLeft).toBe(4);
    expect(end.moves).toBe(1);
  });

  test("refuses to move when the battery is flat", () => {
    const start = room({ hoover: { x: 1, y: 1 }, batteryLeft: 0, batteryMax: 5 });
    const end = applyMove(start, "N");
    expect(end.hoover).toEqual({ x: 1, y: 1 });
    expect(end.moves).toBe(0);
  });
});

describe("rugs", () => {
  test("slides along a rug until the floor is sticky again", () => {
    const end = applyMove(
      room({
        width: 5,
        height: 1,
        hoover: { x: 0, y: 0 },
        slides: dirt([1, 0], [2, 0], [3, 0]),
      }),
      "E",
    );
    expect(end.hoover).toEqual({ x: 4, y: 0 });
    expect(end.moves).toBe(1);
  });

  test("stops sliding before furniture", () => {
    const end = applyMove(
      room({
        width: 5,
        height: 1,
        hoover: { x: 0, y: 0 },
        slides: dirt([1, 0], [2, 0], [3, 0]),
        obstacles: dirt([4, 0]),
      }),
      "E",
    );
    expect(end.hoover).toEqual({ x: 3, y: 0 });
  });
});
