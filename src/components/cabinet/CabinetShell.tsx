import type { ReactNode } from "react";

type CabinetShellProps = {
  children: ReactNode;
  boot?: boolean;
  bump?: boolean;
  className?: string;
};

export function CabinetShell({ children, boot = false, bump = false, className = "" }: CabinetShellProps) {
  return (
    <div className={`${boot ? "boot-in" : ""} ${bump ? "bumping" : ""} ${className}`}>
      <div className="relative overflow-hidden rounded-[28px] border-4 border-brass-dark bg-cabinet shadow-[0_18px_0_#6b0c1c,0_28px_40px_rgba(0,0,0,0.45)]">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-10 bg-linear-to-b from-cabinet-shine/50 to-transparent" />
        <div className="pointer-events-none absolute left-3 top-3 h-3 w-3 rounded-full bg-brass shadow-[inset_0_1px_0_#f0d48a]" />
        <div className="pointer-events-none absolute right-3 top-3 h-3 w-3 rounded-full bg-brass shadow-[inset_0_1px_0_#f0d48a]" />
        <div className="relative px-3 pb-4 pt-8 sm:px-5">{children}</div>
      </div>
    </div>
  );
}
