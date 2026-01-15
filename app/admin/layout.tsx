"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils/cn";
import {
  HomeIcon,
  SwatchIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/fabrics", label: "Fabrics", icon: SwatchIcon },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [status, pathname, router]);

  // Show login page without layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border-r border-[var(--color-border-light)] bg-[var(--color-bg-card)]">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-[var(--color-border-light)] px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4 text-white"
              >
                <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                <path
                  fillRule="evenodd"
                  d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="font-semibold text-[var(--color-text)]">
              Admin Panel
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--color-text-muted)] hover:bg-[var(--color-accent-cream)] hover:text-[var(--color-text)]"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-[var(--color-border-light)] p-4">
            <div className="mb-3 text-sm">
              <p className="font-medium text-[var(--color-text)]">
                {session.user?.name}
              </p>
              <p className="text-[var(--color-text-muted)]">
                {session.user?.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-accent-cream)] hover:text-[var(--color-text)]"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
