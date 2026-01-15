import { NextRequest, NextResponse } from "next/server";
import { uploadSofaImage } from "@/lib/storage/cloudinary";
import { generateUserId } from "@/lib/db/rateLimit";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    // Get or generate user ID
    let userId = request.cookies.get("user_id")?.value;
    if (!userId) {
      userId = generateUserId();
    }

    // Upload to Cloudinary
    const imageUrl = await uploadSofaImage(file, userId);

    // Create response with cookie
    const response = NextResponse.json({ success: true, imageUrl });

    // Set user ID cookie if new
    if (!request.cookies.get("user_id")) {
      response.cookies.set("user_id", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
