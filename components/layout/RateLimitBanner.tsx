"use client";

import { cn } from "@/lib/utils/cn";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface RateLimitBannerProps {
  remaining: number;
  resetAt?: string;
  className?: string;
}

export function RateLimitBanner({
  remaining,
  resetAt,
  className,
}: RateLimitBannerProps) {
  const formatResetTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (remaining === 0) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent-gold)]/10 border border-[var(--color-accent-gold)]/20",
          className
        )}
      >
        <InformationCircleIcon className="h-5 w-5 text-[var(--color-accent-gold)]" />
        <p className="text-sm text-[var(--color-text)]">
          You&apos;ve reached your daily limit.
          {resetAt && (
            <span className="text-[var(--color-text-muted)]">
              {" "}
              Resets at {formatResetTime(resetAt)}
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <p
      className={cn(
        "text-center text-sm text-[var(--color-text-muted)]",
        className
      )}
    >
      {remaining} visualization{remaining !== 1 ? "s" : ""} remaining today
    </p>
  );
}
