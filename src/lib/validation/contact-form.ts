import { z } from "zod";

export const projectTypeOptions = [
  { value: "new-site", label: "A brand-new site" },
  { value: "redesign", label: "A redesign of an existing site" },
  { value: "ecommerce", label: "A full e-commerce build" },
  { value: "partnership", label: "An ongoing design/engineering partnership" },
] as const;

export const budgetOptions = [
  { value: "under-30k", label: "Under $30,000" },
  { value: "30k-65k", label: "$30,000 – $65,000" },
  { value: "65k-150k", label: "$65,000 – $150,000" },
  { value: "150k-plus", label: "$150,000+" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3-months", label: "1–3 months" },
  { value: "3-6-months", label: "3–6 months" },
  { value: "flexible", label: "Flexible" },
] as const;

const brandLinkSchema = z
  .union([z.literal(""), z.string().url("Enter a valid URL.")])
  .optional();

/**
 * The lead-qualification steps (project type, budget, timeline, brand
 * link) are plain local component state, not React Hook Form — a schema
 * resolver validates its *entire* form on every call, which is exactly
 * wrong for a wizard where later steps' fields don't exist yet. Keeping
 * these three steps outside RHF entirely (each validated on its own,
 * on demand) means there is no combined schema left to bleed across
 * steps.
 */
export const leadQualificationSchema = z.object({
  projectType: z.enum(
    projectTypeOptions.map((option) => option.value) as [string, ...string[]],
    { message: "Choose the option closest to your project." },
  ),
  budget: z.enum(
    budgetOptions.map((option) => option.value) as [string, ...string[]],
    { message: "Choose a budget band." },
  ),
  timeline: z.enum(
    timelineOptions.map((option) => option.value) as [string, ...string[]],
    { message: "Choose a timeline." },
  ),
  brandLink: brandLinkSchema,
});

export type LeadQualification = z.infer<typeof leadQualificationSchema>;

/**
 * The final step — real contact details — is where React Hook Form +
 * Zod earns its keep (email format, min-length copy, focus management).
 * It's its own isolated form with only these four fields, so there's
 * nothing else in the schema for the resolver to prematurely flag.
 */
export const contactDetailsSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  company: z.string().trim().optional(),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more — at least 20 characters."),
});

export type ContactDetails = z.infer<typeof contactDetailsSchema>;

export const CONTACT_FORM_STEP_TITLES = [
  "What are you looking to build?",
  "What's the budget for this project?",
  "When do you need to launch?",
  "Last thing — how do we reach you?",
] as const;
