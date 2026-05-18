import Link from "next/link";
import { ArrowRight, Database, ShieldCheck, Sparkles } from "lucide-react";
import { StockSearch } from "@/components/search/stock-search";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const workflows = [
  {
    title: "Source-backed data",
    description: "Normalize market prices, profiles, financials, peer candidates, and source dates before rendering.",
    icon: Database,
  },
  {
    title: "Informational summaries",
    description: "Generate structured analysis only from available data and mark missing sections instead of guessing.",
    icon: Sparkles,
  },
  {
    title: "No advice language",
    description: "Block buy, sell, target price, and personalized recommendation wording by default.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="max-w-3xl text-4xl font-semibold tracking-normal text-foreground sm:text-5xl">
              Search a US stock and review the data-backed analysis.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground">
              Start with a ticker or company name. The scaffold is wired for API-backed search, chart data,
              financial snapshots, peer context, and policy-safe analysis text.
            </p>
          </div>
          <StockSearch />
        </div>

        <Card className="border-border bg-surface shadow-panel">
          <CardHeader>
            <CardTitle>Dashboard sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 text-sm">
              {[
                "Price chart",
                "Investment summary",
                "Business overview",
                "Financial analysis",
                "Growth drivers",
                "Partners and strengths",
                "Risk factors",
                "Peer comparison",
                "Watch metrics",
              ].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                  <span>{item}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {workflows.map((workflow) => {
          const Icon = workflow.icon;

          return (
            <Card key={workflow.title} className="border-border bg-surface shadow-panel">
              <CardHeader>
                <Icon className="mb-2 h-5 w-5 text-primary" aria-hidden="true" />
                <CardTitle>{workflow.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{workflow.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="rounded-lg border border-border bg-surface p-5 shadow-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Try the mock dashboard</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Mock data is available until provider keys are configured.
            </p>
          </div>
          <Link
            href="/stocks/AAPL"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Open AAPL
          </Link>
        </div>
      </section>
    </div>
  );
}
