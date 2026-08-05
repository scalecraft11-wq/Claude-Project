import { cn } from "@/lib/utils";

export interface ArtworkTileProps {
  /** Any stable string (a slug/title) — determines which palette pairing
   * and angle this tile renders, so the same content always renders the
   * same artwork. */
  seed: string;
  className?: string;
}

/**
 * A deterministic, on-brand abstract gradient composition used as cover
 * art wherever real photography doesn't exist yet (case studies, blog
 * posts, portfolio pieces authored as mock/demo content). This is a
 * deliberate design decision, not a placeholder: every tile is a real,
 * finished piece of art drawn from the brand's own palette
 * (DESIGN_SYSTEM.md §4) — never a gray box, a broken image icon, or a
 * third-party placeholder-image service.
 */
const PALETTE_PAIRINGS: Array<[string, string, string]> = [
  ["#a8632b", "#1c1712", "#e3c68f"], // copper / ink / gold
  ["#6b7a5e", "#1c1712", "#c9a15c"], // sage / ink / gold
  ["#c17a5c", "#1c1712", "#f6ead3"], // clay / ink / paper
  ["#8f6935", "#0f0c09", "#dda98d"], // deep copper / near-black / clay
  ["#4c5842", "#1c1712", "#e3c68f"], // deep sage / ink / gold
  ["#532f16", "#1c1712", "#c9a15c"], // deep copper / ink / gold
];

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function ArtworkTile({ seed, className }: ArtworkTileProps) {
  const hash = hashSeed(seed);
  const [from, via, to] = PALETTE_PAIRINGS[hash % PALETTE_PAIRINGS.length]!;
  const angle = 30 + (hash % 120);
  const cx = 20 + (hash % 60);
  const cy = 20 + ((hash >> 3) % 60);

  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden", className)}
      style={{
        backgroundImage: `linear-gradient(${angle}deg, ${from} 0%, ${via} 55%, ${to} 100%)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-40 mix-blend-soft-light"
        style={{
          backgroundImage: `radial-gradient(circle at ${cx}% ${cy}%, rgba(255,255,255,0.6) 0%, transparent 55%)`,
        }}
      />
    </div>
  );
}
