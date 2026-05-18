import { Star } from "lucide-react";

export function WatchlistTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="px-3 py-3 font-medium">Ticker</th>
            <th className="px-3 py-3 font-medium">Current price</th>
            <th className="px-3 py-3 font-medium">Daily change</th>
            <th className="px-3 py-3 font-medium">Latest analysis</th>
            <th className="px-3 py-3 font-medium">Key risk note</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={5} className="px-3 py-12 text-center text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <Star className="h-6 w-6" aria-hidden="true" />
                Watchlist entries will appear after authentication is configured.
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

