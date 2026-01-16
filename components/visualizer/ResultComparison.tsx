"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { ArrowDownTrayIcon, ArrowPathIcon, CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";
import { GalleryFullModal } from "@/components/gallery";
import { useGallery } from "@/hooks";

interface ResultComparisonProps {
  originalUrl: string;
  generatedUrl: string;
  fabricName: string;
  fabricId: string;
  fabricThumbnailUrl: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  className?: string;
}

export function ResultComparison({
  originalUrl,
  generatedUrl,
  fabricName,
  fabricId,
  fabricThumbnailUrl,
  onRegenerate,
  isRegenerating = false,
  className,
}: ResultComparisonProps) {
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side" | "result">(
    "slider"
  );
  const [canShare, setCanShare] = useState(false);
  const [showGalleryFull, setShowGalleryFull] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const saveAttemptedRef = useRef(false);

  const { images, isFull, saveImage, deleteImage, refresh } = useGallery();

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  useEffect(() => {
    const autoSave = async () => {
      if (saveAttemptedRef.current || isFull || isSaved) return;
      
      saveAttemptedRef.current = true;

      try {
        const result = await saveImage({
          imageUrl: generatedUrl,
          originalUrl,
          fabricId,
          fabricName,
          fabricThumbnailUrl,
        });

        if (result.success) {
          setIsSaved(true);
        } else if (result.error === "gallery_full") {
          await refresh();
        }
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    };

    autoSave();
  }, [generatedUrl, originalUrl, fabricId, fabricName, fabricThumbnailUrl, isFull, isSaved]);

  const handleDownload = async () => {
    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sofa-${fabricName.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const shareWithImage = async () => {
    try {
      const response = await fetch(generatedUrl);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `sofa-${fabricName.toLowerCase().replace(/\s+/g, "-")}.png`,
        { type: "image/png" }
      );

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `My Sofa in ${fabricName}`,
          text: `Check out how my sofa looks with ${fabricName} fabric!`,
          files: [file],
        });
      } else {
        await navigator.share({
          title: `My Sofa in ${fabricName}`,
          text: `Check out how my sofa looks with ${fabricName} fabric!`,
          url: window.location.href,
        });
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  };

  const handleShare = async () => {
    if (canShare) {
      await shareWithImage();
    }
  };

  const handleDeleteFromModal = async (imageId: string) => {
    return await deleteImage(imageId);
  };

  const handleDeleteComplete = () => {
    setShowGalleryFull(false);
    setIsSaved(false);
    saveAttemptedRef.current = false;
  };

  return (
    <div className={className}>
      {/* View Mode Toggle */}
      <div className="mb-4 flex justify-center gap-2">
        {(["slider", "side-by-side", "result"] as const).map((mode) => (
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
            {mode === "slider"
              ? "Slider"
              : mode === "side-by-side"
              ? "Side by Side"
              : "Result Only"}
          </button>
        ))}
      </div>

      {/* Comparison Views */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] bg-[var(--color-bg-card)] shadow-medium">
        {viewMode === "slider" && (
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={originalUrl}
                alt="Original sofa"
                style={{ objectFit: "contain" }}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={generatedUrl}
                alt={`Sofa with ${fabricName}`}
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
                src={originalUrl}
                alt="Original sofa"
                fill
                className="object-contain"
              />
              <span className="absolute bottom-2 left-2 rounded-[var(--radius-sm)] bg-black/60 px-2 py-1 text-xs text-white">
                Original
              </span>
            </div>
            <div className="relative aspect-[4/3]">
              <Image
                src={generatedUrl}
                alt={`Sofa with ${fabricName}`}
                fill
                className="object-contain"
              />
              <span className="absolute bottom-2 left-2 rounded-[var(--radius-sm)] bg-[var(--color-primary)] px-2 py-1 text-xs text-white">
                {fabricName}
              </span>
            </div>
          </div>
        )}

        {viewMode === "result" && (
          <div className="relative aspect-[4/3]">
            <Image
              src={generatedUrl}
              alt={`Sofa with ${fabricName}`}
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={handleDownload} variant="primary">
          <ArrowDownTrayIcon className="mr-2 h-5 w-5" />
          Download
        </Button>

        {onRegenerate && (
          <Button
            onClick={onRegenerate}
            variant="outline"
            isLoading={isRegenerating}
          >
            <ArrowPathIcon className="mr-2 h-5 w-5" />
            Regenerate
          </Button>
        )}

        {isSaved ? (
          <Button variant="secondary" disabled>
            <CheckCircleIcon className="mr-2 h-5 w-5" />
            Saved to Gallery
          </Button>
        ) : canShare ? (
          <Button onClick={handleShare} variant="secondary">
            Share
          </Button>
        ) : null}
      </div>

      {isSaved && (
        <p className="mt-3 text-center text-sm text-green-600">
          Automatically saved to your gallery
        </p>
      )}

      {saveError && (
        <p className="mt-3 text-center text-sm text-[var(--color-error)]">
          {saveError}
        </p>
      )}

      <div className="mt-6 rounded-[var(--radius-lg)] bg-[var(--color-accent-cream)]/50 border border-[var(--color-border)] p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 flex-shrink-0 text-[var(--color-primary)] mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-[var(--color-text)] mb-1">
              AI Visualization Notice
            </p>
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              This AI-generated visualization is an approximation for design purposes only. 
              Actual fabric colors, textures, and appearance may differ from this preview. 
              Please request physical samples before making final purchasing decisions.
            </p>
          </div>
        </div>
      </div>

      <GalleryFullModal
        isOpen={showGalleryFull}
        onClose={() => setShowGalleryFull(false)}
        images={images}
        onDelete={handleDeleteFromModal}
        onDeleteComplete={handleDeleteComplete}
      />
    </div>
  );
}
