import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;

        // Protect admin routes (except login)
        if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
          return token?.role === "admin";
        }

        // Protect admin API routes for write operations
        if (pathname.startsWith("/api/fabrics")) {
          const method = req.method;
          if (method === "POST" || method === "PUT" || method === "DELETE") {
            return token?.role === "admin";
          }
        }

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/fabrics/:path*"],
};
