export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  redisUrl: process.env.REDIS_URL ?? "",
  polygonApiKey: process.env.POLYGON_API_KEY ?? "",
  fmpApiKey: process.env.FMP_API_KEY ?? "",
  finnhubApiKey: process.env.FINNHUB_API_KEY ?? "",
  aiProvider: process.env.AI_PROVIDER ?? "disabled",
  aiProviderApiKey: process.env.AI_PROVIDER_API_KEY ?? "",
};

export function requireServerEnv(name: keyof typeof env) {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment value: ${name}`);
  }

  return value;
}

