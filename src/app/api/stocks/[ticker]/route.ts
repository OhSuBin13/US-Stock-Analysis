import { NextResponse } from "next/server";
import { generateInformationAnalysis } from "@/lib/ai/generate-analysis";
import { getMarketDataProvider } from "@/lib/market-data";

type RouteContext = {
  params: Promise<{ ticker: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { ticker } = await context.params;
  const normalizedTicker = ticker.toUpperCase();
  const provider = getMarketDataProvider();

  const [profile, priceBars, financialSnapshot, peers] = await Promise.all([
    provider.getProfile(normalizedTicker),
    provider.getPriceBars(normalizedTicker, "1d"),
    provider.getFinancialSnapshot(normalizedTicker),
    provider.getPeerCandidates(normalizedTicker),
  ]);

  const analysis = await generateInformationAnalysis({
    ticker: normalizedTicker,
    profile,
    priceBars,
    financialSnapshot,
    peers,
  });

  return NextResponse.json({
    ticker: normalizedTicker,
    profile,
    priceBars,
    financialSnapshot,
    peers,
    analysis,
  });
}

