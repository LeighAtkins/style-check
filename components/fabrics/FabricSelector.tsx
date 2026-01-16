"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { Fabric, FabricCategory } from "@/types/fabric";
import { FABRIC_CATEGORIES } from "@/types/fabric";
import { FabricCard } from "./FabricCard";
import { Spinner } from "@/components/ui";
import { useGallery } from "@/hooks";

interface FabricSelectorProps {
  fabrics: Fabric[];
  selectedFabric: Fabric | null;
  onSelect: (fabric: Fabric) => void;
  isLoading?: boolean;
  uploadedImageUrl?: string | null;
  className?: string;
}

export function FabricSelector({
  fabrics,
  selectedFabric,
  onSelect,
  isLoading = false,
  uploadedImageUrl = null,
  className,
}: FabricSelectorProps) {
  const { images } = useGallery();
  const [activeCategory, setActiveCategory] = useState<FabricCategory | "all">(
    "all"
  );

  const availableCategories = useMemo(() => {
    const categories = new Set(fabrics.map((f) => f.category));
    return FABRIC_CATEGORIES.filter((c) => categories.has(c.value));
  }, [fabrics]);

  const usedFabricIds = useMemo(() => {
    if (!uploadedImageUrl) return new Set<string>();
    return new Set(
      images
        .filter((img) => img.originalUrl === uploadedImageUrl)
        .map((img) => img.fabricId)
    );
  }, [images, uploadedImageUrl]);

  const filteredFabrics = useMemo(() => {
    if (activeCategory === "all") return fabrics;
    return fabrics.filter((f) => f.category === activeCategory);
  }, [fabrics, activeCategory]);

  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center py-12", className)}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (fabrics.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <p className="text-[var(--color-text-muted)]">
          No fabrics available yet.
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Category Tabs */}
      {availableCategories.length > 1 && (
        <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium transition-all duration-200 whitespace-nowrap",
                activeCategory === "all"
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-[var(--color-accent-cream)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
              )}
            >
              All Fabrics
            </button>
            {availableCategories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={cn(
                  "px-4 py-2 rounded-[var(--radius-full)] text-sm font-medium transition-all duration-200 whitespace-nowrap",
                  activeCategory === category.value
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-accent-cream)] text-[var(--color-text-muted)] hover:bg-[var(--color-border)]"
                )}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fabric Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-4">
        {filteredFabrics.map((fabric) => (
          <FabricCard
            key={fabric.id}
            fabric={fabric}
            isSelected={selectedFabric?.id === fabric.id}
            isUsed={usedFabricIds.has(fabric.id)}
            onSelect={onSelect}
            size="md"
          />
        ))}
      </div>

      {filteredFabrics.length === 0 && (
        <p className="py-8 text-center text-[var(--color-text-muted)]">
          No fabrics in this category.
        </p>
      )}
    </div>
  );
}
