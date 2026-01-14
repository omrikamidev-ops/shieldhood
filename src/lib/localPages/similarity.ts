/**
 * Uniqueness scoring using Jaccard similarity on 5-word shingles
 */

export function computeSimilarity(text1: string, text2: string): number {
  const shingles1 = getShingles(text1, 5);
  const shingles2 = getShingles(text2, 5);

  const intersection = new Set([...shingles1].filter((x) => shingles2.has(x)));
  const union = new Set([...shingles1, ...shingles2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

function getShingles(text: string, n: number): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const shingles = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    const shingle = words.slice(i, i + n).join(' ');
    shingles.add(shingle);
  }
  return shingles;
}

export function calculateUniquenessScore(draftText: string, existingTexts: string[]): number {
  if (existingTexts.length === 0) return 1.0;

  const similarities = existingTexts.map((existing) => computeSimilarity(draftText, existing));
  const maxSimilarity = Math.max(...similarities);

  return Math.max(0, 1 - maxSimilarity);
}
