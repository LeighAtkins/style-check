import { NextRequest, NextResponse } from "next/server";
import {
  getGallery,
  addToGallery,
  removeFromGallery,
  MAX_GALLERY_SIZE,
} from "@/lib/db/gallery";
import { generateUserId } from "@/lib/db/rateLimit";
import type { SaveImageRequest } from "@/types/gallery";

function getUserIdFromRequest(request: NextRequest): {
  userId: string;
  isNew: boolean;
} {
  const userId = request.cookies.get("user_id")?.value;
  if (userId) {
    return { userId, isNew: false };
  }
  return { userId: generateUserId(), isNew: true };
}

function setCookieOnResponse(response: NextResponse, userId: string): void {
  response.cookies.set("user_id", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { userId, isNew } = getUserIdFromRequest(request);

    if (isNew) {
      const response = NextResponse.json({
        images: [],
        count: 0,
        maxAllowed: MAX_GALLERY_SIZE,
      });
      setCookieOnResponse(response, userId);
      return response;
    }

    const gallery = await getGallery(userId);

    return NextResponse.json({
      images: gallery.images,
      count: gallery.images.length,
      maxAllowed: MAX_GALLERY_SIZE,
    });
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, isNew } = getUserIdFromRequest(request);
    const body: SaveImageRequest = await request.json();

    if (
      !body.imageUrl ||
      !body.originalUrl ||
      !body.fabricId ||
      !body.fabricName ||
      !body.fabricThumbnailUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await addToGallery(userId, body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      image: result.image,
    });

    if (isNew) {
      setCookieOnResponse(response, userId);
    }

    return response;
  } catch (error) {
    console.error("Gallery save error:", error);
    return NextResponse.json(
      { error: "Failed to save to gallery" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId, isNew } = getUserIdFromRequest(request);

    if (isNew) {
      return NextResponse.json(
        { error: "No gallery found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { imageId } = body;

    if (!imageId) {
      return NextResponse.json(
        { error: "Missing imageId" },
        { status: 400 }
      );
    }

    const result = await removeFromGallery(userId, imageId);

    return NextResponse.json({
      success: true,
      remainingCount: result.remainingCount,
    });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete from gallery" },
      { status: 500 }
    );
  }
}
