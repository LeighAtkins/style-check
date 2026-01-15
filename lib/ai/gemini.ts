import { GoogleGenAI } from "@google/genai";
import { imageSize } from "image-size";

import type { Fabric } from "@/types/fabric";
import { buildFabricReplacementPrompt } from "./prompts";

const ASPECT_RATIOS = [
  { label: "1:1", width: 1, height: 1 },
  { label: "2:3", width: 2, height: 3 },
  { label: "3:2", width: 3, height: 2 },
  { label: "3:4", width: 3, height: 4 },
  { label: "4:3", width: 4, height: 3 },
  { label: "4:5", width: 4, height: 5 },
  { label: "5:4", width: 5, height: 4 },
  { label: "9:16", width: 9, height: 16 },
  { label: "16:9", width: 16, height: 9 },
  { label: "21:9", width: 21, height: 9 },
];

const DEFAULT_ASPECT_RATIO = "1:1";
const IMAGE_SIZE = "2K";

export interface GenerateVisualizationResult {
  success: boolean;
  imageData?: Buffer;
  error?: string;
}

const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

interface ImageData {
  base64: string;
  buffer: Buffer;
}

function getClosestAspectRatio(width: number, height: number): string {
  if (width <= 0 || height <= 0) {
    return DEFAULT_ASPECT_RATIO;
  }

  const target = width / height;
  let best = ASPECT_RATIOS[0];
  let bestDiff = Math.abs(target - best.width / best.height);

  for (const option of ASPECT_RATIOS.slice(1)) {
    const diff = Math.abs(target - option.width / option.height);
    if (diff < bestDiff) {
      best = option;
      bestDiff = diff;
    }
  }

  return best.label;
}

function getAspectRatioFromBuffer(buffer: Buffer): string {
  const dimensions = imageSize(buffer);
  if (!dimensions.width || !dimensions.height) {
    return DEFAULT_ASPECT_RATIO;
  }

  return getClosestAspectRatio(dimensions.width, dimensions.height);
}

async function fetchImageData(url: string): Promise<ImageData> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return { base64: buffer.toString("base64"), buffer };
}

export async function generateVisualization(
  sofaImageUrl: string,
  fabric: Fabric
): Promise<GenerateVisualizationResult> {
  try {
    // Fetch both images as base64
    const [sofaImageData, fabricImageData] = await Promise.all([
      fetchImageData(sofaImageUrl),
      fetchImageData(fabric.imageUrl),
    ]);
    const aspectRatio = getAspectRatioFromBuffer(sofaImageData.buffer);

    // Build the prompt
    const prompt = buildFabricReplacementPrompt(fabric);

    // Call Gemini with native SDK
    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: sofaImageData.base64,
              },
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: fabricImageData.base64,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["image", "text"],
        imageConfig: {
          aspectRatio,
          imageSize: IMAGE_SIZE,
        },
      },
    });

    // Extract the generated image from the response
    const parts = response.candidates?.[0]?.content?.parts;

    if (!parts || parts.length === 0) {
      return {
        success: false,
        error: "No response from AI model",
      };
    }

    // Find the image part
    const imagePart = parts.find(
      (part) => part.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart?.inlineData?.data) {
      // Return text response as error for debugging
      const textPart = parts.find((part) => part.text);
      return {
        success: false,
        error: textPart?.text || "No image was generated. Please try again.",
      };
    }

    const imageData = Buffer.from(imagePart.inlineData.data, "base64");

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
