"use client";

import { useSyncExternalStore } from "react";
import { hydrateMute, isMuted, subscribeMute } from "@/game/audio";

export function useMuted() {
  return useSyncExternalStore(
    subscribeMute,
    () => {
      hydrateMute();
      return isMuted();
    },
    () => true,
  );
}
