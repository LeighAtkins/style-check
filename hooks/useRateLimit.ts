"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch rate limit");
  return res.json();
};

interface RateLimitData {
  remaining: number;
  resetAt: string;
}

export function useRateLimit() {
  const { data, error, isLoading, mutate } = useSWR<RateLimitData>(
    "/api/rate-limit",
    fetcher,
    {
      refreshInterval: 60000, // Refresh every minute
      revalidateOnFocus: true,
    }
  );

  return {
    remaining: data?.remaining ?? 5,
    resetAt: data?.resetAt,
    isLoading,
    isError: !!error,
    refresh: mutate,
  };
}
