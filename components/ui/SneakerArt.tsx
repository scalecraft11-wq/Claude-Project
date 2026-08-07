"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { ProductArt } from "@/lib/types";

export type Silhouette = "low" | "high" | "slide";

type SneakerArtProps = {
  art: ProductArt;
  className?: string;
  glow?: boolean;
  silhouette?: Silhouette;
};

export function SneakerArt({ art, className, glow = true, silhouette = "low" }: SneakerArtProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const outline = "rgba(24,24,24,0.12)";

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
          <stop offset="100%" stopColor="#000000" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id={`sole-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.sole} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={art.accent} stopOpacity="0.32" />
          <stop offset="100%" stopColor={art.accent} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`reflect-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={art.upper} stopOpacity="0.14" />
          <stop offset="100%" stopColor={art.upper} stopOpacity="0" />
        </linearGradient>
        <filter id={`shadow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
        </filter>
      </defs>

      {glow && <circle cx="260" cy="150" r="220" fill={`url(#glow-${uid})`} />}

      {/* contact shadow */}
      <ellipse
        cx="270"
        cy="270"
        rx="185"
        ry="14"
        fill="#181818"
        opacity="0.14"
        filter={`url(#shadow-${uid})`}
      />

      {/* soft floor reflection */}
      <g opacity="0.5" transform="translate(0 320) scale(1 -0.42)">
        <path
          d="M55,238 C55,252 72,258 100,258 L430,258 C462,258 480,248 480,231 L92,220 C68,220 55,226 55,238 Z"
          fill={`url(#reflect-${uid})`}
        />
      </g>

      {/* outsole - shared across all silhouettes */}
      <path
        d="M55,238 C55,252 72,258 100,258 L430,258 C462,258 480,248 480,231 C480,220 468,214 450,216 L92,220 C68,220 55,226 55,238 Z"
        fill={`url(#sole-${uid})`}
        stroke={outline}
        strokeWidth="1.5"
      />

      {/* footbed / midsole - shared */}
      <path
        d="M70,220 L448,217 C462,217 466,209 460,199 L82,202 C64,202 55,208 70,220 Z"
        fill="#eeece4"
        stroke={outline}
        strokeWidth="1.25"
      />

      {silhouette === "slide" && (
        <g>
          <path
            d="M150,205 C165,105 355,105 370,205 L370,232 C350,158 170,158 150,232 Z"
            fill={`url(#upper-${uid})`}
            stroke={outline}
            strokeWidth="1.5"
          />
          <path
            d="M96,68 C150,52 220,50 276,66 C300,73 318,84 330,98 C300,80 250,68 200,68 C170,68 138,72 110,82 Z"
            fill={`url(#sheen-${uid})`}
            transform="translate(70 100) scale(0.85 0.7)"
          />
          <path
            d="M222,205 C230,138 290,138 298,205 L298,222 C286,166 234,166 222,222 Z"
            fill={art.accent}
            opacity="0.92"
          />
        </g>
      )}

      {silhouette !== "slide" && (
        <g>
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
            stroke={outline}
            strokeWidth="1.5"
          />

          <path
            d="M340,120 C388,126 424,144 442,172 C448,183 446,192 434,196 L360,198 C368,170 360,142 340,120 Z"
            fill="#000000"
            opacity="0.14"
          />

          <path
            d="M96,68 C150,52 220,50 276,66 C300,73 318,84 330,98 C300,80 250,68 200,68 C170,68 138,72 110,82 Z"
            fill={`url(#sheen-${uid})`}
          />

          <path
            d="M200,205 L145,120 C152,113 162,107 172,102 L232,203 Z"
            fill={art.accent}
            opacity="0.94"
          />
          <path
            d="M235,203 L190,110 C199,105 209,100 219,96 L268,203 Z"
            fill={art.accent}
            opacity="0.58"
          />

          <g fill={art.laces} stroke={outline} strokeWidth="1">
            <rect x="176" y="96" width="54" height="9" rx="4.5" transform="rotate(24 176 96)" />
            <rect x="188" y="112" width="58" height="9" rx="4.5" transform="rotate(22 188 112)" />
            <rect x="200" y="129" width="62" height="9" rx="4.5" transform="rotate(20 200 129)" />
            <rect x="212" y="147" width="64" height="9" rx="4.5" transform="rotate(18 212 147)" />
          </g>

          {silhouette === "low" && (
            <>
              <path
                d="M92,116 C74,132 64,168 78,203 L60,203 C48,178 52,140 76,114 Z"
                fill={art.accent}
                stroke={outline}
                strokeWidth="1.5"
              />
              <path
                d="M96,112 C78,90 76,66 90,50 C102,64 116,72 132,74 C112,82 100,96 96,112 Z"
                fill={`url(#upper-${uid})`}
                stroke={outline}
                strokeWidth="1.5"
              />
              <path
                d="M96,112 C78,90 76,66 90,50 C102,64 116,72 132,74 C112,82 100,96 96,112 Z"
                fill="#000000"
                opacity="0.1"
              />
            </>
          )}

          {silhouette === "high" && (
            <>
              <path
                d="M90,116 C68,134 58,170 78,203 L58,203 C44,176 48,136 74,112 Z"
                fill={art.accent}
                stroke={outline}
                strokeWidth="1.5"
              />
              <path
                d="M92,116
                   C68,98 58,58 76,16
                   C96,2 124,0 146,14
                   C128,32 116,56 112,76
                   C108,92 100,106 92,116
                   Z"
                fill={`url(#upper-${uid})`}
                stroke={outline}
                strokeWidth="1.5"
              />
              <path
                d="M92,116 C68,98 58,58 76,16 C96,2 124,0 146,14 C128,32 116,56 112,76 C108,92 100,106 92,116 Z"
                fill="#000000"
                opacity="0.1"
              />
              {/* padded ankle collar band */}
              <path
                d="M80,34 C96,22 122,20 140,30 C138,40 132,48 124,54 C108,46 92,42 80,44 Z"
                fill={art.accent}
                opacity="0.85"
                stroke={outline}
                strokeWidth="1"
              />
            </>
          )}
        </g>
      )}
    </svg>
  );
}
