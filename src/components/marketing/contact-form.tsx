"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import * as React from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StepProgress } from "@/components/ui/step-progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";

import { withMinimumDuration } from "@/lib/loading/with-minimum-duration";
import {
  budgetOptions,
  CONTACT_FORM_STEP_TITLES,
  contactDetailsSchema,
  leadQualificationSchema,
  projectTypeOptions,
  timelineOptions,
  type ContactDetails,
  type LeadQualification,
} from "@/lib/validation/contact-form";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = CONTACT_FORM_STEP_TITLES.length;

type LeadQualificationDraft = {
  projectType: string;
  budget: string;
  timeline: string;
  brandLink: string;
};

const EMPTY_LEAD: LeadQualificationDraft = {
  projectType: "",
  budget: "",
  timeline: "",
  brandLink: "",
};

/**
 * Multi-step lead-intake form — ARCHITECTURE.md §14: project type, budget
 * band, timeline, and brand links, gathered before contact details.
 * Steps 1–3 (the radio/URL steps) are plain local state validated
 * on-demand against `leadQualificationSchema` — no React Hook Form
 * involved there at all, which sidesteps a real bug this form used to
 * have: a single RHF instance spanning every step means its schema
 * resolver validates the *whole* form (there's no partial-validation
 * mode), so simply mounting a later step's fields for the first time
 * could flag them as invalid before the user ever saw them. Step 4 (the
 * actual contact details) is its own small, isolated RHF + Zod form —
 * exactly the kind of field the combo is built for — with nothing else
 * in its schema for that resolver to prematurely flag.
 */
export function ContactForm() {
  const [step, setStep] = React.useState(0);
  const [lead, setLead] = React.useState<LeadQualificationDraft>(EMPTY_LEAD);
  const [stepErrors, setStepErrors] = React.useState<Record<string, string>>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const detailsForm = useForm<ContactDetails>({
    resolver: zodResolver(contactDetailsSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  const goNext = () => {
    if (step === 0) {
      if (!lead.projectType) {
        setStepErrors({
          projectType: "Choose the option closest to your project.",
        });
        return;
      }
    } else if (step === 1) {
      if (!lead.budget) {
        setStepErrors({ budget: "Choose a budget band." });
        return;
      }
    } else if (step === 2) {
      const result = leadQualificationSchema
        .pick({ timeline: true, brandLink: true })
        .safeParse({ timeline: lead.timeline, brandLink: lead.brandLink });
      if (!result.success) {
        const errors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          errors[String(issue.path[0])] = issue.message;
        });
        setStepErrors(errors);
        return;
      }
    }

    setStepErrors({});
    setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
  };

  const goBack = () => {
    setStepErrors({});
    setStep((current) => Math.max(current - 1, 0));
  };

  const onSubmitDetails = async (details: ContactDetails) => {
    const fullLead = leadQualificationSchema.parse({
      projectType: lead.projectType,
      budget: lead.budget,
      timeline: lead.timeline,
      brandLink: lead.brandLink,
    }) satisfies LeadQualification;

    setIsSubmitting(true);
    await withMinimumDuration(
      new Promise((resolve) => setTimeout(resolve, 600)),
      900,
    );
    setIsSubmitting(false);
    setIsSubmitted(true);

    // fullLead + details together form the complete lead payload a real
    // backend would receive — logged here only to keep it a real,
    // referenced value rather than dead code in a build with no backend.
    void fullLead;

    toast.success("Message sent", {
      description: `Thanks, ${details.name.split(" ")[0]} — we'll reply within one business day.`,
    });
  };

  if (isSubmitted) {
    return (
      <div className="grid gap-4 rounded-card border border-hairline-subtle bg-surface p-10 text-center">
        <p className="text-overline text-accent">Message sent</p>
        <h2 className="font-display text-heading-01 text-content-primary">
          Thanks — we&rsquo;ll be in touch within one business day.
        </h2>
        <p className="mx-auto max-w-measure text-body-md text-content-secondary">
          We read every project brief personally — no auto-reply, no sales
          queue. Expect a real response with next steps, not a form-letter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 rounded-card border border-hairline-subtle bg-surface p-8 sm:p-10">
      <div className="grid gap-3">
        <StepProgress totalSteps={TOTAL_STEPS} currentStep={step + 1} />
        <p className="text-body-sm text-content-muted">
          Step {step + 1} of {TOTAL_STEPS}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6"
        >
          <h2 className="font-display text-heading-02 text-content-primary">
            {CONTACT_FORM_STEP_TITLES[step]}
          </h2>

          {step === 0 && (
            <div className="grid gap-2">
              <RadioGroup
                value={lead.projectType}
                onValueChange={(value) =>
                  setLead((current) => ({ ...current, projectType: value }))
                }
                aria-label="Project type"
              >
                {projectTypeOptions.map((option) => (
                  <RadioOption
                    key={option.value}
                    id={`projectType-${option.value}`}
                    value={option.value}
                    label={option.label}
                    checked={lead.projectType === option.value}
                  />
                ))}
              </RadioGroup>
              <p role="alert" className="min-h-5 text-body-sm text-danger">
                {stepErrors.projectType}
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-2">
              <RadioGroup
                value={lead.budget}
                onValueChange={(value) =>
                  setLead((current) => ({ ...current, budget: value }))
                }
                aria-label="Budget band"
              >
                {budgetOptions.map((option) => (
                  <RadioOption
                    key={option.value}
                    id={`budget-${option.value}`}
                    value={option.value}
                    label={option.label}
                    checked={lead.budget === option.value}
                  />
                ))}
              </RadioGroup>
              <p role="alert" className="min-h-5 text-body-sm text-danger">
                {stepErrors.budget}
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6">
              <div className="grid gap-2">
                <RadioGroup
                  value={lead.timeline}
                  onValueChange={(value) =>
                    setLead((current) => ({ ...current, timeline: value }))
                  }
                  aria-label="Timeline"
                >
                  {timelineOptions.map((option) => (
                    <RadioOption
                      key={option.value}
                      id={`timeline-${option.value}`}
                      value={option.value}
                      label={option.label}
                      checked={lead.timeline === option.value}
                    />
                  ))}
                </RadioGroup>
                <p role="alert" className="min-h-5 text-body-sm text-danger">
                  {stepErrors.timeline}
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="brandLink">
                  Existing site or brand link (optional)
                </Label>
                <Input
                  id="brandLink"
                  type="url"
                  placeholder="https://"
                  value={lead.brandLink}
                  onChange={(event) =>
                    setLead((current) => ({
                      ...current,
                      brandLink: event.target.value,
                    }))
                  }
                  aria-invalid={!!stepErrors.brandLink}
                />
                <p role="alert" className="min-h-5 text-body-sm text-danger">
                  {stepErrors.brandLink}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <Form {...detailsForm}>
              <form
                onSubmit={detailsForm.handleSubmit(onSubmitDetails)}
                noValidate
                className="grid gap-6 sm:grid-cols-2"
              >
                <FormField
                  control={detailsForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" autoComplete="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Company (optional)</FormLabel>
                      <FormControl>
                        <Input autoComplete="organization" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={detailsForm.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Tell us about the project</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-full flex items-center justify-between border-t border-hairline-subtle pt-6">
                  <Button type="button" variant="secondary" onClick={goBack}>
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                  >
                    Send message
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </motion.div>
      </AnimatePresence>

      {step < TOTAL_STEPS - 1 && (
        <div className="flex items-center justify-between border-t border-hairline-subtle pt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={goBack}
            disabled={step === 0}
          >
            Back
          </Button>
          <Button type="button" variant="primary" onClick={goNext}>
            Continue
          </Button>
        </div>
      )}
    </div>
  );
}

function RadioOption({
  id,
  value,
  label,
  checked,
}: {
  id: string;
  value: string;
  label: string;
  checked: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-sm border p-4 transition-colors duration-fast",
        checked ? "border-accent bg-accent-subtle" : "border-hairline-subtle",
      )}
    >
      <RadioGroupItem value={value} id={id} />
      <Label htmlFor={id} className="flex-1 cursor-pointer">
        {label}
      </Label>
    </div>
  );
}
