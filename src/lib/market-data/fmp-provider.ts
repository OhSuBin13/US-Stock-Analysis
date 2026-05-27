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
  currency: string;
  exchangeFullName: string;
  exchange: string;
};

type FmpProfileItem = {
  symbol: string;
  companyName: string;
  exchange: string;
  exchangeFullName: string;
  sector: string;
  industry: string;
  marketCap: number;
  description: string;
  website: string;
};

type FmpHistoricalPriceItem = {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type FmpIncomeItem = {
  date?: string;
  revenue?: number;
  grossProfit?: number;
  operatingIncome?: number;
  incomeBeforeTax?: number;
  incomeTaxExpense?: number;
  netIncome?: number;
  bottomLineNetIncome?: number;
  netIncomeFromContinuingOperations?: number;
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

type FmpPeerItem = {
  symbol: string;
  companyName?: string;
  price?: number;
  mktCap?: number;
};

function calculateRatio(numerator?: number, denominator?: number) {
  if (
    numerator === undefined ||
    denominator === undefined ||
    denominator === 0
  ) {
    return undefined;
  }

  return numerator / denominator;
}

function calculateNetIncome(income: FmpIncomeItem) {
  if (income.netIncome !== undefined) {
    return income.netIncome;
  }

  if (income.bottomLineNetIncome !== undefined) {
    return income.bottomLineNetIncome;
  }

  if (income.netIncomeFromContinuingOperations !== undefined) {
    return income.netIncomeFromContinuingOperations;
  }

  if (
    income.incomeBeforeTax !== undefined &&
    income.incomeTaxExpense !== undefined
  ) {
    return income.incomeBeforeTax - income.incomeTaxExpense;
  }

  return undefined;
}

export class FmpProvider implements MarketDataProvider {
  constructor(private readonly apiKey: string) {}

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    const url = this.createUrl("/stable/search-name", {
      query,
      limit: "10",
      exchange: "NASDAQ,NYSE,AMEX",
    });

    const response = await fetchJson<FmpSearchItem[]>(url.toString());

    return response.map((item) => ({
      ticker: item.symbol,
      companyName: item.name,
      exchange: item.exchange,
    }));
  }

  async getProfile(ticker: string): Promise<StockProfile | null> {
    const url = this.createUrl("/stable/profile", {
      symbol: ticker.toUpperCase(),
    });
    const [profile] = await fetchJson<FmpProfileItem[]>(url.toString());

    if (!profile) {
      return null;
    }

    return {
      ticker: profile.symbol,
      companyName: profile.companyName,
      exchange: profile.exchange,
      sector: profile.sector,
      industry: profile.industry,
      marketCap: profile.marketCap,
      description: profile.description,
      website: profile.website,
    };
  }

  async getPriceBars(
    ticker: string,
    interval: PriceInterval,
  ): Promise<PriceBar[]> {
    if (interval === "1d") {
      const url = this.createUrl("/stable/historical-price-eod/full", {
        symbol: ticker.toUpperCase(),
      });
      const response = await fetchJson<FmpHistoricalPriceItem[]>(
        url.toString(),
      );

      return response.map((item) => ({
        ticker: item.symbol,
        interval,
        timestamp: item.date,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
      }));
    }
    return [];
  }

  async getFinancialSnapshot(
    ticker: string,
  ): Promise<FinancialSnapshot | null> {
    const [income, balance, cashFlow] = await Promise.all([
      fetchJson<FmpIncomeItem[]>(
        this.createUrl("/stable/income-statement", {
          symbol: ticker.toUpperCase(),
          limit: "1",
        }).toString(),
      ),
      fetchJson<FmpBalanceItem[]>(
        this.createUrl("/stable/balance-sheet-statement", {
          symbol: ticker.toUpperCase(),
          limit: "1",
        }).toString(),
      ),
      fetchJson<FmpCashFlowItem[]>(
        this.createUrl("/stable/cash-flow-statement", {
          symbol: ticker.toUpperCase(),
          limit: "1",
        }).toString(),
      ),
    ]);

    const latestIncome = income[0];

    if (!latestIncome) {
      return null;
    }

    const grossProfitRatio = calculateRatio(
      latestIncome.grossProfit,
      latestIncome.revenue,
    );
    const operatingIncomeRatio = calculateRatio(
      latestIncome.operatingIncome,
      latestIncome.revenue,
    );
    const netIncome = calculateNetIncome(latestIncome);

    return {
      ticker: ticker.toUpperCase(),
      period: "FY",
      fiscalDate: latestIncome.date,
      revenue: latestIncome.revenue,
      grossMargin: grossProfitRatio,
      operatingMargin: operatingIncomeRatio,
      netIncome,
      eps: latestIncome.eps,
      freeCashFlow: cashFlow[0]?.freeCashFlow,
      debt: balance[0]?.totalDebt,
      cash: balance[0]?.cashAndCashEquivalents,
      source: "financial-modeling-prep",
      sourceDate: new Date().toISOString(),
    };
  }

  async getPeerCandidates(ticker: string): Promise<PeerCandidate[]> {
    const url = this.createUrl("/stable/stock-peers", {
      symbol: ticker.toUpperCase(),
    });
    const response = await fetchJson<FmpPeerItem[]>(url.toString());

    return response
      .filter((peer) => peer.symbol)
      .slice(0, 10)
      .map((peer) => ({
        ticker: peer.symbol,
        companyName: peer.companyName,
        marketCap: peer.mktCap,
      }));
  }

  private createUrl(path: string, searchParams: Record<string, string> = {}) {
    const url = new URL(path, "https://financialmodelingprep.com");
    Object.entries(searchParams).forEach(([key, value]) =>
      url.searchParams.set(key, value),
    );
    url.searchParams.set("apikey", this.apiKey);

    return url;
  }
}
