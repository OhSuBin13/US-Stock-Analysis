import { generateInformationAnalysis } from "@/lib/ai/generate-analysis";
import { getMarketDataProvider } from "@/lib/market-data";

const defaultTickers = ["AAPL", "MSFT", "NVDA"];

async function main() {
  const provider = getMarketDataProvider();

  for (const ticker of defaultTickers) {
    const [profile, priceBars, financialSnapshot, peers] = await Promise.all([
      provider.getProfile(ticker),
      provider.getPriceBars(ticker, "1d"),
      provider.getFinancialSnapshot(ticker),
      provider.getPeerCandidates(ticker),
    ]);

    const analysis = await generateInformationAnalysis({
      ticker,
      profile,
      priceBars,
      financialSnapshot,
      peers,
    });

    console.log(
      JSON.stringify({
        ticker,
        generatedAt: new Date().toISOString(),
        dataAsOf: analysis.dataAsOf?.toISOString() ?? null,
        missingData: analysis.missingData,
      }),
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

