"use client";

import { useState, useCallback } from "react";
import { Header, Footer, RateLimitBanner } from "@/components/layout";
import { Button, Card, StepIndicator } from "@/components/ui";
import { ImageUploader } from "@/components/upload";
import { FabricSelector } from "@/components/fabrics";
import { ResultComparison, GenerationStatus } from "@/components/visualizer";
import { useFabrics, useRateLimit, useGeneration } from "@/hooks";
import type { Fabric } from "@/types/fabric";
import { ArrowLeftIcon, ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";

const STEPS = [
  { id: 1, name: "Upload" },
  { id: 2, name: "Select Fabric" },
  { id: 3, name: "Result" },
];

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [resultImageUrl, setResultImageUrl] = useState<string | null>(null);

  const { fabrics, isLoading: fabricsLoading } = useFabrics();
  const { remaining, resetAt, refresh: refreshRateLimit } = useRateLimit();
  const { state: genState, upload, generate, reset: resetGeneration } = useGeneration();

  const handleImageSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  const handleImageClear = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedImageUrl(null);
  }, [previewUrl]);

  const handleFabricSelect = useCallback((fabric: Fabric) => {
    setSelectedFabric(fabric);
  }, []);

  const handleContinueToFabrics = useCallback(async () => {
    if (!selectedFile) return;

    const url = await upload(selectedFile);
    if (url) {
      setUploadedImageUrl(url);
      setCurrentStep(2);
    }
  }, [selectedFile, upload]);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImageUrl || !selectedFabric) return;

    const resultUrl = await generate(uploadedImageUrl, selectedFabric);
    if (resultUrl) {
      setResultImageUrl(resultUrl);
      setCurrentStep(3);
      refreshRateLimit();
    }
  }, [uploadedImageUrl, selectedFabric, generate, refreshRateLimit]);

  const handleRegenerate = useCallback(async () => {
    if (!uploadedImageUrl || !selectedFabric) return;

    resetGeneration();
    const resultUrl = await generate(uploadedImageUrl, selectedFabric);
    if (resultUrl) {
      setResultImageUrl(resultUrl);
      refreshRateLimit();
    }
  }, [uploadedImageUrl, selectedFabric, generate, resetGeneration, refreshRateLimit]);

  const handleStartOver = useCallback(() => {
    handleImageClear();
    setSelectedFabric(null);
    setResultImageUrl(null);
    setCurrentStep(1);
    resetGeneration();
  }, [handleImageClear, resetGeneration]);

  const handleBack = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setResultImageUrl(null);
      resetGeneration();
      setCurrentStep(2);
    }
  }, [currentStep, resetGeneration]);

  const isGenerating = genState.status === "generating";
  const isUploading = genState.status === "uploading";
  const canGenerate = remaining > 0 && selectedFabric && uploadedImageUrl;

  return (
    <div className="flex min-h-screen flex-col bg-gradient-warm">
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
          {/* Hero Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
              Visualize Your Perfect Sofa
            </h1>
            <p className="text-[var(--color-text-muted)]">
              Upload a photo of your sofa and see how different fabrics would look
            </p>
          </div>

          {/* Rate Limit Banner */}
          <RateLimitBanner remaining={remaining} resetAt={resetAt} className="mb-6" />

          {/* Step Indicator */}
          <StepIndicator steps={STEPS} currentStep={currentStep} className="mb-8" />

          {/* Main Card */}
          <Card variant="elevated" className="relative">
            {/* Loading/Generation Overlay */}
            {(isGenerating || isUploading) && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-[var(--radius-xl)] bg-white/90 backdrop-blur-sm">
                <GenerationStatus status={genState.status} message={genState.message} />
              </div>
            )}

            {/* Step 1: Upload */}
            {currentStep === 1 && (
              <div>
                <h2 className="mb-2 text-xl font-semibold text-[var(--color-text)]">
                  Upload Your Sofa Photo
                </h2>
                <p className="mb-6 text-sm text-[var(--color-text-muted)]">
                  Take a clear photo of your sofa in good lighting
                </p>

                <ImageUploader
                  onImageSelect={handleImageSelect}
                  onImageClear={handleImageClear}
                  previewUrl={previewUrl}
                  isUploading={isUploading}
                  uploadProgress={genState.progress}
                  error={genState.status === "error" ? genState.error : undefined}
                />

                {selectedFile && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleContinueToFabrics}
                      isLoading={isUploading}
                      disabled={!selectedFile || isUploading}
                    >
                      Continue
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Fabric */}
            {currentStep === 2 && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--color-text)]">
                      Choose Your Fabric
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Select a fabric to visualize on your sofa
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back
                  </button>
                </div>

                <FabricSelector
                  fabrics={fabrics}
                  selectedFabric={selectedFabric}
                  onSelect={handleFabricSelect}
                  isLoading={fabricsLoading}
                />

                {selectedFabric && (
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border-light)] pt-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-[var(--radius-md)] border border-[var(--color-border)]"
                        style={{
                          backgroundImage: `url(${selectedFabric.thumbnailUrl})`,
                          backgroundSize: "cover",
                        }}
                      />
                      <div>
                        <p className="font-medium text-[var(--color-text)]">
                          {selectedFabric.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] capitalize">
                          {selectedFabric.category}
                        </p>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerate}
                      disabled={!canGenerate || isGenerating}
                      isLoading={isGenerating}
                    >
                      <SparklesIcon className="mr-2 h-5 w-5" />
                      Generate
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Result */}
            {currentStep === 3 && resultImageUrl && uploadedImageUrl && selectedFabric && (
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[var(--color-text)]">
                      Your Visualization
                    </h2>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Here&apos;s how your sofa looks with {selectedFabric.name}
                    </p>
                  </div>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-1 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Try another
                  </button>
                </div>

                <ResultComparison
                  originalUrl={uploadedImageUrl}
                  generatedUrl={resultImageUrl}
                  fabricName={selectedFabric.name}
                  fabricId={selectedFabric.id}
                  fabricThumbnailUrl={selectedFabric.thumbnailUrl}
                  onRegenerate={remaining > 0 ? handleRegenerate : undefined}
                  isRegenerating={isGenerating}
                />

                <div className="mt-8 text-center">
                  <Button onClick={handleStartOver} variant="outline">
                    Start Over with New Photo
                  </Button>
                </div>
              </div>
            )}

            {/* Error State */}
            {genState.status === "error" && currentStep !== 1 && (
              <div className="mt-4 rounded-[var(--radius-md)] bg-[var(--color-error)]/10 p-4 text-center">
                <p className="text-[var(--color-error)]">{genState.error}</p>
                <Button
                  onClick={resetGeneration}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
