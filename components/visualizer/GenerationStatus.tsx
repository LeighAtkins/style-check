"use client";

import { cn } from "@/lib/utils/cn";
import { Spinner } from "@/components/ui";
import type { GenerationStatus as StatusType } from "@/types/generation";

interface GenerationStatusProps {
  status: StatusType;
  message?: string;
  className?: string;
}

const statusMessages: Record<StatusType, string> = {
  idle: "",
  uploading: "Uploading your image...",
  generating: "Creating your visualization...",
  complete: "Done!",
  error: "Something went wrong",
};

export function GenerationStatus({
  status,
  message,
  className,
}: GenerationStatusProps) {
  if (status === "idle" || status === "complete") {
    return null;
  }

  const displayMessage = message || statusMessages[status];
  const isError = status === "error";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className
      )}
    >
      {!isError && <Spinner size="lg" className="mb-4" />}

      <p
        className={cn(
          "text-lg font-medium",
          isError ? "text-[var(--color-error)]" : "text-[var(--color-text)]"
        )}
      >
        {displayMessage}
      </p>

      {status === "generating" && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          This may take 10-20 seconds
        </p>
      )}
    </div>
  );
}
