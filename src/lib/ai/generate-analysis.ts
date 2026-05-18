import { assertNoAdviceLanguage, missingDataMessage } from "@/lib/ai/analysis-policy";
import type { FinancialSnapshot, PeerCandidate, PriceBar, StockProfile } from "@/lib/market-data/types";

export type GenerateAnalysisInput = {
  ticker: string;
  profile: StockProfile | null;
  priceBars: PriceBar[];
  financialSnapshot: FinancialSnapshot | null;
  peers: PeerCandidate[];
};

export type CompanyAnalysisDraft = {
  ticker: string;
  dataAsOf: Date | null;
  summary: string;
  thesis: string;
  businessOverview: string;
  businessModel: string;
  financialAnalysis: string;
  growthDrivers: string;
  partners: string;
  strengths: string;
  risks: string;
  peers: PeerCandidate[];
  watchMetrics: string[];
  missingData: string[];
  sourceEvidence: Array<{ label: string; value: string }>;
};

export async function generateInformationAnalysis(input: GenerateAnalysisInput): Promise<CompanyAnalysisDraft> {
  const missingData: string[] = [];
  const sourceEvidence: Array<{ label: string; value: string }> = [];

  if (!input.profile) {
    missingData.push("company profile");
  } else {
    sourceEvidence.push({ label: "profile", value: input.profile.companyName });
  }

  if (!input.financialSnapshot) {
    missingData.push("financial snapshot");
  } else {
    sourceEvidence.push({
      label: "financial period",
      value: input.financialSnapshot.fiscalDate ?? input.financialSnapshot.period,
    });
  }

  if (input.priceBars.length === 0) {
    missingData.push("price bars");
  } else {
    sourceEvidence.push({
      label: "latest price bar",
      value: input.priceBars[input.priceBars.length - 1].timestamp,
    });
  }

  const companyName = input.profile?.companyName ?? input.ticker;
  const latestClose = input.priceBars.at(-1)?.close;
  const revenue = input.financialSnapshot?.revenue;
  const operatingMargin = input.financialSnapshot?.operatingMargin;
  const freeCashFlow = input.financialSnapshot?.freeCashFlow;

  const analysis: CompanyAnalysisDraft = {
    ticker: input.ticker,
    dataAsOf: resolveDataAsOf(input),
    summary:
      latestClose && revenue
        ? `${companyName} has recent market price data and a stored revenue snapshot. This view is an informational summary built from available source data.`
        : `${companyName} has partial source data available. Sections with insufficient evidence are marked explicitly.`,
    thesis: "This section records the main observable business and financial themes without making an investment recommendation.",
    businessOverview: input.profile?.description ?? missingDataMessage("business overview"),
    businessModel: input.profile?.industry
      ? `${companyName} is categorized in ${input.profile.industry}. More detailed segment data should be added from filings or provider fundamentals.`
      : missingDataMessage("business model"),
    financialAnalysis:
      revenue || operatingMargin || freeCashFlow
        ? [
            revenue ? `Revenue snapshot: ${formatCurrency(revenue)}.` : null,
            operatingMargin ? `Operating margin snapshot: ${formatPercent(operatingMargin)}.` : null,
            freeCashFlow ? `Free cash flow snapshot: ${formatCurrency(freeCashFlow)}.` : null,
          ]
            .filter(Boolean)
            .join(" ")
        : missingDataMessage("financial analysis"),
    growthDrivers: "Confirm revenue growth, margin trend, product cycle, and recent filings before presenting growth drivers.",
    partners: missingDataMessage("partners"),
    strengths: input.profile?.sector
      ? `Recorded sector context: ${input.profile.sector}. Add source-backed competitive strengths before publishing.`
      : missingDataMessage("strengths"),
    risks: "Track data freshness, margin pressure, leverage, valuation multiple changes, and earnings-date surprises.",
    peers: input.peers,
    watchMetrics: [
      "revenue growth",
      "gross margin",
      "operating margin",
      "free cash flow",
      "debt ratio",
      "valuation multiple",
      "next earnings date",
    ],
    missingData,
    sourceEvidence,
  };

  Object.entries(analysis).forEach(([sectionName, value]) => {
    if (typeof value === "string") {
      assertNoAdviceLanguage(sectionName, value);
    }
  });

  return analysis;
}

function resolveDataAsOf(input: GenerateAnalysisInput) {
  const sourceDate = input.financialSnapshot?.sourceDate ?? input.financialSnapshot?.fiscalDate ?? input.priceBars.at(-1)?.timestamp;

  return sourceDate ? new Date(sourceDate) : null;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value);
}

