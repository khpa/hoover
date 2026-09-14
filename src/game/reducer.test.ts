import { describe, expect, test } from "vitest";
import { getLevel } from "@/engine/levels";
import { createSession, reduceSession } from "./reducer";

describe("session reducer", () => {
  test("loads a room and moves the hoover north", () => {
    const start = createSession(getLevel("porch"));
    expect(start.game.hoover).toEqual({ x: 1, y: 1 });
    const next = reduceSession(start, { type: "move", dir: "N" });
    expect(next.game.hoover).toEqual({ x: 1, y: 2 });
    expect(next.lastEvent).toBe("clean");
    expect(next.combo).toBe(1);
  });

  test("records a bump when the skirting holds", () => {
    const start = createSession(getLevel("porch"));
    const west = reduceSession(start, { type: "move", dir: "W" });
    const bump = reduceSession(west, { type: "move", dir: "W" });
    expect(bump.game.hoover).toEqual({ x: 0, y: 1 });
    expect(bump.lastEvent).toBe("bump");
    expect(bump.combo).toBe(0);
  });

  test("clears the porch and awards stars", () => {
    let session = createSession(getLevel("porch"));
    for (const dir of ["N", "S", "E", "E"] as const) {
      session = reduceSession(session, { type: "move", dir });
    }
    expect(session.cleared).toBe(true);
    expect(session.stars).toBe(3);
    expect(session.game.dirt.size).toBe(0);
  });

  test("ticks a tape program one letter at a time", () => {
    let session = createSession(getLevel("porch"));
    session = reduceSession(session, { type: "openTape" });
    session = reduceSession(session, { type: "setProgram", program: "N" });
    session = reduceSession(session, { type: "playTape" });
    session = reduceSession(session, { type: "tickTape" });
    expect(session.game.hoover).toEqual({ x: 1, y: 2 });
    expect(session.tape.index).toBe(1);
    expect(session.tape.playing).toBe(false);
  });

  test("fails the room when the battery dies with fluff left", () => {
    let session = createSession(getLevel("porch"));
    session = {
      ...session,
      game: { ...session.game, batteryLeft: 1 },
    };
    session = reduceSession(session, { type: "move", dir: "S" });
    expect(session.failed).toBe(true);
    expect(session.cleared).toBe(false);
    expect(session.game.batteryLeft).toBe(0);
    expect(session.game.dirt.size).toBe(2);
  });

  test("lets a leftover magnet clutch a failed room", () => {
    let session = createSession(getLevel("stairs"));
    session = {
      ...session,
      failed: true,
      game: { ...session.game, batteryLeft: 0, magnetLeft: 1 },
    };
    session = reduceSession(session, { type: "magnet" });
    expect(session.lastEvent).toBe("magnet");
    expect(session.game.magnetLeft).toBe(0);
    expect(session.game.dirt.size).toBe(2);
  });

  test("arms dash as its own event", () => {
    let session = createSession(getLevel("kitchen"));
    session = reduceSession(session, { type: "armDash" });
    expect(session.game.dashArmed).toBe(true);
    expect(session.lastEvent).toBe("arm");
  });

  test("replays a tape even after the room is already clear", () => {
    let session = createSession(getLevel("porch"));
    for (const dir of ["N", "S", "E", "E"] as const) {
      session = reduceSession(session, { type: "move", dir });
    }
    expect(session.cleared).toBe(true);

    session = reduceSession(session, { type: "openTape" });
    session = reduceSession(session, { type: "setProgram", program: "N" });
    session = reduceSession(session, { type: "playTape" });
    expect(session.cleared).toBe(false);
    expect(session.game.hoover).toEqual({ x: 1, y: 1 });
    session = reduceSession(session, { type: "tickTape" });
    expect(session.game.hoover).toEqual({ x: 1, y: 2 });
  });
});
