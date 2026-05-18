import { NextResponse } from "next/server";
import { z } from "zod";

const watchlistInputSchema = z.object({
  ticker: z.string().trim().min(1).max(12),
});

export async function GET() {
  return NextResponse.json({
    items: [],
    authRequired: true,
  });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = watchlistInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid ticker." }, { status: 400 });
  }

  return NextResponse.json(
    {
      ticker: parsed.data.ticker.toUpperCase(),
      status: "auth_not_configured",
    },
    { status: 202 },
  );
}

