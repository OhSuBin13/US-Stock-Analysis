import type { PriceBar } from "@/lib/market-data/types";

type PriceChartProps = {
  bars: PriceBar[];
};

export function PriceChart({ bars }: PriceChartProps) {
  const values = bars.map((bar) => bar.close);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = bars
    .map((bar, index) => {
      const x = bars.length === 1 ? 0 : (index / (bars.length - 1)) * 100;
      const y = 100 - ((bar.close - min) / range) * 80 - 10;

      return `${x},${y}`;
    })
    .join(" ");

  if (bars.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
        Chart data unavailable.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <svg role="img" aria-label="Price chart" viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="price-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,100 ${points} 100,100`} fill="url(#price-area)" stroke="none" />
        <polyline points={points} fill="none" stroke="hsl(var(--primary))" strokeWidth="2.2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>{bars[0]?.timestamp.slice(0, 10)}</span>
        <span>{bars[bars.length - 1]?.timestamp.slice(0, 10)}</span>
      </div>
    </div>
  );
}

