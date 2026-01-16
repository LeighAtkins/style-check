"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui";
import { GalleryImageCard } from "./GalleryImageCard";
import { GalleryComparison } from "./GalleryComparison";
import { PhotoIcon, CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

interface GalleryViewProps {
  images: GalleryImage[];
  isLoading?: boolean;
  onDelete: (imageId: string) => Promise<{ success: boolean; remainingCount?: number }>;
  className?: string;
}

export function GalleryView({
  images,
  isLoading = false,
  onDelete,
  className,
}: GalleryViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSelect = (imageId: string, isOriginal = false) => {
    if (isOriginal) return;
    
    setSelectedIds((prev) => {
      if (prev.includes(imageId)) {
        return prev.filter((id) => id !== imageId);
      }
      if (prev.length >= 2) {
        return [prev[1], imageId];
      }
      return [...prev, imageId];
    });
  };

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    await onDelete(imageId);
    setDeletingId(null);
    setSelectedIds((prev) => prev.filter((id) => id !== imageId));
  };

  const selectedImages = images.filter((img) => selectedIds.includes(img.id));
  const canCompare = selectedIds.length >= 1;
  
  const uniqueOriginals = useMemo(() => {
    const originalsMap = new Map<string, string>();
    images.forEach((img) => {
      if (!originalsMap.has(img.originalUrl)) {
        originalsMap.set(img.originalUrl, img.originalUrl);
      }
    });
    return Array.from(originalsMap.values());
  }, [images]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
      >
        <PhotoIcon className="mb-4 h-16 w-16 text-[var(--color-text-muted)]" />
        <h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
          No saved designs yet
        </h3>
        <p className="max-w-sm text-sm text-[var(--color-text-muted)]">
          Generate a visualization and click &quot;Save & Share&quot; to add it to your
          gallery for comparison.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {selectedIds.length === 0
            ? "Select renders to compare with original"
            : selectedIds.length === 1
            ? "1 selected - compare with original"
            : "2 selected - compare renders"}
        </p>
        {canCompare && (
          <Button size="sm" onClick={() => setShowComparison(true)}>
            Compare
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {uniqueOriginals.map((originalUrl, index) => (
          <div key={`original-${index}`} className="relative">
            <div className="group relative flex flex-col rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] p-3 transition-all duration-200 shadow-soft border-2 border-[var(--color-border)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-md)]">
                <Image
                  src={originalUrl}
                  alt="Original sofa"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-2 left-2 rounded-[var(--radius-sm)] bg-black/60 px-2 py-1 text-xs text-white">
                  Original
                </div>
              </div>
              <div className="mt-3 text-center text-sm font-medium text-[var(--color-text-muted)]">
                Reference Image {uniqueOriginals.length > 1 ? `#${index + 1}` : ''}
              </div>
            </div>
          </div>
        ))}
        
        {images.map((image) => (
          <div key={image.id} className="relative">
            <GalleryImageCard
              image={image}
              isSelected={selectedIds.includes(image.id)}
              onSelect={() => handleSelect(image.id)}
              onDelete={
                deletingId === image.id
                  ? undefined
                  : () => handleDelete(image.id)
              }
            />
            {deletingId === image.id && (
              <div className="absolute inset-0 flex items-center justify-center rounded-[var(--radius-lg)] bg-white/80">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>

      {showComparison && selectedImages.length >= 1 && (
        <GalleryComparison
          images={selectedImages}
          originalUrl={selectedImages.length === 1 ? selectedImages[0].originalUrl : null}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}
