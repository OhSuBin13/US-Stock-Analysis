"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { StockSearchResult } from "@/lib/market-data/types";

export function StockSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const canSearch = useMemo(() => query.trim().length >= 1, [query]);

  async function searchStocks() {
    if (!canSearch) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
      const payload = (await response.json()) as { results: StockSearchResult[] };
      setResults(payload.results);
    } finally {
      setIsLoading(false);
    }
  }

  function openTicker(ticker: string) {
    router.push(`/stocks/${ticker.toUpperCase()}`);
  }

  return (
    <div className="w-full max-w-2xl rounded-lg border border-border bg-surface p-3 shadow-panel">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          aria-label="Ticker or company name"
          placeholder="Search ticker or company name"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void searchStocks();
            }
          }}
        />
        <Button type="button" onClick={() => void searchStocks()} disabled={!canSearch || isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Search className="h-4 w-4" aria-hidden="true" />}
          Search
        </Button>
      </div>

      {results.length > 0 ? (
        <div className="mt-3 divide-y divide-border rounded-md border border-border">
          {results.map((result) => (
            <button
              key={`${result.ticker}-${result.exchange ?? "unknown"}`}
              type="button"
              className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left text-sm hover:bg-muted"
              onClick={() => openTicker(result.ticker)}
            >
              <span>
                <span className="font-medium">{result.ticker}</span>
                <span className="ml-2 text-muted-foreground">{result.companyName}</span>
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">{result.exchange ?? "US"}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

