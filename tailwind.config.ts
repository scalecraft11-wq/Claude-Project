import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

/**
 * Tailwind theme is a thin mapping onto the token layer defined in
 * `src/styles/tokens.css`. Components should reach for these utilities
 * (e.g. `bg-canvas`, `text-primary`, `rounded-button`, `shadow-elevation-2`)
 * rather than raw Tailwind palette classes — see DESIGN_SYSTEM.md §32
 * (Token System) for the full three-tier rationale.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
      "3xl": "1920px",
    },
    extend: {
      colors: {
        canvas: "var(--color-bg-canvas)",
        surface: {
          DEFAULT: "var(--color-bg-surface)",
          raised: "var(--color-bg-surface-raised)",
        },
        // Named "hairline", not "border" — Tailwind's borderColor plugin
        // prefixes with "border-" itself, so a color group literally named
        // "border" would require the class `border-border-subtle` (prefix +
        // key collide). "hairline" avoids the collision.
        hairline: {
          subtle: "var(--color-border-subtle)",
          strong: "var(--color-border-strong)",
        },
        content: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          inverse: "var(--color-text-inverse)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          subtle: "var(--color-accent-subtle-bg)",
          foreground: "var(--color-text-on-accent)",
        },
        button: {
          primary: {
            DEFAULT: "var(--color-button-primary-bg)",
            foreground: "var(--color-button-primary-fg)",
          },
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
        info: "var(--color-info)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        ui: ["var(--font-ui)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "display-01": [
          "clamp(2.75rem, 2rem + 3.5vw, 6rem)",
          { lineHeight: "1.02", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-02": [
          "clamp(2.25rem, 1.75rem + 2.5vw, 4.5rem)",
          { lineHeight: "1.04", letterSpacing: "-0.02em", fontWeight: "500" },
        ],
        "display-03": [
          "clamp(1.75rem, 1.4rem + 1.6vw, 3rem)",
          { lineHeight: "1.08", letterSpacing: "-0.01em", fontWeight: "400" },
        ],
        "heading-01": [
          "clamp(1.5rem, 1.3rem + 0.8vw, 2.25rem)",
          { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "heading-02": [
          "clamp(1.25rem, 1.15rem + 0.5vw, 1.75rem)",
          { lineHeight: "1.2", letterSpacing: "-0.005em", fontWeight: "600" },
        ],
        "heading-03": ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55" }],
        caption: ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.01em" }],
        overline: [
          "0.6875rem",
          { lineHeight: "1.2", letterSpacing: "0.12em", fontWeight: "600" },
        ],
        button: [
          "0.9375rem",
          { lineHeight: "1", letterSpacing: "0.01em", fontWeight: "500" },
        ],
      },
      spacing: {
        "section-sm": "var(--space-section-sm)",
        "section-md": "var(--space-section-md)",
        "section-lg": "var(--space-section-lg)",
      },
      maxWidth: {
        "container-sm": "100%",
        "container-md": "100%",
        "container-lg": "1120px",
        "container-xl": "1280px",
        "container-2xl": "1440px",
        "container-3xl": "1600px",
        measure: "45rem",
      },
      borderRadius: {
        none: "0px",
        xs: "2px",
        sm: "4px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "20px",
        "2xl": "32px",
        full: "9999px",
        button: "var(--radius-button)",
        card: "var(--radius-card)",
      },
      boxShadow: {
        "elevation-0": "none",
        "elevation-1": "var(--shadow-elevation-1)",
        "elevation-2": "var(--shadow-elevation-2)",
        "elevation-3": "var(--shadow-elevation-3)",
        "elevation-4": "var(--shadow-elevation-4)",
        "elevation-5": "var(--shadow-elevation-5)",
        "elevation-glow": "var(--shadow-elevation-glow)",
      },
      transitionDuration: {
        instant: "100ms",
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
        cinematic: "700ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
        editorial: "cubic-bezier(0.65, 0, 0.35, 1)",
        "luxury-out": "cubic-bezier(0.16, 1, 0.3, 1)",
        "luxury-in": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      backdropBlur: {
        glass: "20px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s cubic-bezier(0.65, 0, 0.35, 1)",
        "accordion-up": "accordion-up 0.25s cubic-bezier(0.65, 0, 0.35, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
