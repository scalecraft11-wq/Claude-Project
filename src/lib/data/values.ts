export interface StudioValue {
  number: string;
  title: string;
  description: string;
}

export const studioValues: StudioValue[] = [
  {
    number: "01",
    title: "Craft over speed",
    description:
      "We'd rather ship two weeks later with the transition curves right than hit a date with something that feels ordinary.",
  },
  {
    number: "02",
    title: "One team, no handoffs",
    description:
      "Design and engineering sit in the same standup. Nothing gets 'thrown over the wall' to a separate dev shop to reinterpret.",
  },
  {
    number: "03",
    title: "Performance is a feature",
    description:
      "A 3-second load isn't an acceptable trade-off for beautiful — every build ships against a Lighthouse and Core Web Vitals budget from day one.",
  },
  {
    number: "04",
    title: "Design that sells",
    description:
      "We measure our work in conversion lift and retention, not just award-show screenshots. Beautiful and effective aren't in tension.",
  },
  {
    number: "05",
    title: "No black boxes",
    description:
      "Every build hands off on mainstream, documented tooling your team can actually run — never a proprietary stack only we can maintain.",
  },
];
