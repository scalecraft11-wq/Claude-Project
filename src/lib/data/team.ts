export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}

export const teamMembers: TeamMember[] = [
  {
    name: "Sam Okonkwo",
    role: "Creative Director & Founder",
    bio: "Started the studio after a decade leading brand work at two large agencies, tired of watching beautiful design get bolted onto slow, unmaintainable code.",
  },
  {
    name: "Dana Ferro",
    role: "Principal Engineer",
    bio: "Leads the engineering side of every build — Next.js, Three.js, and the performance budget nobody else wants to own.",
  },
  {
    name: "Priya Chandran",
    role: "Senior Front-End Engineer",
    bio: "Owns the motion system across every client build — the person who decides whether an animation is GSAP's job or Framer Motion's.",
  },
  {
    name: "Theo Bergström",
    role: "Senior Product Designer",
    bio: "Designs the interaction flows that actually convert — checkout, booking, onboarding — with the same care as the hero moment.",
  },
  {
    name: "Naomi Reyes",
    role: "Head of Client Partnerships",
    bio: "The first and last person a client talks to — runs discovery, scoping, and the weekly cadence that keeps builds on schedule.",
  },
  {
    name: "Kai Sørensen",
    role: "3D & Motion Artist",
    bio: "Models and lights every product visualization from scratch — no stock assets, no shortcuts on the reflections.",
  },
];
