import { afterEach, describe, expect, test, vi } from "vitest";
import { hydrateMute, isMuted, playSfx, setMuted, toneFor } from "./audio";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("toneFor", () => {
  test("maps arcade events to distinct pitches", () => {
    expect(toneFor("move")?.freq).toBeGreaterThan(0);
    expect(toneFor("clean")?.freq).not.toBe(toneFor("bump")?.freq);
    expect(toneFor("win")?.freq).toBeGreaterThan(toneFor("fail")?.freq ?? 0);
  });
});

describe("mute", () => {
  test("persists the cabinet mute flag", () => {
    const data: Record<string, string> = {};
    const localStorage = {
      getItem: (key: string) => data[key] ?? null,
      setItem: (key: string, value: string) => {
        data[key] = value;
      },
    };
    vi.stubGlobal("window", {
      localStorage,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    setMuted(false);
    expect(data["hoover-arcade-mute"]).toBe("0");
    expect(isMuted()).toBe(false);

    setMuted(true);
    expect(hydrateMute()).toBe(true);
    expect(() => playSfx("coin")).not.toThrow();
  });
});
