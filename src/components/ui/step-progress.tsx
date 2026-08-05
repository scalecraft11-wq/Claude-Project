import { cn } from "@/lib/utils";

export interface StepProgressProps {
  totalSteps: number;
  /** 1-indexed current step. */
  currentStep: number;
  className?: string;
}

/**
 * Multi-step form progress — ARCHITECTURE.md §14: "a slim progress
 * indicator (segmented hairline bar, not a numbered stepper — quieter)."
 */
export function StepProgress({
  totalSteps,
  currentStep,
  className,
}: StepProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
      className={cn("flex gap-1.5", className)}
    >
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={cn(
            "h-1 flex-1 rounded-full transition-colors duration-base",
            index < currentStep ? "bg-accent" : "bg-surface-raised",
          )}
        />
      ))}
    </div>
  );
}
