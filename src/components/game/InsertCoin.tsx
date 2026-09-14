"use client";

import Link from "next/link";
import { playSfx, setMuted, unlockAudio } from "@/game/audio";

export function InsertCoin() {
  return (
    <Link
      href="/play"
      onClick={() => {
        unlockAudio();
        setMuted(false);
        playSfx("coin");
      }}
      className="mx-auto mt-8 flex h-28 w-28 items-center justify-center rounded-full border-4 border-brass-dark bg-[radial-gradient(circle_at_35%_30%,#f0d48a,var(--brass)_58%,var(--brass-dark))] font-display text-xl text-navy-deep shadow-[0_8px_0_#6b0c1c] transition-[transform] duration-150 active:translate-y-1"
    >
      Play
    </Link>
  );
}
