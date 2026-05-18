import type {
  FinancialSnapshot,
  MarketDataProvider,
  PeerCandidate,
  PriceBar,
  PriceInterval,
  StockProfile,
  StockSearchResult,
} from "@/lib/market-data/types";

const mockProfiles: StockProfile[] = [
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Consumer Electronics",
    marketCap: 3000000000000,
    description: "Apple designs devices, software, and services for consumers and businesses.",
    website: "https://www.apple.com",
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Software Infrastructure",
    marketCap: 2800000000000,
    description: "Microsoft provides cloud, productivity, operating system, gaming, and enterprise software.",
    website: "https://www.microsoft.com",
  },
  {
    ticker: "NVDA",
    companyName: "NVIDIA Corporation",
    exchange: "NASDAQ",
    sector: "Technology",
    industry: "Semiconductors",
    marketCap: 2500000000000,
    description: "NVIDIA designs GPUs, accelerated computing platforms, and AI infrastructure products.",
    website: "https://www.nvidia.com",
  },
];

export class MockMarketDataProvider implements MarketDataProvider {
  async searchStocks(query: string): Promise<StockSearchResult[]> {
    const normalized = query.toUpperCase();

    return mockProfiles.filter(
      (profile) =>
        profile.ticker.includes(normalized) ||
        profile.companyName.toUpperCase().includes(normalized),
    );
  }

  async getProfile(ticker: string): Promise<StockProfile | null> {
    return mockProfiles.find((profile) => profile.ticker === ticker.toUpperCase()) ?? null;
  }

  async getPriceBars(ticker: string, interval: PriceInterval): Promise<PriceBar[]> {
    const base = ticker.toUpperCase() === "NVDA" ? 880 : ticker.toUpperCase() === "MSFT" ? 420 : 190;

    return Array.from({ length: 40 }, (_, index) => {
      const close = base + Math.sin(index / 3) * 8 + index * 0.7;
      const date = new Date(Date.UTC(2026, 0, 2 + index));

      return {
        ticker: ticker.toUpperCase(),
        interval,
        timestamp: date.toISOString(),
        open: close - 2,
        high: close + 4,
        low: close - 5,
        close,
        volume: 45000000 + index * 100000,
      };
    });
  }

  async getFinancialSnapshot(ticker: string): Promise<FinancialSnapshot | null> {
    return {
      ticker: ticker.toUpperCase(),
      period: "FY",
      fiscalDate: "2025-12-31",
      revenue: 385000000000,
      grossMargin: 0.46,
      operatingMargin: 0.31,
      netIncome: 98000000000,
      eps: 6.12,
      freeCashFlow: 104000000000,
      debt: 108000000000,
      cash: 62000000000,
      source: "mock",
      sourceDate: "2026-01-15",
    };
  }

  async getPeerCandidates(ticker: string): Promise<PeerCandidate[]> {
    return mockProfiles.filter((profile) => profile.ticker !== ticker.toUpperCase()).slice(0, 5);
  }
}

