import { NextRequest, NextResponse } from "next/server";
import { getRemainingGenerations, generateUserId } from "@/lib/db/rateLimit";

export async function GET(request: NextRequest) {
  try {
    let userId = request.cookies.get("user_id")?.value;

    if (!userId) {
      // New user - they have full quota
      userId = generateUserId();

      const response = NextResponse.json({
        remaining: 5,
        resetAt: getNextMidnightUTC(),
      });

      response.cookies.set("user_id", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
      });

      return response;
    }

    const { remaining, resetAt } = await getRemainingGenerations(userId);

    return NextResponse.json({ remaining, resetAt });
  } catch (error) {
    console.error("Rate limit check error:", error);
    return NextResponse.json(
      { error: "Failed to check rate limit" },
      { status: 500 }
    );
  }
}

function getNextMidnightUTC(): string {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}
