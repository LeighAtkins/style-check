import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import type { Fabric } from "@/types/fabric";
import { buildFabricReplacementPrompt } from "./prompts";

export interface GenerateVisualizationResult {
  success: boolean;
  imageData?: Buffer;
  error?: string;
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString("base64");
}

export async function generateVisualization(
  sofaImageUrl: string,
  fabric: Fabric
): Promise<GenerateVisualizationResult> {
  try {
    // Fetch both images as base64
    const [sofaImageBase64, fabricImageBase64] = await Promise.all([
      fetchImageAsBase64(sofaImageUrl),
      fetchImageAsBase64(fabric.imageUrl),
    ]);

    // Build the prompt
    const prompt = buildFabricReplacementPrompt(fabric);

    // Call Gemini - use data URLs for images
    const sofaDataUrl = `data:image/jpeg;base64,${sofaImageBase64}`;
    const fabricDataUrl = `data:image/jpeg;base64,${fabricImageBase64}`;

    const result = await generateText({
      model: google("gemini-2.5-flash-preview-05-20"),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image", image: sofaDataUrl },
            { type: "image", image: fabricDataUrl },
          ],
        },
      ],
    });

    // Extract the generated image from the response
    // The AI SDK may return files in different formats depending on the provider
    const files = result.files as Array<{ mimeType?: string; base64?: string; data?: string }> | undefined;
    const generatedFile = files?.find((f) =>
      f.mimeType?.startsWith("image/")
    );

    if (!generatedFile) {
      // If no image file, check if text response contains useful info
      return {
        success: false,
        error: result.text || "No image was generated. Please try again.",
      };
    }

    const base64Data = generatedFile.base64 || generatedFile.data;
    if (!base64Data) {
      return {
        success: false,
        error: "No image data in response. Please try again.",
      };
    }

    const imageData = Buffer.from(base64Data, "base64");

    return {
      success: true,
      imageData,
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate image",
    };
  }
}
