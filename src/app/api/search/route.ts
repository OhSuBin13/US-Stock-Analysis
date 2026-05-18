import { NextResponse } from "next/server";
import { cacheGetJson, cacheSetJson } from "@/lib/cache";
import { getMarketDataProvider } from "@/lib/market-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (!query) {
    return NextResponse.json({ results: [] });
  }

  const cacheKey = `stock-search:${query.toUpperCase()}`;
  const cached = await cacheGetJson(cacheKey);

  if (cached) {
    return NextResponse.json(cached);
  }

  const provider = getMarketDataProvider();
  const results = await provider.searchStocks(query);
  const payload = { results };

  await cacheSetJson(cacheKey, payload, 300);

  return NextResponse.json(payload);
}

