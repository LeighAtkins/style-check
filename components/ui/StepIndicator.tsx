"use client";

import { cn } from "@/lib/utils/cn";
import { CheckIcon } from "@heroicons/react/24/solid";

interface Step {
  id: number;
  name: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({
  steps,
  currentStep,
  className,
}: StepIndicatorProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center justify-center gap-2 sm:gap-4">
        {steps.map((step, stepIdx) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;

          return (
            <li key={step.id} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
                    isCompleted &&
                      "bg-[var(--color-accent-sage)] text-white",
                    isCurrent &&
                      "bg-[var(--color-primary)] text-white shadow-warm",
                    !isCompleted &&
                      !isCurrent &&
                      "bg-[var(--color-accent-cream)] text-[var(--color-text-muted)]"
                  )}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </span>
                <span
                  className={cn(
                    "hidden sm:block text-sm font-medium transition-colors duration-200",
                    isCurrent
                      ? "text-[var(--color-text)]"
                      : "text-[var(--color-text-muted)]"
                  )}
                >
                  {step.name}
                </span>
              </div>
              {stepIdx < steps.length - 1 && (
                <div
                  className={cn(
                    "ml-2 sm:ml-4 h-0.5 w-8 sm:w-16 rounded-full transition-colors duration-300",
                    isCompleted
                      ? "bg-[var(--color-accent-sage)]"
                      : "bg-[var(--color-border)]"
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
