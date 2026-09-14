import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-lg items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-display text-4xl text-hoover">Wrong room</h1>
        <p className="mt-2 text-sm text-lcd/80">That floor isn&apos;t on the cabinet.</p>
        <Link href="/play" className="mt-6 inline-flex min-h-12 items-center text-brass">
          Back to the campaign
        </Link>
      </div>
    </main>
  );
}
