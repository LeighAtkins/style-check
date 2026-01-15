"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { ReactCompareSlider, ReactCompareSliderImage } from "react-compare-slider";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui";

interface ResultComparisonProps {
  originalUrl: string;
  generatedUrl: string;
  fabricName: string;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
  className?: string;
}

export function ResultComparison({
  originalUrl,
  generatedUrl,
  fabricName,
  onRegenerate,
  isRegenerating = false,
  className,
}: ResultComparisonProps) {
  const [viewMode, setViewMode] = useState<"slider" | "side-by-side" | "result">(
    "slider"
  );
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `My Sofa in ${fabricName}`,
          text: `Check out how my sofa looks with ${fabricName} fabric!`,
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled or share failed
      }
    }
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

        {canShare && (
          <Button onClick={handleShare} variant="secondary">
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
