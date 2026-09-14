"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_PROGRESS, STORAGE_KEY, loadProgress, saveStars as persistStars } from "@/engine";
import type { LevelId, Progress } from "@/engine";

const CHANGE = "hoover-arcade-progress";

let cachedRaw: string | null | undefined;
let cachedValue: Progress = EMPTY_PROGRESS;

function snapshot(): Progress {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;
  cachedRaw = raw;
  cachedValue = loadProgress(window.localStorage);
  return cachedValue;
}

function emit() {
  cachedRaw = undefined;
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

export function useProgress(): Progress {
  return useSyncExternalStore(subscribe, snapshot, () => EMPTY_PROGRESS);
}

export function recordStars(id: LevelId, stars: 1 | 2 | 3, moves: number): Progress {
  const progress = persistStars(window.localStorage, id, stars, moves);
  emit();
  return progress;
}
