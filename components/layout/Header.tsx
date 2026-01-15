"use client";

import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-[var(--color-bg)]/80 backdrop-blur-md border-b border-[var(--color-border-light)]",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-primary)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-white"
              >
                <path d="M19.006 3.705a.75.75 0 00-.512-1.41L6 6.838V3a.75.75 0 00-.75-.75h-1.5A.75.75 0 003 3v4.93l-1.006.365a.75.75 0 00.512 1.41l16.5-6z" />
                <path
                  fillRule="evenodd"
                  d="M3.019 11.115L18 5.667V9.09l4.006 1.456a.75.75 0 11-.512 1.41l-.494-.18v8.475h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3v-9.129l.019-.006zM18 20.25v-9.565l1.5.545v9.02H18zm-9-6a.75.75 0 00-.75.75v4.5c0 .414.336.75.75.75h3a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold text-[var(--color-text)]">
              StyleCheck
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/gallery"
              className="px-3 py-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors rounded-[var(--radius-md)] hover:bg-[var(--color-accent-cream)]"
            >
              My Gallery
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
