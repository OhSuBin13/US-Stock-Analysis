import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Search, Star } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "US Stock Analysis",
  description: "Informational US stock analysis dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-border bg-surface">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link href="/" className="flex items-center gap-2 text-sm font-semibold">
                <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <BarChart3 className="h-4 w-4" aria-hidden="true" />
                </span>
                US Stock Analysis
              </Link>
              <nav className="flex items-center gap-1 text-sm text-muted-foreground">
                <Link
                  href="/"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted hover:text-foreground"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </Link>
                <Link
                  href="/watchlist"
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-muted hover:text-foreground"
                >
                  <Star className="h-4 w-4" aria-hidden="true" />
                  Watchlist
                </Link>
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  );
}

