export type PriceInterval = "1d" | "1h" | "15m";

export type StockSearchResult = {
  ticker: string;
  companyName: string;
  exchange?: string;
  sector?: string;
  industry?: string;
};

export type StockProfile = StockSearchResult & {
  marketCap?: number;
  description?: string;
  website?: string;
};

export type PriceBar = {
  ticker: string;
  interval: PriceInterval;
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
};

export type FinancialSnapshot = {
  ticker: string;
  period: string;
  fiscalDate?: string;
  revenue?: number;
  grossMargin?: number;
  operatingMargin?: number;
  netIncome?: number;
  eps?: number;
  freeCashFlow?: number;
  debt?: number;
  cash?: number;
  source?: string;
  sourceDate?: string;
};

export type PeerCandidate = {
  ticker: string;
  companyName?: string;
  sector?: string;
  industry?: string;
  marketCap?: number;
};

export interface MarketDataProvider {
  searchStocks(query: string): Promise<StockSearchResult[]>;
  getProfile(ticker: string): Promise<StockProfile | null>;
  getPriceBars(ticker: string, interval: PriceInterval): Promise<PriceBar[]>;
  getFinancialSnapshot(ticker: string): Promise<FinancialSnapshot | null>;
  getPeerCandidates(ticker: string): Promise<PeerCandidate[]>;
}

