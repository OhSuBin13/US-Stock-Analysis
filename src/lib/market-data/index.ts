import { env } from "@/lib/env";
import { FmpProvider } from "@/lib/market-data/fmp-provider";
import { MockMarketDataProvider } from "@/lib/market-data/mock-provider";
import { PolygonProvider } from "@/lib/market-data/polygon-provider";
import type {
  FinancialSnapshot,
  MarketDataProvider,
  PeerCandidate,
  PriceBar,
  PriceInterval,
  StockProfile,
  StockSearchResult,
} from "@/lib/market-data/types";

class CompositeMarketDataProvider implements MarketDataProvider {
  constructor(
    private readonly providers: {
      polygon?: MarketDataProvider;
      fmp?: MarketDataProvider;
      fallback: MarketDataProvider;
    },
  ) {}

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    return this.tryProviders((provider) => provider.searchStocks(query));
  }

  async getProfile(ticker: string): Promise<StockProfile | null> {
    return this.tryProviders((provider) => provider.getProfile(ticker));
  }

  async getPriceBars(ticker: string, interval: PriceInterval): Promise<PriceBar[]> {
    return this.tryProviders((provider) => provider.getPriceBars(ticker, interval));
  }

  async getFinancialSnapshot(ticker: string): Promise<FinancialSnapshot | null> {
    return this.tryProviders((provider) => provider.getFinancialSnapshot(ticker));
  }

  async getPeerCandidates(ticker: string): Promise<PeerCandidate[]> {
    return this.tryProviders((provider) => provider.getPeerCandidates(ticker));
  }

  private async tryProviders<T>(request: (provider: MarketDataProvider) => Promise<T>): Promise<T> {
    const ordered = [this.providers.fmp, this.providers.polygon, this.providers.fallback].filter(
      Boolean,
    ) as MarketDataProvider[];

    let lastError: unknown;

    for (const provider of ordered) {
      try {
        const result = await request(provider);

        if (Array.isArray(result) && result.length === 0 && provider !== this.providers.fallback) {
          continue;
        }

        if (result === null && provider !== this.providers.fallback) {
          continue;
        }

        return result;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error("All market data providers failed.");
  }
}

export function getMarketDataProvider(): MarketDataProvider {
  const fallback = new MockMarketDataProvider();

  if (!env.polygonApiKey && !env.fmpApiKey) {
    return fallback;
  }

  return new CompositeMarketDataProvider({
    polygon: env.polygonApiKey ? new PolygonProvider(env.polygonApiKey) : undefined,
    fmp: env.fmpApiKey ? new FmpProvider(env.fmpApiKey) : undefined,
    fallback,
  });
}

