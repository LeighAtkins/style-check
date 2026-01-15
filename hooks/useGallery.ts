"use client";

import useSWR from "swr";
import type { GalleryImage, GalleryResponse, SaveImageRequest } from "@/types/gallery";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch gallery");
  return res.json();
};

export function useGallery() {
  const { data, error, isLoading, mutate } = useSWR<GalleryResponse>(
    "/api/gallery",
    fetcher,
    {
      revalidateOnFocus: true,
    }
  );

  const saveImage = async (
    imageData: SaveImageRequest
  ): Promise<{ success: boolean; image?: GalleryImage; error?: string }> => {
    const response = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(imageData),
    });
    const result = await response.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  const deleteImage = async (
    imageId: string
  ): Promise<{ success: boolean; remainingCount?: number }> => {
    const response = await fetch("/api/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    const result = await response.json();
    if (result.success) {
      mutate();
    }
    return result;
  };

  return {
    images: data?.images ?? [],
    count: data?.count ?? 0,
    maxAllowed: data?.maxAllowed ?? 5,
    isFull: (data?.count ?? 0) >= (data?.maxAllowed ?? 5),
    isLoading,
    isError: !!error,
    saveImage,
    deleteImage,
    refresh: mutate,
  };
}
