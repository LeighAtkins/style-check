"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { GalleryImage } from "@/types/gallery";
import { Button } from "@/components/ui";
import { GalleryImageCard } from "./GalleryImageCard";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface GalleryFullModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  onDelete: (imageId: string) => Promise<{ success: boolean; remainingCount?: number }>;
  onDeleteComplete: () => void;
}

export function GalleryFullModal({
  isOpen,
  onClose,
  images,
  onDelete,
  onDeleteComplete,
}: GalleryFullModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDelete = async (imageId: string) => {
    setDeletingId(imageId);
    await onDelete(imageId);
    setDeletingId(null);
    onDeleteComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={cn(
          "relative z-10 mx-4 w-full max-w-2xl rounded-[var(--radius-xl)] bg-[var(--color-bg)] p-6 shadow-warm"
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-accent-cream)] hover:text-[var(--color-text)]"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="mb-2 text-xl font-semibold text-[var(--color-text)]">
          Gallery Full
        </h2>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">
          You have reached the maximum of 5 saved images. Delete one to save
          this new design.
        </p>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <GalleryImageCard
                image={image}
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

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
