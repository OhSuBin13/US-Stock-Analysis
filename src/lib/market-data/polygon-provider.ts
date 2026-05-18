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

type PolygonTickerResult = {
  ticker: string;
  name: string;
  primary_exchange?: string;
  market?: string;
};

type PolygonSearchResponse = {
  results?: PolygonTickerResult[];
};

type PolygonAggResponse = {
  results?: Array<{
    t: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v?: number;
  }>;
};

export class PolygonProvider implements MarketDataProvider {
  constructor(private readonly apiKey: string) {}

  async searchStocks(query: string): Promise<StockSearchResult[]> {
    const url = new URL("https://api.polygon.io/v3/reference/tickers");
    url.searchParams.set("market", "stocks");
    url.searchParams.set("active", "true");
    url.searchParams.set("limit", "10");
    url.searchParams.set("search", query);
    url.searchParams.set("apiKey", this.apiKey);

    const response = await fetchJson<PolygonSearchResponse>(url.toString());

    return (response.results ?? []).map((item) => ({
      ticker: item.ticker,
      companyName: item.name,
      exchange: item.primary_exchange,
    }));
  }

  async getProfile(ticker: string): Promise<StockProfile | null> {
    const url = new URL(`https://api.polygon.io/v3/reference/tickers/${ticker.toUpperCase()}`);
    url.searchParams.set("apiKey", this.apiKey);

    const response = await fetchJson<{ results?: PolygonTickerResult & { description?: string; homepage_url?: string } }>(
      url.toString(),
    );

    if (!response.results) {
      return null;
    }

    return {
      ticker: response.results.ticker,
      companyName: response.results.name,
      exchange: response.results.primary_exchange,
      description: response.results.description,
      website: response.results.homepage_url,
    };
  }

  async getPriceBars(ticker: string, interval: PriceInterval): Promise<PriceBar[]> {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 90);

    const rangeMultiplier = interval === "1d" ? 1 : interval === "1h" ? 1 : 15;
    const rangeUnit = interval === "1d" ? "day" : interval === "1h" ? "hour" : "minute";
    const url = new URL(
      `https://api.polygon.io/v2/aggs/ticker/${ticker.toUpperCase()}/range/${rangeMultiplier}/${rangeUnit}/${formatDate(from)}/${formatDate(to)}`,
    );
    url.searchParams.set("adjusted", "true");
    url.searchParams.set("sort", "asc");
    url.searchParams.set("limit", "5000");
    url.searchParams.set("apiKey", this.apiKey);

    const response = await fetchJson<PolygonAggResponse>(url.toString());

    return (response.results ?? []).map((bar) => ({
      ticker: ticker.toUpperCase(),
      interval,
      timestamp: new Date(bar.t).toISOString(),
      open: bar.o,
      high: bar.h,
      low: bar.l,
      close: bar.c,
      volume: bar.v,
    }));
  }

  async getFinancialSnapshot(_ticker: string): Promise<FinancialSnapshot | null> {
    return null;
  }

  async getPeerCandidates(_ticker: string): Promise<PeerCandidate[]> {
    return [];
  }
}

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

