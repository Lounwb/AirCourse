import universitiesData from "../data/universities";
import type { Period } from "../types";

export type UniversityCampusSuggestion = {
  key: string; // e.g. "北京大学（燕园校区）"
  name: string; // same as key for now, but kept for future normalization
  address: string;
  classTimes?: { start: string; end: string }[];
};

function normalize(s: string): string {
  return (s || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[()（）]/g, (m) => (m === "(" ? "（" : m === ")" ? "）" : m));
}

export function searchUniversityCampuses(query: string, limit = 8): UniversityCampusSuggestion[] {
  const q = normalize(query);
  if (!q) return [];

  const entries = Object.entries(universitiesData as Record<string, any>);
  const scored: Array<{ score: number; item: UniversityCampusSuggestion }> = [];

  for (const [key, value] of entries) {
    const address = value?.address || "";
    const hay = normalize(key + " " + address);

    let score = 0;
    if (hay.includes(q)) score += 10;
    if (normalize(key).startsWith(q)) score += 5;
    if (normalize(address).includes(q)) score += 2;
    if (score <= 0) continue;

    scored.push({
      score,
      item: {
        key,
        name: key,
        address,
        classTimes: Array.isArray(value?.classTimes) ? value.classTimes : undefined
      }
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

export function getUniversityCampusByKey(key: string): UniversityCampusSuggestion | null {
  const v: any = (universitiesData as any)[key];
  if (!v) return null;
  return {
    key,
    name: key,
    address: v.address || "",
    classTimes: Array.isArray(v.classTimes) ? v.classTimes : undefined
  };
}

export function classTimesToPeriods(classTimes: { start: string; end: string }[]): Period[] {
  return classTimes.map((t, idx) => ({
    id: idx + 1,
    name: String(idx + 1),
    start: t.start,
    end: t.end
  }));
}

