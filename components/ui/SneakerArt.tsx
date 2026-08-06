"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { ProductArt } from "@/lib/types";

type SneakerArtProps = {
  art: ProductArt;
  className?: string;
  glow?: boolean;
};

export function SneakerArt({ art, className, glow = true }: SneakerArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  return (
    <svg
      viewBox="0 0 520 320"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label="Sneaker illustration"
    >
      <defs>
        <linearGradient id={`upper-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.upper} stopOpacity="1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id={`sole-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.sole} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={art.accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={art.accent} stopOpacity="0" />
        </radialGradient>
        <filter id={`shadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>

      {glow && (
        <circle cx="260" cy="150" r="220" fill={`url(#glow-${uid})`} />
      )}

      <ellipse
        cx="270"
        cy="272"
        rx="190"
        ry="18"
        fill="#000000"
        opacity="0.45"
        filter={`url(#shadow-${uid})`}
      />

      <g>
        <path
          d="M55,238 C55,252 72,258 100,258 L430,258 C462,258 480,248 480,231 C480,220 468,214 450,216 L92,220 C68,220 55,226 55,238 Z"
          fill={`url(#sole-${uid})`}
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="1.5"
        />

        <path
          d="M70,220 L448,217 C462,217 466,209 460,199 L82,202 C64,202 55,208 70,220 Z"
          fill="#f2f1ea"
          opacity="0.92"
        />

        <path
          d="M78,203
             C64,168 78,132 118,112
             C138,102 150,86 172,74
             C206,56 250,52 292,64
             C324,73 344,90 352,112
             C398,116 438,136 456,170
             C466,188 460,200 440,203
             Z"
          fill={`url(#upper-${uid})`}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="2"
        />

        <path
          d="M340,120 C388,126 424,144 442,172 C448,183 446,192 434,196 L360,198 C368,170 360,142 340,120 Z"
          fill="#000000"
          opacity="0.18"
        />

        <path
          d="M150,86 C180,68 224,62 262,72 C240,64 200,66 172,80 C164,84 156,86 150,86 Z"
          fill="#ffffff"
          opacity="0.22"
        />

        <path
          d="M200,205 L145,120 C152,113 162,107 172,102 L232,203 Z"
          fill={art.accent}
          opacity="0.92"
        />
        <path
          d="M235,203 L190,110 C199,105 209,100 219,96 L268,203 Z"
          fill={art.accent}
          opacity="0.55"
        />

        <g fill={art.laces} opacity="0.95">
          <rect x="176" y="96" width="54" height="9" rx="4.5" transform="rotate(24 176 96)" />
          <rect x="188" y="112" width="58" height="9" rx="4.5" transform="rotate(22 188 112)" />
          <rect x="200" y="129" width="62" height="9" rx="4.5" transform="rotate(20 200 129)" />
          <rect x="212" y="147" width="64" height="9" rx="4.5" transform="rotate(18 212 147)" />
        </g>

        <path
          d="M92,116 C74,132 64,168 78,203 L60,203 C48,178 52,140 76,114 Z"
          fill={art.accent}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
        />

        <path
          d="M96,112 C78,90 76,66 90,50 C102,64 116,72 132,74 C112,82 100,96 96,112 Z"
          fill={`url(#upper-${uid})`}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1.5"
        />
        <path
          d="M96,112 C78,90 76,66 90,50 C102,64 116,72 132,74 C112,82 100,96 96,112 Z"
          fill="#000000"
          opacity="0.12"
        />
      </g>
    </svg>
  );
}
