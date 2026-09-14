import type { Metadata, Viewport } from "next";
import { Bungee, Chivo_Mono, Figtree } from "next/font/google";
import "./globals.css";

const bungee = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bungee",
});

const chivo = Chivo_Mono({
  subsets: ["latin"],
  variable: "--font-chivo",
});

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
});

export const metadata: Metadata = {
  title: "Hoover",
  description: "Insert coin. Hoover the fluff. A pocket arcade rebuild of a robot-vacuum tech test.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${bungee.variable} ${chivo.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {/*
          THESIS: A cherry fruit-machine cabinet that hoovers fluff — not a SaaS grid toy.
          OWN-WORLD: Cabinet red, brass coin, navy shell, mint LCD, Bungee wordmark.
          STORY: Insert coin, clear six rooms, paste NESW tape like the original test.
          FIRST VIEWPORT: Full-bleed cabinet, HOOVER stacked, PLAY as a brass coin.
          FORM: Pocket arcade / candy cabinet. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
        */}
        {children}
      </body>
    </html>
  );
}
