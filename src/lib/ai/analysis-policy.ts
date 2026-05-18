const forbiddenAdvicePatterns = [
  /\bbuy\b/i,
  /\bsell\b/i,
  /\bhold\b/i,
  /\btarget price\b/i,
  /\bundervalued\b/i,
  /\bovervalued\b/i,
  /\bshould invest\b/i,
  /\bpersonalized recommendation\b/i,
];

export function containsForbiddenAdvice(text: string) {
  return forbiddenAdvicePatterns.some((pattern) => pattern.test(text));
}

export function assertNoAdviceLanguage(sectionName: string, text: string) {
  if (containsForbiddenAdvice(text)) {
    throw new Error(`Analysis section contains blocked advice language: ${sectionName}`);
  }
}

export function missingDataMessage(sectionName: string) {
  return `Confirmable data is insufficient for ${sectionName}.`;
}

