import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AnalysisSectionProps = {
  title: string;
  body: string;
  tone?: "default" | "risk";
};

export function AnalysisSection({ title, body, tone = "default" }: AnalysisSectionProps) {
  return (
    <Card className="border-border bg-surface shadow-panel">
      <CardHeader>
        <CardTitle className={cn(tone === "risk" && "text-risk")}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}

