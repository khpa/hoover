import { key } from "@/engine";
import type { GameState, Pos } from "@/engine";

type BoardProps = {
  game: GameState;
  onSwipe: (dx: number, dy: number) => void;
};

function HooverBot() {
  return (
    <div
      aria-hidden
      className="relative h-[70%] w-[70%] rounded-full bg-hoover shadow-[inset_0_-4px_0_rgba(0,0,0,0.12),0_2px_0_rgba(0,0,0,0.2)]"
    >
      <div className="absolute inset-x-[18%] top-[42%] h-[18%] rounded-full bg-cabinet" />
      <div className="absolute left-1/2 top-[18%] h-2 w-2 -translate-x-1/2 rounded-full bg-lcd-ink/80" />
    </div>
  );
}

function Fluff() {
  return (
    <div aria-hidden className="relative h-[55%] w-[55%]">
      <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-fluff" />
      <span className="absolute right-0 top-2 h-3 w-3 rounded-full bg-fluff-light" />
      <span className="absolute bottom-0 left-2 h-3.5 w-3.5 rounded-full bg-fluff/80" />
    </div>
  );
}

function Furniture() {
  return (
    <div
      aria-hidden
      className="h-[78%] w-[78%] rounded-[6px] bg-wood shadow-[inset_0_2px_0_rgba(255,255,255,0.08),inset_0_-3px_0_rgba(0,0,0,0.35)]"
    />
  );
}

export function Board({ game, onSwipe }: BoardProps) {
  const cells: Pos[] = [];
  for (let y = 0; y < game.height; y += 1) {
    for (let x = 0; x < game.width; x += 1) {
      cells.push({ x, y });
    }
  }

  return (
    <div
      className="lcd-screen relative mx-auto aspect-square w-[min(100%,26rem,min(58dvh,calc(100dvw-1.5rem)))] touch-none overflow-hidden rounded-[18px] border-[6px] border-lcd-ink bg-lcd-ink p-2 shadow-[inset_0_0_0_2px_#0c221d]"
      onTouchStart={(event) => {
        const touch = event.changedTouches[0];
        if (!touch) return;
        const target = event.currentTarget;
        target.dataset.sx = String(touch.clientX);
        target.dataset.sy = String(touch.clientY);
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        const target = event.currentTarget;
        if (!touch || !target.dataset.sx) return;
        const dx = touch.clientX - Number(target.dataset.sx);
        const dy = touch.clientY - Number(target.dataset.sy);
        if (Math.hypot(dx, dy) < 24) return;
        onSwipe(dx, dy);
      }}
    >
      <div
        className="relative grid aspect-square w-full gap-[3px] bg-lcd-ink"
        style={{
          gridTemplateColumns: `repeat(${game.width}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${game.height}, minmax(0, 1fr))`,
        }}
        role="grid"
        aria-label="Room"
      >
        {cells.map((cell) => {
          const id = key(cell);
          const isHoover = game.hoover.x === cell.x && game.hoover.y === cell.y;
          const isDirt = game.dirt.has(id);
          const isFurniture = game.obstacles.has(id);
          const isSlide = game.slides.has(id);
          return (
            <div
              key={id}
              role="gridcell"
              aria-label={
                isHoover
                  ? `Hoover at ${cell.x}, ${cell.y}`
                  : isDirt
                    ? `Fluff at ${cell.x}, ${cell.y}`
                    : isFurniture
                      ? `Furniture at ${cell.x}, ${cell.y}`
                      : isSlide
                        ? `Rug at ${cell.x}, ${cell.y}`
                        : `Floor ${cell.x}, ${cell.y}`
              }
              className={`relative flex items-center justify-center ${
                isSlide ? "bg-rug" : "bg-lcd/90"
              }`}
              style={{
                gridColumn: cell.x + 1,
                gridRow: game.height - cell.y,
              }}
            >
              {isSlide ? (
                <span aria-hidden className="absolute inset-x-1 top-1/2 h-0.5 -translate-y-1/2 bg-lcd-ink/25" />
              ) : null}
              {isFurniture ? <Furniture /> : null}
              {isDirt && !isHoover ? <Fluff /> : null}
              {isHoover ? <HooverBot /> : null}
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(26,58,50,0.06),rgba(26,58,50,0.06)_1px,transparent_1px,transparent_7px)]" />
    </div>
  );
}
