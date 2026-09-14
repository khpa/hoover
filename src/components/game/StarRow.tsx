type StarRowProps = {
  count: number;
  size?: "sm" | "lg";
};

export function StarRow({ count, size = "sm" }: StarRowProps) {
  const box = size === "lg" ? "h-10 w-10" : "h-5 w-5";
  return (
    <div className="flex justify-center gap-1" aria-label={`${count} of 3 stars`}>
      {[1, 2, 3].map((slot) => (
        <svg
          key={slot}
          viewBox="0 0 24 24"
          className={`${size === "lg" ? "star-slam " : ""}${box} ${
            slot <= count ? "fill-brass" : "fill-transparent stroke-brass/70"
          }`}
          style={size === "lg" ? { animationDelay: `${slot * 80}ms` } : undefined}
          strokeWidth={slot <= count ? 0 : 1.75}
          aria-hidden="true"
        >
          <path d="M12 2.6 14.7 8.8l6.8.6-5.2 4.5 1.6 6.6L12 17.2 6.1 20.5l1.6-6.6L2.5 9.4l6.8-.6L12 2.6Z" />
        </svg>
      ))}
    </div>
  );
}
