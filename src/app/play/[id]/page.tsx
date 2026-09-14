import { notFound } from "next/navigation";
import { LEVELS, isLevelId } from "@/engine";
import { GameClient } from "@/components/game/GameClient";

export function generateStaticParams() {
  return LEVELS.map((level) => ({ id: level.id }));
}

export default async function PlayLevelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isLevelId(id)) notFound();

  return (
    <main className="min-h-dvh">
      <GameClient key={id} levelId={id} />
    </main>
  );
}
