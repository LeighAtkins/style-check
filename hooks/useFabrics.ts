"use client";

import useSWR from "swr";
import type { Fabric, FabricCategory } from "@/types/fabric";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch fabrics");
  return res.json();
};

interface UseFabricsOptions {
  category?: FabricCategory;
}

export function useFabrics(options: UseFabricsOptions = {}) {
  const { category } = options;
  const url = category ? `/api/fabrics?category=${category}` : "/api/fabrics";

  const { data, error, isLoading, mutate } = useSWR<{ fabrics: Fabric[] }>(
    url,
    fetcher
  );

  return {
    fabrics: data?.fabrics ?? [],
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}
