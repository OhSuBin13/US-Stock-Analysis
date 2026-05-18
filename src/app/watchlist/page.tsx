import { WatchlistTable } from "@/components/watchlist/watchlist-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Watchlist</h1>
        <p className="mt-2 text-muted-foreground">
          Saved stocks will show current price, daily change, latest analysis time, and key risk notes.
        </p>
      </div>
      <Card className="border-border bg-surface shadow-panel">
        <CardHeader>
          <CardTitle>Saved stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <WatchlistTable />
        </CardContent>
      </Card>
    </div>
  );
}

