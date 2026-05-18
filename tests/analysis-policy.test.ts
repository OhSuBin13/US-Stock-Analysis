import { describe, expect, it } from "vitest";
import { assertNoAdviceLanguage, containsForbiddenAdvice } from "@/lib/ai/analysis-policy";

describe("analysis policy", () => {
  it("detects advice-like wording", () => {
    expect(containsForbiddenAdvice("This is a buy candidate.")).toBe(true);
    expect(containsForbiddenAdvice("This summary is informational.")).toBe(false);
  });

  it("throws when a section contains blocked wording", () => {
    expect(() => assertNoAdviceLanguage("summary", "target price is higher")).toThrow();
  });
});

