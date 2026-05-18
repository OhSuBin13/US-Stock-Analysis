import type { Metadata } from "next";
import { AnalysisSection } from "@/components/stocks/analysis-section";
import { PriceChart } from "@/components/stocks/price-chart";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateInformationAnalysis } from "@/lib/ai/generate-analysis";
import { getMarketDataProvider } from "@/lib/market-data";

type StockPageProps = {
  params: Promise<{ ticker: string }>;
};

export async function generateMetadata({ params }: StockPageProps): Promise<Metadata> {
  const { ticker } = await params;

  return {
    title: `${ticker.toUpperCase()} | US Stock Analysis`,
  };
}

export default async function StockPage({ params }: StockPageProps) {
  const { ticker } = await params;
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

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-semibold">{normalizedTicker}</h1>
            {profile?.exchange ? <Badge>{profile.exchange}</Badge> : null}
          </div>
          <p className="mt-2 text-muted-foreground">{profile?.companyName ?? "Company profile unavailable"}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Data as of {analysis.dataAsOf ? analysis.dataAsOf.toISOString().slice(0, 10) : "unavailable"}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <Card className="border-border bg-surface shadow-panel">
          <CardHeader>
            <CardTitle>Price history</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceChart bars={priceBars} />
          </CardContent>
        </Card>

        <Card className="border-border bg-surface shadow-panel">
          <CardHeader>
            <CardTitle>Information summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-6 text-muted-foreground">{analysis.summary}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <AnalysisSection title="Business overview" body={analysis.businessOverview} />
        <AnalysisSection title="Business model" body={analysis.businessModel} />
        <AnalysisSection title="Financial analysis" body={analysis.financialAnalysis} />
        <AnalysisSection title="Growth drivers" body={analysis.growthDrivers} />
        <AnalysisSection title="Partners" body={analysis.partners} />
        <AnalysisSection title="Strengths" body={analysis.strengths} />
        <AnalysisSection title="Risks" body={analysis.risks} tone="risk" />
        <AnalysisSection title="Watch metrics" body={analysis.watchMetrics.join(", ")} />
      </section>
    </div>
  );
}

