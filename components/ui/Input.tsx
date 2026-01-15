"use client";

import { cn } from "@/lib/utils/cn";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--color-text)] mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full h-12 px-4 rounded-[var(--radius-md)] border bg-[var(--color-bg-card)] text-[var(--color-text)] placeholder:text-[var(--color-text-light)] transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent",
            error
              ? "border-[var(--color-error)]"
              : "border-[var(--color-border)] hover:border-[var(--color-text-light)]",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[var(--color-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-[var(--color-text-muted)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
