"use client";

import { cn } from "@/lib/utils/cn";
import type { Fabric } from "@/types/fabric";
import Image from "next/image";
import { CheckIcon } from "@heroicons/react/24/solid";

interface FabricCardProps {
  fabric: Fabric;
  isSelected?: boolean;
  isUsed?: boolean;
  onSelect?: (fabric: Fabric) => void;
  size?: "sm" | "md" | "lg";
}

export function FabricCard({
  fabric,
  isSelected = false,
  isUsed = false,
  onSelect,
  size = "md",
}: FabricCardProps) {
  const sizes = {
    sm: {
      container: "w-20",
      image: "h-20 w-20",
      text: "text-xs",
    },
    md: {
      container: "w-28",
      image: "h-28 w-28",
      text: "text-sm",
    },
    lg: {
      container: "w-36",
      image: "h-36 w-36",
      text: "text-base",
    },
  };

  const s = sizes[size];

  return (
    <button
      onClick={() => onSelect?.(fabric)}
      className={cn(
        "group flex flex-col items-center gap-2 rounded-[var(--radius-lg)] p-2 transition-all duration-200",
        onSelect && "cursor-pointer hover:bg-[var(--color-accent-cream)]",
        isSelected && "bg-[var(--color-primary)]/10"
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "relative overflow-hidden rounded-[var(--radius-md)] ring-2 ring-offset-2 transition-all duration-200",
            s.image,
            isSelected
              ? "ring-[var(--color-primary)]"
              : "ring-transparent group-hover:ring-[var(--color-border)]"
          )}
        >
          <Image
            src={fabric.thumbnailUrl || fabric.imageUrl}
            alt={fabric.name}
            fill
            className="object-cover"
          />
        </div>

        {isSelected && (
          <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md">
            <CheckIcon className="h-4 w-4" />
          </div>
        )}
        
        {isUsed && !isSelected && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white shadow-md">
            <CheckIcon className="h-3 w-3" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-1">
        <span
          className={cn(
            "text-center font-medium leading-tight",
            s.text,
            isSelected
              ? "text-[var(--color-primary)]"
              : "text-[var(--color-text)]"
          )}
        >
          {fabric.name}
        </span>
        {isUsed && (
          <span className="text-xs text-green-600 font-medium">
            Used
          </span>
        )}
      </div>
    </button>
  );
}
