import { NextRequest, NextResponse } from "next/server";
import { generateVisualization } from "@/lib/ai/gemini";
import { uploadGeneratedImage } from "@/lib/storage/cloudinary";
import { getFabric } from "@/lib/db/fabrics";
import {
  checkRateLimit,
  incrementRateLimit,
  generateUserId,
} from "@/lib/db/rateLimit";

export async function POST(request: NextRequest) {
  try {
    // Get or generate user ID
    let userId = request.cookies.get("user_id")?.value;
    if (!userId) {
      userId = generateUserId();
    }

    // Check rate limit
    const rateLimitResult = await checkRateLimit(userId);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: "Daily limit reached",
          resetAt: rateLimitResult.resetAt,
          remainingGenerations: 0,
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { sofaImageUrl, fabricId } = body;

    if (!sofaImageUrl || !fabricId) {
      return NextResponse.json(
        { error: "Missing required fields: sofaImageUrl and fabricId" },
        { status: 400 }
      );
    }

    // Get fabric details
    const fabric = await getFabric(fabricId);
    if (!fabric) {
      return NextResponse.json({ error: "Fabric not found" }, { status: 404 });
    }

    // Generate visualization
    const result = await generateVisualization(sofaImageUrl, fabric);

    if (!result.success || !result.imageData) {
      return NextResponse.json(
        { error: result.error || "Failed to generate image" },
        { status: 500 }
      );
    }

    // Upload generated image to Cloudinary
    const generatedImageUrl = await uploadGeneratedImage(result.imageData, userId);

    // Increment rate limit
    await incrementRateLimit(userId);

    // Create response
    const response = NextResponse.json({
      success: true,
      resultImageUrl: generatedImageUrl,
      remainingGenerations: rateLimitResult.remaining - 1,
    });

    // Set user ID cookie if new
    if (!request.cookies.get("user_id")) {
      response.cookies.set("user_id", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });
    }

    return response;
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate visualization" },
      { status: 500 }
    );
  }
}
