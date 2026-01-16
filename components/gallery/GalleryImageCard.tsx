"use client";

import { cn } from "@/lib/utils/cn";
import type { GalleryImage } from "@/types/gallery";
import Image from "next/image";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";

interface GalleryImageCardProps {
  image: GalleryImage;
  isSelected?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

export function GalleryImageCard({
  image,
  isSelected = false,
  onSelect,
  onDelete,
}: GalleryImageCardProps) {
  const formattedDate = new Date(image.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] p-3 transition-all duration-200 shadow-soft",
        isSelected && "ring-2 ring-[var(--color-primary)]"
      )}
    >
      <button
        onClick={onSelect}
        className="relative overflow-hidden rounded-[var(--radius-md)]"
      >
        <div className="grid grid-cols-2 gap-1">
          <div className="relative aspect-[4/3]">
            <Image
              src={image.originalUrl}
              alt="Original sofa"
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 left-1 rounded-[var(--radius-xs)] bg-black/60 px-1.5 py-0.5 text-xs text-white">
              Original
            </span>
          </div>
          <div className="relative aspect-[4/3]">
            <Image
              src={image.imageUrl}
              alt={`Sofa with ${image.fabricName}`}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-1 left-1 rounded-[var(--radius-xs)] bg-[var(--color-primary)] px-1.5 py-0.5 text-xs text-white truncate max-w-full">
              {image.fabricName}
            </span>
          </div>
        </div>

        {isSelected && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md">
            <CheckIcon className="h-4 w-4" />
          </div>
        )}
      </button>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="h-6 w-6 flex-shrink-0 rounded-[var(--radius-sm)] border border-[var(--color-border)]"
            style={{
              backgroundImage: `url(${image.fabricThumbnailUrl})`,
              backgroundSize: "cover",
            }}
          />
          <span className="truncate text-sm font-medium text-[var(--color-text)]">
            {image.fabricName}
          </span>
        </div>

        <span className="flex-shrink-0 text-xs text-[var(--color-text-muted)]">
          {formattedDate}
        </span>
      </div>

      {onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--color-error)]"
          aria-label="Delete image"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
