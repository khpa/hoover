import { describe, expect, test } from "vitest";
import { LEVELS, createLevelState, getLevel, isUnlocked, nextLevelId } from "./levels";
import { emptyProgress, loadProgress, saveStars } from "./storage";
import { key } from "./coord";
import type { Progress } from "./types";

function memoryStorage(seed: Record<string, string> = {}) {
  const data = { ...seed };
  return {
    getItem: (k: string) => data[k] ?? null,
    setItem: (k: string, value: string) => {
      data[k] = value;
    },
  };
}

describe("campaign levels", () => {
  test("ships six named rooms in lock order", () => {
    expect(LEVELS.map((level) => level.id)).toEqual([
      "porch",
      "hall",
      "lounge",
      "kitchen",
      "stairs",
      "house",
    ]);
  });

  test("porch is a 4x4 tutorial with two dirt and no furniture", () => {
    const porch = getLevel("porch");
    expect(porch.width).toBe(4);
    expect(porch.height).toBe(4);
    expect(porch.dirt).toHaveLength(2);
    expect(porch.obstacles).toHaveLength(0);
    expect(porch.dashCharges).toBe(0);
    expect(porch.magnetCharges).toBe(0);
  });

  test("kitchen grants one dash and stairs grants one magnet", () => {
    expect(getLevel("kitchen").dashCharges).toBe(1);
    expect(getLevel("stairs").magnetCharges).toBe(1);
    expect(getLevel("house").dashCharges).toBe(1);
    expect(getLevel("house").magnetCharges).toBe(1);
  });

  test("createLevelState vacuums dirt under the hoover", () => {
    const state = createLevelState(getLevel("porch"));
    expect(state.dirt.has(key(state.hoover))).toBe(false);
    expect(state.width).toBe(4);
  });

  test("unlocks the next room only after stars are earned", () => {
    const none: Progress = emptyProgress();
    expect(isUnlocked("porch", none)).toBe(true);
    expect(isUnlocked("hall", none)).toBe(false);

    const afterPorch: Progress = { stars: { porch: 1 }, bestMoves: { porch: 8 } };
    expect(isUnlocked("hall", afterPorch)).toBe(true);
    expect(isUnlocked("lounge", afterPorch)).toBe(false);
    expect(nextLevelId("porch")).toBe("hall");
    expect(nextLevelId("house")).toBeNull();
  });
});

describe("progress storage", () => {
  test("loads empty progress when nothing is stored", () => {
    expect(loadProgress(memoryStorage())).toEqual(emptyProgress());
  });

  test("keeps the best stars and fewest moves per room", () => {
    const storage = memoryStorage();
    saveStars(storage, "porch", 2, 10);
    const better = saveStars(storage, "porch", 3, 8);
    expect(better.stars.porch).toBe(3);
    expect(better.bestMoves.porch).toBe(8);

    const worse = saveStars(storage, "porch", 1, 20);
    expect(worse.stars.porch).toBe(3);
    expect(worse.bestMoves.porch).toBe(8);

    expect(loadProgress(storage).stars.porch).toBe(3);
  });
});
