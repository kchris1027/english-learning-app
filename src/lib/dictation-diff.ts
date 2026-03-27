export interface DiffWord {
  text: string;
  type: "correct" | "incorrect" | "missing" | "extra";
}

export interface DiffResult {
  words: DiffWord[];
  score: number;
}

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s']/g, "")
    .split(/\s+/)
    .filter(Boolean);
}

export function compareSentences(
  userInput: string,
  reference: string
): DiffResult {
  const userWords = normalize(userInput);
  const refWords = normalize(reference);

  if (refWords.length === 0) {
    return {
      words: userWords.map((w) => ({ text: w, type: "extra" })),
      score: userWords.length === 0 ? 100 : 0,
    };
  }

  if (userWords.length === 0) {
    return {
      words: refWords.map((w) => ({ text: w, type: "missing" })),
      score: 0,
    };
  }

  const m = userWords.length;
  const n = refWords.length;

  // LCS via DP to align words optimally
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0)
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (userWords[i - 1] === refWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const result: DiffWord[] = [];
  let i = m;
  let j = n;

  const stack: DiffWord[] = [];
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && userWords[i - 1] === refWords[j - 1]) {
      stack.push({ text: refWords[j - 1], type: "correct" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      stack.push({ text: refWords[j - 1], type: "missing" });
      j--;
    } else {
      stack.push({ text: userWords[i - 1], type: "extra" });
      i--;
    }
  }

  // Reverse since we backtracked
  for (let k = stack.length - 1; k >= 0; k--) {
    result.push(stack[k]);
  }

  // Mark adjacent extra+missing pairs as "incorrect" (substitutions)
  for (let k = 0; k < result.length - 1; k++) {
    if (
      (result[k].type === "extra" && result[k + 1].type === "missing") ||
      (result[k].type === "missing" && result[k + 1].type === "extra")
    ) {
      const missingIdx = result[k].type === "missing" ? k : k + 1;
      const extraIdx = result[k].type === "extra" ? k : k + 1;
      result[missingIdx] = {
        text: result[extraIdx].text,
        type: "incorrect",
      };
      result.splice(extraIdx > missingIdx ? extraIdx : missingIdx, 1);
    }
  }

  const correctCount = result.filter((w) => w.type === "correct").length;
  const score = Math.round((correctCount / refWords.length) * 100);

  return { words: result, score };
}
