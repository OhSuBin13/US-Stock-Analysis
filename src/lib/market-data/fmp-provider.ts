import { fetchJson } from "@/lib/market-data/http";
import type {
  FinancialSnapshot,
  MarketDataProvider,
  PeerCandidate,
  PriceBar,
  PriceInterval,
  StockProfile,
  StockSearchResult,
} from "@/lib/market-data/types";

type FmpSearchItem = {
  symbol: string;
  name: string;
  exchangeShortName?: string;
};

type FmpProfileItem = {
  symbol: string;
  companyName: string;
  exchangeShortName?: string;
  sector?: string;
  industry?: string;
  mktCap?: number;
  description?: string;
  website?: string;
};

type FmpIncomeItem = {
  date?: string;
  revenue?: number;
  grossProfitRatio?: number;
  operatingIncomeRatio?: number;
  netIncome?: number;
  eps?: number;
};

type FmpBalanceItem = {
  date?: string;
  totalDebt?: number;
  cashAndCashEquivalents?: number;
};

type FmpCashFlowItem = {
  date?: string;
  freeCashFlow?: number;
};

export class FmpProvider implements MarketDataProvider {
  constructor(private readonly apiKey: string) {}

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    const url = new URL("https://financialmodelingprep.com/api/v3/search");
    url.searchParams.set("query", query);
    url.searchParams.set("limit", "10");
    url.searchParams.set("exchange", "NASDAQ,NYSE,AMEX");
    url.searchParams.set("apikey", this.apiKey);

    const response = await fetchJson<FmpSearchItem[]>(url.toString());

    return response.map((item) => ({
      ticker: item.symbol,
      companyName: item.name,
      exchange: item.exchangeShortName,
    }));
  }

  async getProfile(ticker: string): Promise<StockProfile | null> {
    const url = this.createUrl(`/api/v3/profile/${ticker.toUpperCase()}`);
    const [profile] = await fetchJson<FmpProfileItem[]>(url.toString());

    if (!profile) {
      return null;
    }

    return {
      ticker: profile.symbol,
      companyName: profile.companyName,
      exchange: profile.exchangeShortName,
      sector: profile.sector,
      industry: profile.industry,
      marketCap: profile.mktCap,
      description: profile.description,
      website: profile.website,
    };
  }

  async getPriceBars(_ticker: string, _interval: PriceInterval): Promise<PriceBar[]> {
    return [];
  }

  async getFinancialSnapshot(ticker: string): Promise<FinancialSnapshot | null> {
    const normalizedTicker = ticker.toUpperCase();
    const [income, balance, cashFlow] = await Promise.all([
      fetchJson<FmpIncomeItem[]>(this.createUrl(`/api/v3/income-statement/${normalizedTicker}`, { limit: "1" }).toString()),
      fetchJson<FmpBalanceItem[]>(this.createUrl(`/api/v3/balance-sheet-statement/${normalizedTicker}`, { limit: "1" }).toString()),
      fetchJson<FmpCashFlowItem[]>(this.createUrl(`/api/v3/cash-flow-statement/${normalizedTicker}`, { limit: "1" }).toString()),
    ]);

    const latestIncome = income[0];

    if (!latestIncome) {
      return null;
    }

    return {
      ticker: normalizedTicker,
      period: "FY",
      fiscalDate: latestIncome.date,
      revenue: latestIncome.revenue,
      grossMargin: latestIncome.grossProfitRatio,
      operatingMargin: latestIncome.operatingIncomeRatio,
      netIncome: latestIncome.netIncome,
      eps: latestIncome.eps,
      freeCashFlow: cashFlow[0]?.freeCashFlow,
      debt: balance[0]?.totalDebt,
      cash: balance[0]?.cashAndCashEquivalents,
      source: "financial-modeling-prep",
      sourceDate: new Date().toISOString(),
    };
  }

  async getPeerCandidates(ticker: string): Promise<PeerCandidate[]> {
    const url = this.createUrl(`/api/v4/stock_peers`, { symbol: ticker.toUpperCase() });
    const response = await fetchJson<Array<{ peersList?: string[] }>>(url.toString());

    return (response[0]?.peersList ?? []).slice(0, 10).map((peerTicker) => ({
      ticker: peerTicker,
    }));
  }

  private createUrl(path: string, searchParams: Record<string, string> = {}) {
    const url = new URL(path, "https://financialmodelingprep.com");
    Object.entries(searchParams).forEach(([key, value]) => url.searchParams.set(key, value));
    url.searchParams.set("apikey", this.apiKey);

    return url;
  }
}

