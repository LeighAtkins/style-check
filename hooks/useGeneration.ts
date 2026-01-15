"use client";

import { useState, useCallback } from "react";
import type { GenerationState } from "@/types/generation";
import type { Fabric } from "@/types/fabric";

export function useGeneration() {
  const [state, setState] = useState<GenerationState>({
    status: "idle",
  });

  const upload = useCallback(async (file: File): Promise<string | null> => {
    setState({ status: "uploading", progress: 0 });

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setState((prev) => ({
          ...prev,
          progress: Math.min((prev.progress || 0) + 10, 90),
        }));
      }, 200);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
      }

      const data = await response.json();
      setState({ status: "idle" });
      return data.imageUrl;
    } catch (error) {
      setState({
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
      return null;
    }
  }, []);

  const generate = useCallback(
    async (
      sofaImageUrl: string,
      fabric: Fabric
    ): Promise<string | null> => {
      setState({ status: "generating", message: "Creating your visualization..." });

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sofaImageUrl,
            fabricId: fabric.id,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          if (response.status === 429) {
            throw new Error("Daily limit reached. Please try again tomorrow.");
          }
          throw new Error(error.error || "Generation failed");
        }

        const data = await response.json();
        setState({
          status: "complete",
          resultUrl: data.resultImageUrl,
        });
        return data.resultImageUrl;
      } catch (error) {
        setState({
          status: "error",
          error: error instanceof Error ? error.message : "Generation failed",
        });
        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return {
    state,
    upload,
    generate,
    reset,
  };
}
