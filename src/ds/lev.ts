// Dynamic Programming Levenshtein Distance for Typo-Tolerant Queries

export function levenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;

  if (al === 0) return bl;
  if (bl === 0) return al;

  const dp: number[][] = Array.from({ length: al + 1 }, (_, i) => [
    i,
    ...Array(bl).fill(0),
  ]);

  for (let j = 1; j <= bl; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // deletion
        dp[i][j - 1] + 1, // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return dp[al][bl];
}

export function fuzzyMatches(token: string, keyword: string, maxDist = 1): boolean {
  if (token === keyword) return true;
  if (Math.abs(token.length - keyword.length) > maxDist) return false;
  return levenshtein(token, keyword) <= maxDist;
}
