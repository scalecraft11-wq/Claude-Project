export interface StudioStat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export const studioStats: StudioStat[] = [
  { value: 34, suffix: "+", label: "Brands launched" },
  { value: 96, suffix: "%", label: "Client retention past year one" },
  { value: 4.9, decimals: 1, suffix: "/5", label: "Average client rating" },
  { value: 8, label: "Years in production" },
];

export const processSteps = [
  {
    label: "01",
    title: "Discovery",
    description:
      "A two-week sprint: brand/UX audit, technical scoping, and a fixed-price proposal — no ambiguity about what you're buying.",
  },
  {
    label: "02",
    title: "Design",
    description:
      "Two-week iterations, working prototypes every cycle — never a single reveal at the end of a black-box design phase.",
  },
  {
    label: "03",
    title: "Build",
    description:
      "Engineering runs in parallel with design refinement, gated against the same performance and accessibility budget from day one.",
  },
  {
    label: "04",
    title: "Launch & Handoff",
    description:
      "A documented handoff, a CMS your team can run, and a codebase built on mainstream tooling — not a black box only we can maintain.",
  },
];
