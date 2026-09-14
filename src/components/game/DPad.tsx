"use client";

import { useEffect, useRef, type PointerEvent } from "react";

type Dir = "N" | "E" | "S" | "W";

type DPadProps = {
  onMove: (dir: Dir) => void;
  disabled?: boolean;
};

const padClass =
  "flex min-h-14 min-w-14 touch-none items-center justify-center rounded-[14px] border-2 border-brass-dark bg-navy text-brass shadow-[0_4px_0_#101328] transition-[transform,box-shadow] duration-150 active:translate-y-0.5 active:shadow-none disabled:opacity-40";

function Chevron({ rotate }: { rotate: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6" style={{ transform: `rotate(${rotate}deg)` }}>
      <path fill="currentColor" d="M12 7.2 18.4 14H5.6L12 7.2Z" />
    </svg>
  );
}

function PadKey({
  dir,
  disabled,
  onMove,
  label,
  rotate,
}: {
  dir: Dir;
  disabled?: boolean;
  onMove: (dir: Dir) => void;
  label: string;
  rotate: number;
}) {
  const onMoveRef = useRef(onMove);
  const timers = useRef<{ delay?: number; repeat?: number }>({});

  useEffect(() => {
    onMoveRef.current = onMove;
  }, [onMove]);

  useEffect(() => {
    if (!disabled) return;
    if (timers.current.delay) window.clearTimeout(timers.current.delay);
    if (timers.current.repeat) window.clearInterval(timers.current.repeat);
    timers.current = {};
  }, [disabled]);

  useEffect(
    () => () => {
      if (timers.current.delay) window.clearTimeout(timers.current.delay);
      if (timers.current.repeat) window.clearInterval(timers.current.repeat);
    },
    [],
  );

  function startHold(event: PointerEvent<HTMLButtonElement>) {
    if (disabled) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onMoveRef.current(dir);
    timers.current.delay = window.setTimeout(() => {
      timers.current.repeat = window.setInterval(() => onMoveRef.current(dir), 130);
    }, 260);
  }

  function stopHold() {
    if (timers.current.delay) window.clearTimeout(timers.current.delay);
    if (timers.current.repeat) window.clearInterval(timers.current.repeat);
    timers.current = {};
  }

  return (
    <button
      type="button"
      className={padClass}
      disabled={disabled}
      aria-label={label}
      onPointerDown={startHold}
      onPointerUp={stopHold}
      onPointerCancel={stopHold}
      onLostPointerCapture={stopHold}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Chevron rotate={rotate} />
    </button>
  );
}

export function DPad({ onMove, disabled }: DPadProps) {
  return (
    <div className="grid w-[184px] grid-cols-3 grid-rows-3 gap-2" aria-label="Direction pad">
      <span />
      <PadKey dir="N" disabled={disabled} onMove={onMove} label="North" rotate={0} />
      <span />
      <PadKey dir="W" disabled={disabled} onMove={onMove} label="West" rotate={-90} />
      <span className="grid place-items-center font-score text-[10px] tracking-wide text-brass/70">PAD</span>
      <PadKey dir="E" disabled={disabled} onMove={onMove} label="East" rotate={90} />
      <span />
      <PadKey dir="S" disabled={disabled} onMove={onMove} label="South" rotate={180} />
    </div>
  );
}
