import { LevelSelect } from "@/components/game/LevelSelect";

export const metadata = {
  title: "Rooms · Hoover",
};

export default function PlayIndexPage() {
  return (
    <main className="mx-auto min-h-dvh max-w-lg px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <LevelSelect />
    </main>
  );
}
