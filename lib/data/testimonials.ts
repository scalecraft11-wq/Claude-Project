import type { Testimonial, FaqItem } from "@/lib/types";

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Marcus Chen",
    role: "Marathon Runner",
    quote:
      "The Velocity Surge Runner changed how I think about race day. Light, responsive, and it still looks incredible after 300 miles.",
    rating: 5,
    initials: "MC",
  },
  {
    id: "t2",
    name: "Amara Osei",
    role: "Point Guard, City League",
    quote:
      "Apex Court Pro gives me confidence to plant and cut hard. Zero slip, zero hesitation. Easily the best court shoe I've owned.",
    rating: 5,
    initials: "AO",
  },
  {
    id: "t3",
    name: "Jordan Reyes",
    role: "Creative Director",
    quote:
      "Velocity Shoes nails the balance between street style and premium build quality. The Retro Boulevard gets stopped-on-the-sidewalk compliments weekly.",
    rating: 5,
    initials: "JR",
  },
  {
    id: "t4",
    name: "Priya Nair",
    role: "CrossFit Coach",
    quote:
      "I put the GripForce Trainer through brutal WODs every day. The stability and durability are unmatched at this price point.",
    rating: 4,
    initials: "PN",
  },
  {
    id: "t5",
    name: "Diego Fernandez",
    role: "Sneaker Collector",
    quote:
      "The unboxing experience alone feels luxury. Add in genuinely comfortable, well-made shoes and Velocity is now on permanent rotation.",
    rating: 5,
    initials: "DF",
  },
  {
    id: "t6",
    name: "Lena Kowalski",
    role: "Physical Therapist",
    quote:
      "I recommend the Cloudstep to clients recovering from injury. The cushioning is genuinely therapeutic, not just marketing.",
    rating: 5,
    initials: "LK",
  },
];

export const faqItems: FaqItem[] = [
  {
    id: "f1",
    question: "What is your return and exchange policy?",
    answer:
      "We offer free returns and exchanges within 45 days of delivery. Items must be unworn with original packaging. Refunds are issued to your original payment method within 3-5 business days of us receiving your return.",
  },
  {
    id: "f2",
    question: "How long does shipping take?",
    answer:
      "Standard shipping arrives in 3-5 business days. Express shipping (1-2 business days) is available at checkout. All orders over $150 ship free, automatically.",
  },
  {
    id: "f3",
    question: "How do Velocity Shoes fit compared to other brands?",
    answer:
      "Most styles run true to size. Knit and mesh running silhouettes have a snugger, sock-like fit — we recommend sizing up half a size if you're between sizes. Each product page includes specific fit notes.",
  },
  {
    id: "f4",
    question: "Do you ship internationally?",
    answer:
      "Yes, we currently ship to over 30 countries. International duties and taxes are calculated at checkout so there are no surprises at delivery.",
  },
  {
    id: "f5",
    question: "How do I care for my shoes?",
    answer:
      "Use a soft brush and mild soap for uppers, and let them air dry away from direct heat. Avoid the washing machine — it can damage cushioning and bonded overlays.",
  },
  {
    id: "f6",
    question: "Is there a warranty on Velocity Shoes products?",
    answer:
      "Every pair is covered by our 12-month craftsmanship warranty against manufacturing defects in materials and construction, from the date of purchase.",
  },
];
