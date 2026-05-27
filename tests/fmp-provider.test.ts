import { afterEach, describe, expect, it, vi } from "vitest";
import { FmpProvider } from "@/lib/market-data/fmp-provider";

function jsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
    },
  });
}

describe("FmpProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("searches stocks through the stable name search endpoint", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          symbol: "AAPL",
          name: "Apple Inc.",
          currency: "USD",
          exchangeFullName: "NASDAQ Global Select",
          exchange: "NASDAQ",
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new FmpProvider("test-key");
    const results = await provider.searchStocks("apple");
    const url = new URL(fetchMock.mock.calls[0][0] as string);

    expect(url.pathname).toBe("/stable/search-name");
    expect(url.searchParams.get("query")).toBe("apple");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("exchange")).toBe("NASDAQ,NYSE,AMEX");
    expect(url.searchParams.get("apikey")).toBe("test-key");
    expect(results).toEqual([
      {
        ticker: "AAPL",
        companyName: "Apple Inc.",
        exchange: "NASDAQ",
      },
    ]);
  });

  it("maps stable company profile response fields", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          symbol: "AAPL",
          companyName: "Apple Inc.",
          exchange: "NASDAQ",
          sector: "Technology",
          industry: "Consumer Electronics",
          marketCap: 3000000000000,
          description: "Example description",
          website: "https://www.apple.com",
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new FmpProvider("test-key");
    const profile = await provider.getProfile("aapl");
    const url = new URL(fetchMock.mock.calls[0][0] as string);

    expect(url.pathname).toBe("/stable/profile");
    expect(url.searchParams.get("symbol")).toBe("AAPL");
    expect(profile).toEqual({
      ticker: "AAPL",
      companyName: "Apple Inc.",
      exchange: "NASDAQ",
      sector: "Technology",
      industry: "Consumer Electronics",
      marketCap: 3000000000000,
      description: "Example description",
      website: "https://www.apple.com",
    });
  });

  it("fetches financial snapshots from stable statement endpoints", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse([
          {
            date: "2024-09-28",
            symbol: "AAPL",
            reportedCurrency: "USD",
            period: "FY",
            revenue: 391035000000,
            grossProfit: 180683000000,
            operatingIncome: 123216000000,
            netIncome: 93736000000,
            eps: 6.11,
          },
        ]),
      )
      .mockResolvedValueOnce(
        jsonResponse([
          {
            date: "2025-09-27",
            totalDebt: 106629000000,
            cashAndCashEquivalents: 29943000000,
          },
        ]),
      )
      .mockResolvedValueOnce(
        jsonResponse([
          {
            date: "2025-09-27",
            freeCashFlow: 108807000000,
          },
        ]),
      );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new FmpProvider("test-key");
    const snapshot = await provider.getFinancialSnapshot("aapl");
    const paths = fetchMock.mock.calls.map(([url]) => new URL(url as string).pathname);

    expect(paths).toEqual([
      "/stable/income-statement",
      "/stable/balance-sheet-statement",
      "/stable/cash-flow-statement",
    ]);
    expect(snapshot).toMatchObject({
      ticker: "AAPL",
      period: "FY",
      fiscalDate: "2024-09-28",
      revenue: 391035000000,
      netIncome: 93736000000,
      eps: 6.11,
      freeCashFlow: 108807000000,
      debt: 106629000000,
      cash: 29943000000,
      source: "financial-modeling-prep",
    });
    expect(snapshot?.grossMargin).toBeCloseTo(180683000000 / 391035000000);
    expect(snapshot?.operatingMargin).toBeCloseTo(123216000000 / 391035000000);
  });

  it("maps stable peer object responses", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse([
        {
          symbol: "GOOGL",
          companyName: "Alphabet Inc.",
          price: 388.88,
          mktCap: 4703453159542,
        },
        {
          symbol: "META",
          companyName: "Meta Platforms, Inc.",
          price: 612.34,
          mktCap: 1554378203126,
        },
      ]),
    );
    vi.stubGlobal("fetch", fetchMock);

    const provider = new FmpProvider("test-key");
    const peers = await provider.getPeerCandidates("aapl");
    const url = new URL(fetchMock.mock.calls[0][0] as string);

    expect(url.pathname).toBe("/stable/stock-peers");
    expect(url.searchParams.get("symbol")).toBe("AAPL");
    expect(peers).toEqual([
      {
        ticker: "GOOGL",
        companyName: "Alphabet Inc.",
        marketCap: 4703453159542,
      },
      {
        ticker: "META",
        companyName: "Meta Platforms, Inc.",
        marketCap: 1554378203126,
      },
    ]);
  });
});
