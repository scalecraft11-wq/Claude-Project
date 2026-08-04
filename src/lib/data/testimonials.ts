export interface Testimonial {
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "They didn't just design a site — they designed a whole way of thinking about our brand online. Eighteen months later, the design tokens they set up are still the source of truth for everything we ship.",
    authorName: "Ines Callahan",
    authorRole: "Founder & CEO",
    companyName: "Lumora Skin",
  },
  {
    quote:
      "We'd worked with three agencies before Lumora Digital. This was the first team that understood our engineering constraints were part of the brief, not an obstacle to it.",
    authorName: "Marcus Webb",
    authorRole: "Head of Growth",
    companyName: "Verdant & Co",
  },
  {
    quote:
      "The handoff was the real surprise. Most agencies leave you with a black box. We got a codebase our own engineers actually enjoyed working in.",
    authorName: "Priya Anand",
    authorRole: "VP Product",
    companyName: "Solstice Beauty",
  },
  {
    quote:
      "Every review call, they showed up with data, not just opinions. That's rarer than it should be in this industry.",
    authorName: "Julien Marchetti",
    authorRole: "Creative Director",
    companyName: "Marchetti",
  },
];
