"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import type { GalleryImage } from "@/types/gallery";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { Button } from "@/components/ui";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface GalleryComparisonProps {
  images: GalleryImage[];
  onClose: () => void;
}

export function GalleryComparison({ images, onClose }: GalleryComparisonProps) {
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side">("slider");

  if (images.length < 2) return null;

  const [imageA, imageB] = images;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 mx-4 w-full max-w-4xl rounded-[var(--radius-xl)] bg-[var(--color-bg)] p-6 shadow-warm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--color-text)]">
            Compare Designs
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:bg-[var(--color-accent-cream)] hover:text-[var(--color-text)]"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 flex justify-center gap-2">
          {(["slider", "side-by-side"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-[var(--radius-md)] transition-all",
                viewMode === mode
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-accent-cream)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
              )}
            >
              {mode === "slider" ? "Slider" : "Side by Side"}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-bg-card)]">
          {viewMode === "slider" && (
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={imageA.imageUrl}
                  alt={`Sofa with ${imageA.fabricName}`}
                  style={{ objectFit: "contain" }}
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={imageB.imageUrl}
                  alt={`Sofa with ${imageB.fabricName}`}
                  style={{ objectFit: "contain" }}
                />
              }
              className="aspect-[4/3]"
              style={{ height: "auto" }}
            />
          )}

          {viewMode === "side-by-side" && (
            <div className="grid grid-cols-2 gap-1">
              <div className="relative aspect-[4/3]">
                <Image
                  src={imageA.imageUrl}
                  alt={`Sofa with ${imageA.fabricName}`}
                  fill
                  className="object-contain"
                />
                <span className="absolute bottom-2 left-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2 py-1 text-xs text-white">
                  {imageA.fabricName}
                </span>
              </div>
              <div className="relative aspect-[4/3]">
                <Image
                  src={imageB.imageUrl}
                  alt={`Sofa with ${imageB.fabricName}`}
                  fill
                  className="object-contain"
                />
                <span className="absolute bottom-2 left-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2 py-1 text-xs text-white">
                  {imageB.fabricName}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <div className="flex items-center gap-2">
            <div
              className="h-5 w-5 rounded-[var(--radius-sm)] border border-[var(--color-border)]"
              style={{
                backgroundImage: `url(${imageA.fabricThumbnailUrl})`,
                backgroundSize: "cover",
              }}
            />
            <span>{imageA.fabricName}</span>
          </div>
          <span>vs</span>
          <div className="flex items-center gap-2">
            <span>{imageB.fabricName}</span>
            <div
              className="h-5 w-5 rounded-[var(--radius-sm)] border border-[var(--color-border)]"
              style={{
                backgroundImage: `url(${imageB.fabricThumbnailUrl})`,
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
