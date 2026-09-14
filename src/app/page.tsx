import { CabinetShell } from "@/components/cabinet/CabinetShell";
import { InsertCoin } from "@/components/game/InsertCoin";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4 py-8 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <CabinetShell boot>
        <div className="px-2 pb-2 pt-6 text-center sm:px-6">
          <p className="font-score text-xs text-brass">Pocket arcade</p>
          <h1 className="mt-2 font-display text-6xl leading-[0.9] text-hoover sm:text-7xl">
            HOOVER
          </h1>
          <p className="mx-auto mt-4 max-w-[18rem] text-sm leading-snug text-hoover/85">
            Insert coin. Drive the bot. Hoover the fluff. Walls hold. Rugs slide. The vacuum never sleeps.
          </p>
          <InsertCoin />
          <p className="mt-4 font-score text-xs text-brass">Insert coin to clean</p>
          <p className="mt-8 text-xs text-hoover/60">Six rooms. Battery. Rugs. A tape deck.</p>
        </div>
      </CabinetShell>
    </main>
  );
}
