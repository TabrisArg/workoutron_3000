
/**
 * Checks if two equipment names are similar enough to be considered duplicates.
 * Handles cases like "Swimming Pool" vs "Indoor Swimming Pool".
 */
export const isSimilarName = (name1: string, name2: string): boolean => {
    if (!name1 || !name2) return false;

    const n1 = name1.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    const n2 = name2.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();

    // 1. Exact match (after normalization)
    if (n1 === n2) return true;

    // 2. Substring match (e.g., "Swimming Pool" vs "Indoor Swimming Pool")
    if (n1.includes(n2) || n2.includes(n1)) return true;

    // 3. Word overlap match
    const words1 = n1.split(/\s+/).filter(w => w.length > 2);
    const words2 = n2.split(/\s+/).filter(w => w.length > 2);

    if (words1.length === 0 || words2.length === 0) return false;

    const common = words1.filter(w => words2.includes(w));
    const ratio = common.length / Math.min(words1.length, words2.length);

    // If at least 70% of words in the shorter name appear in the longer one, consider it similar
    return ratio >= 0.7;
};
